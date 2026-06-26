import Link from "next/link";
import { btnPrimario } from "@/lib/estilos";

export const metadata = {
  title: "Gracias",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-[6%] py-[12vh] text-center"
    >
      {/* Umbral de arco como remate visual */}
      <div className="w-full max-w-xs rounded-t-[50%_22%] border border-linea border-b-0 px-8 pb-0 pt-10">
        <p className="font-body text-xs uppercase tracking-[0.4em] text-tenue">
          Mensaje recibido
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-tinta sm:text-6xl">
          ¡Gracias!
        </h1>
        <div className="mx-auto mt-6 h-px w-2/3 bg-arcilla" />
      </div>

      <p className="mt-8 max-w-md font-body text-lg leading-relaxed text-tenue">
        Recibimos tu información. Un asesor de Umbral te contactará muy pronto
        para acompañarte a cruzar el umbral.
      </p>

      <Link href="/" className={`${btnPrimario} mt-8`}>
        Volver al inicio
      </Link>
    </main>
  );
}
