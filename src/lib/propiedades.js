// Capa de datos del catálogo.
// ponytail: datos mock para maquetar; en Fase 2 se reemplaza la fuente por
// src/content/propiedades.json (mismo shape) sin tocar el diseño.

const img = (seed) => `https://picsum.photos/seed/${seed}/1200/800`;

export const propiedades = [
  {
    slug: "casa-laureles",
    titulo: "Casa en Laureles",
    tipo: "Casa",
    operacion: "venta",
    precio: 980000000,
    moneda: "COP",
    habitaciones: 4,
    banos: 3,
    area_m2: 210,
    parqueaderos: 2,
    estrato: 5,
    direccion: "Cra. 76 #38-12, Laureles, Medellín",
    lat: 6.2459,
    lon: -75.5946,
    descripcion:
      "Casa de dos niveles con patio interior y mucha luz natural. Cocina abierta, estudio y terraza con vista a los árboles del barrio.",
    caracteristicas: ["Patio interior", "Terraza", "Estudio", "Cocina abierta"],
    imagenes: [img("laureles-1"), img("laureles-2"), img("laureles-3")],
    destacada: true,
  },
  {
    slug: "apto-el-poblado",
    titulo: "Apartamento El Poblado",
    tipo: "Apartamento",
    operacion: "venta",
    precio: 720000000,
    moneda: "COP",
    habitaciones: 3,
    banos: 2,
    area_m2: 95,
    parqueaderos: 1,
    estrato: 6,
    direccion: "Cl. 10 #43-30, El Poblado, Medellín",
    lat: 6.2086,
    lon: -75.5659,
    descripcion:
      "Apartamento luminoso en piso alto con balcón y vista a la ciudad. Zonas comunes con gimnasio y terraza social.",
    caracteristicas: ["Balcón", "Gimnasio", "Vista ciudad", "Portería 24h"],
    imagenes: [img("poblado-1"), img("poblado-2"), img("poblado-3")],
    destacada: true,
  },
  {
    slug: "apto-envigado",
    titulo: "Apartaestudio Envigado",
    tipo: "Apartaestudio",
    operacion: "arriendo",
    precio: 2300000,
    moneda: "COP",
    habitaciones: 1,
    banos: 1,
    area_m2: 42,
    parqueaderos: 1,
    estrato: 4,
    direccion: "Cl. 37 Sur #41-20, Envigado",
    lat: 6.1709,
    lon: -75.5905,
    descripcion:
      "Apartaestudio cómodo y bien ubicado, ideal para una persona o pareja. Cerca de parques y transporte.",
    caracteristicas: ["Amoblado", "Cocina integral", "Cerca al metro"],
    imagenes: [img("envigado-1"), img("envigado-2")],
    destacada: false,
  },
  {
    slug: "casa-sabaneta",
    titulo: "Casa campestre Sabaneta",
    tipo: "Casa",
    operacion: "venta",
    precio: 1350000000,
    moneda: "COP",
    habitaciones: 5,
    banos: 4,
    area_m2: 320,
    parqueaderos: 3,
    estrato: 5,
    direccion: "Vereda La Doctora, Sabaneta",
    lat: 6.1419,
    lon: -75.6167,
    descripcion:
      "Casa campestre con amplio jardín, zona de BBQ y vista a la montaña. Tranquilidad a 10 minutos del pueblo.",
    caracteristicas: ["Jardín amplio", "Zona BBQ", "Vista montaña", "Chimenea"],
    imagenes: [img("sabaneta-1"), img("sabaneta-2"), img("sabaneta-3")],
    destacada: true,
  },
  {
    slug: "apto-belen",
    titulo: "Apartamento Belén",
    tipo: "Apartamento",
    operacion: "arriendo",
    precio: 1900000,
    moneda: "COP",
    habitaciones: 2,
    banos: 2,
    area_m2: 68,
    parqueaderos: 1,
    estrato: 4,
    direccion: "Cra. 76 #30-15, Belén, Medellín",
    lat: 6.2335,
    lon: -75.6017,
    descripcion:
      "Apartamento familiar con buena distribución y luz. Zonas comunes con cancha y juegos infantiles.",
    caracteristicas: ["Cancha", "Juegos infantiles", "Portería 24h"],
    imagenes: [img("belen-1"), img("belen-2")],
    destacada: false,
  },
  {
    slug: "loft-laureles",
    titulo: "Loft moderno Laureles",
    tipo: "Loft",
    operacion: "venta",
    precio: 540000000,
    moneda: "COP",
    habitaciones: 1,
    banos: 1,
    area_m2: 58,
    parqueaderos: 1,
    estrato: 5,
    direccion: "Cir. 4 #70-25, Laureles, Medellín",
    lat: 6.2421,
    lon: -75.5921,
    descripcion:
      "Loft de techos altos y diseño contemporáneo. Espacio diáfano perfecto para vivir y trabajar.",
    caracteristicas: ["Techos altos", "Diseño abierto", "Cocina integral"],
    imagenes: [img("loft-1"), img("loft-2")],
    destacada: false,
  },
];

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
