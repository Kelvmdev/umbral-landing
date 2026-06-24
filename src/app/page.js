import Image from "next/image";
import Link from "next/link";
import Mapa from "@/components/Mapa";
import PropiedadCard from "@/components/PropiedadCard";
import { propiedades } from "@/lib/propiedades";

// ponytail: FAQ inline; en Fase 2 vendrá de sitio.json (y a FAQPage JSON-LD en Fase 7)
const faqs = [
  {
    q: "¿Cómo agendo una visita?",
    a: "Escríbenos por WhatsApp o por el formulario de contacto y coordinamos un horario que te sirva. La visita no tiene ningún costo.",
  },
  {
    q: "¿Las propiedades del catálogo están disponibles?",
    a: "Sí. Mantenemos el catálogo al día; si una propiedad se reserva o se vende, la retiramos o la marcamos como no disponible.",
  },
  {
    q: "¿Puedo comprar con crédito hipotecario?",
    a: "Claro. Te orientamos con los requisitos y te conectamos con entidades para que compares opciones de financiación.",
  },
  {
    q: "¿Cobran comisión por mostrar una propiedad?",
    a: "No. Acompañarte en la búsqueda y las visitas es gratis. Solo se cobra la comisión habitual al cerrar una operación.",
  },
  {
    q: "¿En qué zonas tienen propiedades?",
    a: "Trabajamos en Medellín y el Valle de Aburrá: Laureles, El Poblado, Envigado, Sabaneta, Belén y alrededores.",
  },
];

export default function Home() {
  return (
    <main id="contenido">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-[6%] px-[6%] py-[6vh] lg:min-h-[calc(100svh-4.6rem)] lg:grid-cols-2 lg:px-[4%] lg:py-0">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.4em] text-tenue">
            Catálogo · 2026
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-tinta sm:text-6xl lg:text-7xl">
            Cruza el umbral hacia tu próximo hogar
          </h1>
          <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-tenue">
            Casas y apartamentos en venta y arriendo en Medellín y el Valle de
            Aburrá. Encuentra el espacio donde empieza tu próxima historia.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#propiedades"
              className="rounded-full bg-tinta px-7 py-3 font-body text-sm font-medium text-papel transition active:scale-95 hover:bg-tinta-suave"
            >
              Ver propiedades
            </Link>
            <Link
              href="#contacto"
              className="rounded-full border border-tinta px-7 py-3 font-body text-sm font-medium text-tinta transition active:scale-95 hover:bg-papel-2"
            >
              Hablar con un asesor
            </Link>
          </div>
        </div>

        {/* Imagen enmarcada por el arco = la firma. Altura atada al viewport
            para que SIEMPRE quepa en pantalla sin recortarse de más. */}
        <div className="relative mx-auto h-[42vh] max-h-[24rem] w-full max-w-sm overflow-hidden rounded-t-[50%_20%] border border-linea lg:h-[68vh] lg:max-h-[34rem]">
          <Image
            src="https://picsum.photos/seed/umbral-hero/900/1200"
            alt="Hogar acogedor iluminado por luz natural"
            fill
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* ── Propiedades ──────────────────────────────────────── */}
      <section id="propiedades" className="mx-auto max-w-7xl px-[6%] py-[6vh] lg:px-[4%]">
        <div className="flex items-end justify-between border-b border-linea pb-5">
          <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
            El catálogo
          </h2>
          <p className="font-body text-sm text-tenue">
            {propiedades.length} propiedades
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {propiedades.map((p, i) => (
            <PropiedadCard
              key={p.slug}
              propiedad={p}
              indice={i}
              prioridad={i === 0}
            />
          ))}
        </div>
      </section>

      {/* ── Ubicación ────────────────────────────────────────── */}
      <section id="ubicacion" className="mx-auto max-w-7xl px-[6%] py-[6vh] lg:px-[4%]">
        <h2 className="mb-6 font-display text-3xl font-semibold text-tinta sm:text-4xl">
          Dónde estamos
        </h2>
        <Mapa
          lat={6.2117}
          lon={-75.5688}
          zoom={12}
          titulo="Umbral · Medellín"
          direccion="Valle de Aburrá, Antioquia"
        />
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-3xl px-[6%] py-[6vh] lg:px-[4%]">
        <h2 className="mb-8 font-display text-3xl font-semibold text-tinta sm:text-4xl">
          Preguntas frecuentes
        </h2>
        <div className="divide-y divide-linea border-y border-linea">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-tinta [&::-webkit-details-marker]:hidden">
                {f.q}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="shrink-0 text-arcilla transition-transform duration-300 group-open:rotate-45"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </summary>
              <p className="mt-3 max-w-prose font-body text-base leading-relaxed text-tenue">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Contacto (formulario llega en Fase 3) ────────────── */}
      <section
        id="contacto"
        className="mx-auto max-w-7xl px-[6%] py-[8vh] text-center lg:px-[4%]"
      >
        <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
          ¿Te interesa una propiedad?
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body text-lg text-tenue">
          Escríbenos y un asesor te acompaña a cruzar el umbral.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/573000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-arcilla px-7 py-3 font-body text-sm font-medium text-papel transition active:scale-95 hover:bg-arcilla-honda"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
