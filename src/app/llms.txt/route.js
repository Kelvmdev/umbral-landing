import { SITE_URL } from "@/lib/site";
import { sitio } from "@/lib/sitio";
import { propiedades, formatPrecio } from "@/lib/propiedades";

// /llms.txt — resumen legible para IA (ChatGPT, Perplexity, Claude). Se genera
// desde los datos del catálogo, así que se mantiene exacto aunque cambie el CMS.
export const dynamic = "force-static";

export function GET() {
  const lineas = [
    `# ${sitio.marca.nombre} — ${sitio.marca.tagline}`,
    "",
    "> Inmobiliaria en Medellín y el Valle de Aburrá (Antioquia, Colombia). Propiedades en venta y arriendo.",
    "",
    `Contacto: ${sitio.contacto.email} · WhatsApp ${sitio.contacto.tel}`,
    "",
    "## Propiedades",
    ...propiedades.map(
      (p) =>
        `- [${p.titulo}](${SITE_URL}/propiedad/${p.slug}) — ${p.tipo}, ${p.operacion}, ${formatPrecio(p)}, ${p.habitaciones} hab, ${p.banos} baños, ${p.area_m2} m², ${p.direccion}`
    ),
    "",
    "## Preguntas frecuentes",
    ...sitio.faqs.map((f) => `- **${f.q}** ${f.a}`),
    "",
  ];

  return new Response(lineas.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
