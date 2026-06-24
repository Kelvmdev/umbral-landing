// Datos del sitio (marca, hero, contacto, redes, ubicación, FAQs).
// Fuente editable del CMS: src/content/sitio.json.
import sitio from "@/content/sitio.json";

export { sitio };
export const faqs = sitio.faqs;

/** Enlace de WhatsApp listo a partir del número del sitio. */
export const waHref = `https://wa.me/${sitio.contacto.whatsapp}`;
