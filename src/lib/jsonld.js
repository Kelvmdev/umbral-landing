// Constructores de JSON-LD (schema.org). Datos exactos para buscadores e IA.
import { SITE_URL } from "@/lib/site";
import { sitio } from "@/lib/sitio";

// La inmobiliaria como entidad (va en todas las páginas).
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: sitio.marca.nombre,
    description: `${sitio.marca.nombre} — ${sitio.marca.tagline}. Propiedades en venta y arriendo en Medellín y el Valle de Aburrá.`,
    url: SITE_URL,
    email: sitio.contacto.email,
    telephone: sitio.contacto.tel,
    areaServed: "Valle de Aburrá, Antioquia, Colombia",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: sitio.ubicacion.lat,
      longitude: sitio.ubicacion.lon,
    },
    sameAs: sitio.redes.map((r) => r.url),
  };
}

// Mapea el tipo del catálogo al tipo de schema.org de alojamiento.
const TIPO_SCHEMA = {
  Casa: "House",
  Apartamento: "Apartment",
  Apartaestudio: "Apartment",
  Loft: "Apartment",
};

// Una propiedad concreta, con su oferta (precio + venta/arriendo).
export function propiedadJsonLd(p) {
  return {
    "@context": "https://schema.org",
    "@type": TIPO_SCHEMA[p.tipo] || "Residence",
    name: p.titulo,
    description: p.descripcion,
    url: `${SITE_URL}/propiedad/${p.slug}`,
    image: p.imagenes?.[0] || undefined,
    numberOfRooms: p.habitaciones,
    numberOfBathroomsTotal: p.banos,
    floorSize: { "@type": "QuantitativeValue", value: p.area_m2, unitCode: "MTK" },
    address: {
      "@type": "PostalAddress",
      streetAddress: p.direccion,
      addressLocality: "Medellín",
      addressRegion: "Antioquia",
      addressCountry: "CO",
    },
    geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lon },
    offers: {
      "@type": "Offer",
      price: p.precio,
      priceCurrency: p.moneda,
      availability: "https://schema.org/InStock",
      // Distingue venta de arriendo en el lenguaje de schema (GoodRelations)
      businessFunction:
        p.operacion === "arriendo"
          ? "http://purl.org/goodrelations/v1#LeaseOut"
          : "http://purl.org/goodrelations/v1#Sell",
    },
  };
}

// Preguntas frecuentes → rich result de FAQ y citas de IA.
export function faqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
