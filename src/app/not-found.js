import Link from "next/link";

export const metadata = { robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <main
      id="contenido"
      tabIndex={-1}
      className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-[6%] py-[10vh] text-center"
    >
      <p className="font-body text-xs uppercase tracking-[0.4em] text-tenue">
        Error 404
      </p>
      <h1 className="mt-4 font-display text-5xl font-semibold text-tinta">
        Esta puerta no existe
      </h1>
      <p className="mt-4 font-body text-lg text-tenue">
        La página que buscas no está en el catálogo.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-tinta px-7 py-3 font-body text-sm font-medium text-papel transition active:scale-95 hover:bg-tinta-suave"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
