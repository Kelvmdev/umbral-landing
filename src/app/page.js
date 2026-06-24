import Image from "next/image";
import Link from "next/link";
import Mapa from "@/components/Mapa";
import Formulario from "@/components/Formulario";
import PropiedadCard from "@/components/PropiedadCard";
import { propiedades } from "@/lib/propiedades";
import { sitio, faqs, waHref } from "@/lib/sitio";
import { btnPrimario, btnSecundario } from "@/lib/estilos";

export default function Home() {
  const { hero, ubicacion } = sitio;

  return (
    <main id="contenido">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-[6%] px-[6%] py-[6vh] lg:min-h-[calc(100svh-4.6rem)] lg:grid-cols-2 lg:px-[4%] lg:py-0">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.4em] text-tenue">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-tinta sm:text-6xl lg:text-7xl">
            {hero.titulo}
          </h1>
          <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-tenue">
            {hero.sub}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="#propiedades" className={btnPrimario}>
              Ver propiedades
            </Link>
            <Link href="#contacto" className={btnSecundario}>
              Hablar con un asesor
            </Link>
          </div>
        </div>

        {/* Mismo estilo de tarjeta: marco de papel + arco interno (la firma).
            Altura atada al viewport para que SIEMPRE quepa en pantalla. */}
        <div className="mx-auto w-full max-w-sm rounded-[1.5rem] border border-linea bg-papel-2 p-3">
          <div className="relative h-[38vh] max-h-[22rem] w-full overflow-hidden rounded-[0.6rem] rounded-t-[1.6rem] lg:h-[62vh] lg:max-h-[32rem]">
            <Image
              src={hero.imagen}
              alt="Hogar acogedor iluminado por luz natural"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
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

      {/* ── Ubicación + Preguntas (dos columnas iguales) ─────── */}
      <section
        id="ubicacion"
        className="mx-auto grid max-w-7xl gap-6 px-[6%] py-[6vh] lg:grid-cols-2 lg:px-[4%]"
      >
        {/* Tarjeta: Preguntas (resumen → /preguntas) */}
        <div
          id="faq"
          className="flex flex-col rounded-[1.5rem] border border-linea bg-papel-2 p-6 sm:p-8 lg:h-[32rem]"
        >
          <h2 className="font-display text-2xl font-semibold text-tinta sm:text-3xl">
            Preguntas frecuentes
          </h2>
          <ul className="mt-6 flex-1 divide-y divide-linea border-t border-linea">
            {faqs.slice(0, 5).map((f) => (
              <li key={f.q}>
                <Link
                  href="/preguntas"
                  className="group flex items-center justify-between gap-4 py-3.5 font-display text-base font-semibold text-tinta transition-colors hover:text-arcilla"
                >
                  {f.q}
                  <span className="shrink-0 text-arcilla transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/preguntas" className={`${btnPrimario} mt-6 self-start`}>
            Ver todas las preguntas
          </Link>
        </div>

        {/* Tarjeta: Mapa (mismo marco, misma altura) */}
        <div className="rounded-[1.5rem] border border-linea bg-papel-2 p-3 lg:h-[32rem]">
          <Mapa
            lat={ubicacion.lat}
            lon={ubicacion.lon}
            zoom={ubicacion.zoom}
            titulo={ubicacion.titulo}
            direccion={ubicacion.direccion}
            className="h-full min-h-[18rem]"
          />
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
          Déjanos tus datos y un asesor te acompaña a cruzar el umbral.
        </p>

        <div className="mt-8">
          <Formulario />
        </div>

        <p className="mt-6 font-body text-sm text-tenue">
          ¿Prefieres algo directo?{" "}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-arcilla hover:underline"
          >
            Escríbenos por WhatsApp
          </a>
        </p>
      </section>
    </main>
  );
}
