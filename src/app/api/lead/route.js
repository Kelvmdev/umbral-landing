// Proxy serverless al formulario de HubSpot. El navegador nunca habla con
// HubSpot directo (evita bloqueadores) y los IDs viven en variables de entorno.
const PORTAL = process.env.HUBSPOT_PORTAL_ID;
const FORM = process.env.HUBSPOT_FORM_ID;

export async function POST(req) {
  let b;
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { nombre, correo, celular, interes, mensaje, pageUri, pageName } = b || {};
  if (!correo || !String(correo).trim()) {
    return Response.json({ ok: false, error: "missing_email" }, { status: 400 });
  }

  // Modo dev: sin credenciales, aceptamos para poder probar el flujo → /gracias
  if (!PORTAL || !FORM) {
    console.log("[lead] (dev, sin HubSpot):", { nombre, correo, celular, interes });
    return Response.json({ ok: true, dev: true });
  }

  // Mapeo a propiedades ESTÁNDAR de HubSpot (existen en cualquier cuenta)
  const cuerpoMensaje = [interes ? `Interés: ${interes}` : null, mensaje]
    .filter(Boolean)
    .join("\n");
  const campos = [
    ["firstname", nombre],
    ["email", correo],
    ["phone", celular],
    ["message", cuerpoMensaje],
  ].filter(([, v]) => v && String(v).trim());

  const payload = {
    submittedAt: Date.now(),
    fields: campos.map(([name, value]) => ({
      objectTypeId: "0-1",
      name,
      value: String(value).trim(),
    })),
    context: { pageUri, pageName },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: "Acepto que Umbral me contacte sobre propiedades de mi interés.",
      },
    },
  };

  try {
    const r = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL}/${FORM}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      console.error("[lead] HubSpot rechazó:", r.status, t);
      return Response.json({ ok: false, error: "hubspot_error" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[lead] error de red:", e);
    return Response.json({ ok: false, error: "network" }, { status: 502 });
  }
}
