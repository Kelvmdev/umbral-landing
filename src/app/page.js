export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-[8%] py-[12vh] text-center">
      {/* FIRMA: el "umbral" — un portal de arco que enmarca la marca */}
      <div className="relative w-full max-w-md border border-linea border-b-0 rounded-t-[50%_18%] px-[8%] pb-0 pt-[12%]">
        <p className="font-body text-xs uppercase tracking-[0.4em] text-tenue">
          Catálogo · 2026
        </p>

        <h1 className="mt-[6%] font-display text-6xl font-semibold leading-none tracking-tight text-tinta sm:text-7xl lg:text-8xl">
          Umbral
        </h1>

        <p className="mx-auto mt-[6%] max-w-xs font-body text-lg leading-relaxed text-tenue">
          donde empieza el hogar
        </p>

        {/* hairline arcilla bajo el umbral */}
        <div className="mx-auto mt-[10%] h-px w-2/3 bg-arcilla" />
      </div>

      <p className="mt-[8%] font-body text-sm text-tenue">
        Sitio en construcción — <span className="text-arcilla">Fase 0: concepto + tokens</span>
      </p>
    </main>
  );
}
