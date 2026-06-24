// Capa de datos del catálogo. La fuente ahora es el JSON editable del CMS
// (src/content/propiedades.json); el panel /admin lo reescribirá vía GitHub.
import propiedades from "@/content/propiedades.json";

export { propiedades };

/** Formatea un precio según la moneda; arriendo se anota como "/mes". */
export function formatPrecio({ precio, moneda, operacion }) {
  const fmt = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: moneda || "COP",
    maximumFractionDigits: 0,
  }).format(precio);
  return operacion === "arriendo" ? `${fmt}/mes` : fmt;
}

export function getPropiedad(slug) {
  return propiedades.find((p) => p.slug === slug) || null;
}

export function slugsPropiedades() {
  return propiedades.map((p) => p.slug);
}
