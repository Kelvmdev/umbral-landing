import { SITE_URL } from "@/lib/site";
import { slugsPropiedades } from "@/lib/propiedades";

// Next genera /sitemap.xml desde aquí: home, preguntas y una entrada por propiedad.
export default function sitemap() {
  const estaticas = ["", "/preguntas"].map((ruta) => ({
    url: `${SITE_URL}${ruta}`,
    changeFrequency: "weekly",
    priority: ruta === "" ? 1 : 0.6,
  }));

  const props = slugsPropiedades().map((slug) => ({
    url: `${SITE_URL}/propiedad/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...estaticas, ...props];
}
