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
  const esArriendo = propiedad.operacion === "arriendo";

  return (
    <Link
      href={`/propiedad/${propiedad.slug}`}
      className="group block rounded-[1.5rem] border border-linea bg-papel-2 p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(29,24,19,0.35)]"
    >
      {/* Foto matada: arco arriba (la firma "umbral") dentro de un marco de papel */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[0.6rem] rounded-t-[1.6rem]">
        <Image
          src={propiedad.imagenes[0]}
          alt={propiedad.titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          priority={prioridad}
        />
        {/* Número de catálogo, estampado */}
        <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-linea bg-papel/90 font-display text-sm font-semibold text-tinta backdrop-blur-sm">
          {numero}
        </span>
        {/* Pill de operación */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 font-body text-xs font-medium tracking-wide ${
            esArriendo ? "bg-oliva text-papel" : "bg-arcilla text-papel"
          }`}
        >
          {esArriendo ? "Arriendo" : "Venta"}
        </span>
      </div>

      <div className="px-2 pb-1 pt-4">
        <p className="font-body text-[0.7rem] uppercase tracking-[0.2em] text-tenue">
          {propiedad.tipo}
        </p>
        <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-tinta">
          {propiedad.titulo}
        </h3>
        <p className="mt-1 font-body text-sm text-tenue">{propiedad.direccion}</p>

        {/* hairline arcilla que crece en hover (detalle de marca) */}
        <div className="mt-4 h-px w-10 bg-arcilla transition-all duration-300 group-hover:w-20" />

        <p className="mt-4 font-display text-xl font-semibold text-arcilla">
          {formatPrecio(propiedad)}
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-body text-xs text-tinta-suave">
          {specs(propiedad).map((s) => (
            <li key={s.l} className="whitespace-nowrap">
              <span className="font-semibold">{s.n}</span>{" "}
              <span className="text-tenue">{s.l}</span>
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
