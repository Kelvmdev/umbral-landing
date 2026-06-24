import Link from "next/link";
import { faqs } from "@/lib/faqs";

export const metadata = {
  title: "Preguntas frecuentes",
  description:
    "Resolvemos tus dudas sobre visitas, financiación, arriendo y zonas. Todo lo que necesitas saber antes de cruzar el umbral.",
};

export default function PreguntasPage() {
  return (
    <main id="contenido" className="mx-auto max-w-3xl px-[6%] py-[8vh] lg:px-[4%]">
      <Link
        href="/#faq"
        className="font-body text-sm text-tenue transition-colors hover:text-arcilla"
      >
        ← Volver al inicio
      </Link>

      <header className="mt-6 border-b border-linea pb-6">
        <p className="font-body text-xs uppercase tracking-[0.4em] text-tenue">
          Ayuda
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-tinta sm:text-5xl">
          Preguntas frecuentes
        </h1>
      </header>

      <div className="mt-4 divide-y divide-linea">
        {faqs.map((f) => (
          <details key={f.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-tinta [&::-webkit-details-marker]:hidden">
              {f.q}
              <svg
                width="22"
                height="22"
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

      {/* CTA al final */}
      <div className="mt-10 rounded-2xl border border-linea bg-papel-2 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-tinta">
          ¿Te quedó otra duda?
        </p>
        <a
          href="https://wa.me/573000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-full bg-arcilla px-7 py-3 font-body text-sm font-medium text-papel transition active:scale-95 hover:bg-arcilla-honda"
        >
          Escríbenos por WhatsApp
        </a>
      </div>
    </main>
  );
}
