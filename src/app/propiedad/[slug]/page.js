import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Mapa from "@/components/Mapa";
import {
  getPropiedad,
  slugsPropiedades,
  formatPrecio,
} from "@/lib/propiedades";
import { btnArcilla } from "@/lib/estilos";
import { waHref } from "@/lib/sitio";
import JsonLd from "@/components/JsonLd";
import { propiedadJsonLd } from "@/lib/jsonld";

// Pre-genera una página estática por cada propiedad (SSG)
export function generateStaticParams() {
  return slugsPropiedades().map((slug) => ({ slug }));
}

// SEO por propiedad (params es asíncrono en Next 16)
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getPropiedad(slug);
  if (!p) return {};
  return {
    title: p.titulo,
    description: p.descripcion,
  };
}

const specs = (p) => [
  { n: p.habitaciones, l: "Habitaciones" },
  { n: p.banos, l: "Baños" },
  { n: `${p.area_m2} m²`, l: "Área" },
  { n: p.parqueaderos, l: "Parqueaderos" },
  { n: p.estrato, l: "Estrato" },
];

export default async function PropiedadPage({ params }) {
  const { slug } = await params;
  const p = getPropiedad(slug);
  if (!p) notFound();

  return (
    <main id="contenido" className="mx-auto max-w-6xl px-[6%] py-[6vh] lg:px-[4%]">
      <JsonLd data={propiedadJsonLd(p)} />
      <Link
        href="/#propiedades"
        className="font-body text-sm text-tenue transition-colors hover:text-arcilla"
      >
        ← Volver al catálogo
      </Link>

      {/* Encabezado */}
      <header className="mt-6 border-b border-linea pb-6">
        <p className="font-body text-xs uppercase tracking-[0.18em] text-tenue">
          {p.tipo} · {p.operacion === "arriendo" ? "Arriendo" : "Venta"}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-tinta sm:text-5xl">
          {p.titulo}
        </h1>
        <p className="mt-2 font-body text-base text-tenue">{p.direccion}</p>
        <p className="mt-4 font-display text-3xl font-semibold text-arcilla">
          {formatPrecio(p)}
        </p>
      </header>

      {/* Galería */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {p.imagenes.map((src, i) => (
          <div
            key={src}
            className={`relative aspect-[4/3] overflow-hidden rounded-2xl border border-linea ${
              i === 0 ? "sm:col-span-2 sm:aspect-[16/9]" : ""
            }`}
          >
            <Image
              src={src}
              alt={`${p.titulo} — foto ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Especificaciones */}
      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-linea bg-linea sm:grid-cols-5">
        {specs(p).map((s) => (
          <div key={s.l} className="bg-papel-2 px-4 py-5 text-center">
            <dt className="font-display text-2xl font-semibold text-tinta">{s.n}</dt>
            <dd className="mt-1 font-body text-xs uppercase tracking-wide text-tenue">
              {s.l}
            </dd>
          </div>
        ))}
      </dl>

      {/* Descripción + características */}
      <section className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-semibold text-tinta">
            Sobre esta propiedad
          </h2>
          <p className="mt-3 font-body text-lg leading-relaxed text-tinta-suave">
            {p.descripcion}
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold text-tinta">
            Características
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {p.caracteristicas.map((c) => (
              <li
                key={c}
                className="rounded-full border border-linea bg-papel-2 px-4 py-1.5 font-body text-sm text-tinta-suave"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Mapa de la propiedad */}
      <section className="mt-12">
        <h2 className="mb-4 font-display text-2xl font-semibold text-tinta">
          Ubicación
        </h2>
        <Mapa
          lat={p.lat}
          lon={p.lon}
          zoom={15}
          titulo={p.titulo}
          direccion={p.direccion}
          className="h-[55svh] min-h-[20rem] border border-linea"
        />
      </section>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-linea bg-papel-2 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-tinta">
          ¿Quieres conocerla?
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnArcilla} mt-5`}
        >
          Agendar una visita
        </a>
      </div>
    </main>
  );
}
