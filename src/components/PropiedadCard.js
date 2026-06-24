import Image from "next/image";
import Link from "next/link";
import { formatPrecio } from "@/lib/propiedades";

const specs = (p) => [
  { n: p.habitaciones, l: "hab" },
  { n: p.banos, l: "baños" },
  { n: `${p.area_m2}`, l: "m²" },
  { n: p.parqueaderos, l: "parq" },
];

export default function PropiedadCard({ propiedad, indice = 0, prioridad = false }) {
  const numero = String(indice + 1).padStart(2, "0");

  return (
    <Link
      href={`/propiedad/${propiedad.slug}`}
      className="group block overflow-hidden rounded-t-[1.5rem] border border-linea bg-papel-2 transition active:scale-[0.99]"
    >
      {/* Imagen enmarcada (arco superior = la firma "umbral") */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[1.4rem]">
        <Image
          src={propiedad.imagenes[0]}
          alt={propiedad.titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={prioridad}
        />
        {/* Número de catálogo */}
        <span className="absolute left-3 top-3 rounded-full bg-papel/90 px-3 py-1 font-display text-sm font-semibold text-tinta backdrop-blur-sm">
          Nº {numero}
        </span>
      </div>

      <div className="p-5">
        <p className="font-body text-xs uppercase tracking-[0.18em] text-tenue">
          {propiedad.tipo} · {propiedad.operacion === "arriendo" ? "Arriendo" : "Venta"}
        </p>
        <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-tinta">
          {propiedad.titulo}
        </h3>
        <p className="mt-1 font-body text-sm text-tenue">{propiedad.direccion}</p>

        <p className="mt-3 font-display text-xl font-semibold text-arcilla">
          {formatPrecio(propiedad)}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-linea pt-3 font-body text-sm text-tinta-suave">
          {specs(propiedad).map((s) => (
            <li key={s.l}>
              <span className="font-semibold">{s.n}</span>{" "}
              <span className="text-tenue">{s.l}</span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
