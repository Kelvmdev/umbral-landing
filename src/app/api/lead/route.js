// Proxy serverless del formulario de interés. El navegador no habla directo
// con el proveedor; los IDs viven en variables de entorno.
// Prioridad: Formspree → HubSpot → modo dev (acepta sin enviar, para probar).
const FORMSPREE_ID = process.env.FORMSPREE_ID;
const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
const HUBSPOT_FORM_ID = process.env.HUBSPOT_FORM_ID;

export async function POST(req) {
  let b;
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { nombre, correo, celular, interes, tipo, mensaje, pageUri, pageName } = b || {};
  if (!correo || !String(correo).trim()) {
    return Response.json({ ok: false, error: "missing_email" }, { status: 400 });
  }

  // ── Formspree ──────────────────────────────────────────────────────────
  if (FORMSPREE_ID) {
    try {
      const r = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: correo, // Formspree usa "email" como reply-to
          nombre,
          celular,
          interes,
          tipo,
          mensaje,
          _subject: `Nuevo lead Umbral: ${nombre || correo} (${interes || "—"})`,
          pageUri,
          pageName,
        }),
      });
      if (!r.ok) {
        const t = await r.text().catch(() => "");
        console.error("[lead] Formspree rechazó:", r.status, t);
        return Response.json({ ok: false, error: "formspree_error" }, { status: 502 });
      }
      return Response.json({ ok: true });
    } catch (e) {
      console.error("[lead] error de red (Formspree):", e);
      return Response.json({ ok: false, error: "network" }, { status: 502 });
    }
  }

  // ── HubSpot ──────────────────────────────────────────────────────────────
  if (HUBSPOT_PORTAL_ID && HUBSPOT_FORM_ID) {
    const cuerpoMensaje = [
      interes ? `Interés: ${interes}` : null,
      tipo ? `Tipo: ${tipo}` : null,
      mensaje,
    ]
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
      fields: campos.map(([name, value]) => ({ objectTypeId: "0-1", name, value: String(value).trim() })),
      context: { pageUri, pageName },
      legalConsentOptions: {
        consent: { consentToProcess: true, text: "Acepto que Umbral me contacte sobre propiedades de mi interés." },
      },
    };
    try {
      const r = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      if (!r.ok) {
        const t = await r.text().catch(() => "");
        console.error("[lead] HubSpot rechazó:", r.status, t);
        return Response.json({ ok: false, error: "hubspot_error" }, { status: 502 });
      }
      return Response.json({ ok: true });
    } catch (e) {
      console.error("[lead] error de red (HubSpot):", e);
      return Response.json({ ok: false, error: "network" }, { status: 502 });
    }
  }

  // ── Modo dev: sin proveedor configurado, aceptamos para probar el flujo ──
  console.log("[lead] (dev, sin proveedor):", { nombre, correo, celular, interes, tipo });
  return Response.json({ ok: true, dev: true });
}
