import Image from "next/image";
import Link from "next/link";
import Mapa from "@/components/Mapa";
import PropiedadCard from "@/components/PropiedadCard";
import { propiedades } from "@/lib/propiedades";

export default function Home() {
  return (
    <main id="contenido">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl items-center gap-[6%] px-[6%] py-[8vh] lg:grid-cols-2 lg:px-[4%] lg:py-[12vh]">
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

        {/* Imagen enmarcada por el arco = la firma */}
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-t-[50%_22%] border border-linea">
          <Image
            src="https://picsum.photos/seed/umbral-hero/900/1200"
            alt="Hogar acogedor iluminado por luz natural"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
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
