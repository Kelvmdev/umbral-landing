import Anthropic from "@anthropic-ai/sdk";
import { construirSystemPrompt } from "@/lib/asesor-prompt";

// ponytail: opus-4-8 es el recomendado. Para ~5x menos costo en un chat público
// de alto tráfico, cambia a "claude-haiku-4-5".
const MODELO = "claude-opus-4-8";

export async function POST(req) {
  // Sin clave configurada → la UI muestra un mensaje amable y no rompe la página
  if (!process.env.ANTHROPIC_API_KEY) {
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
  const messages = entrada
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "sin_mensaje" }, { status: 400 });
  }

  const client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const s = client.messages.stream({
          model: MODELO,
          max_tokens: 1024,
          system: construirSystemPrompt(),
          messages,
        });
        s.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
        await s.finalMessage();
      } catch (e) {
        console.error("[asesor] error:", e);
        controller.enqueue(
          encoder.encode(
            "\n\nLo siento, tuve un problema para responder. Escríbenos por WhatsApp y te ayudamos. 🙏"
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
