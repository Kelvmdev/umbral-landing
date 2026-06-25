import { construirSystemPrompt } from "@/lib/asesor-prompt";

// Groq: capa gratis, rápido. API compatible con OpenAI.
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// ponytail: modelo gratis y capaz. Alternativa más ligera: "llama-3.1-8b-instant".
const MODELO = "llama-3.3-70b-versatile";

export async function POST(req) {
  // Sin clave configurada → la UI muestra un mensaje amable y no rompe la página
  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "sin_configurar" }, { status: 503 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "json_invalido" }, { status: 400 });
  }

  // Saneamos el historial: solo roles válidos, texto, y acotamos tamaño/cantidad
  const entrada = Array.isArray(body?.mensajes) ? body.mensajes : [];
  const historial = entrada
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (!historial.length || historial[historial.length - 1].role !== "user") {
    return Response.json({ error: "sin_mensaje" }, { status: 400 });
  }

  // Formato OpenAI: el system va como primer mensaje
  const payload = {
    model: MODELO,
    stream: true,
    max_tokens: 1024,
    temperature: 0, // datos de catálogo: queremos exactitud, no creatividad
    messages: [{ role: "system", content: construirSystemPrompt() }, ...historial],
  };

  let upstream;
  try {
    upstream = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("[asesor] red Groq:", e);
    return Response.json({ error: "red" }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    const t = await upstream.text().catch(() => "");
    console.error("[asesor] Groq rechazó:", upstream.status, t);
    return Response.json({ error: "upstream" }, { status: 502 });
  }

  // Transforma el SSE de Groq (estilo OpenAI) en texto plano para el widget
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();

  const stream = new ReadableStream({
    async start(controller) {
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lineas = buffer.split("\n");
          buffer = lineas.pop() ?? ""; // guarda la línea incompleta
          for (const linea of lineas) {
            const l = linea.trim();
            if (!l.startsWith("data:")) continue;
            const data = l.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // fragmento aún incompleto; se completa en la próxima vuelta
            }
          }
        }
        controller.close();
      } catch (e) {
        console.error("[asesor] stream:", e);
        controller.enqueue(
          encoder.encode("\n\nLo siento, tuve un problema. Escríbenos por WhatsApp. 🙏")
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
