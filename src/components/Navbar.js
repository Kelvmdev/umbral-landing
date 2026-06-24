"use client";

import Link from "next/link";
import { useState } from "react";

const enlaces = [
  { href: "/#propiedades", texto: "Propiedades" },
  { href: "/#ubicacion", texto: "Ubicación" },
  { href: "/#faq", texto: "Preguntas" },
  { href: "/#contacto", texto: "Contacto" },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-papel/90 backdrop-blur-sm">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-7xl items-center justify-between px-[6%] py-[1.1rem] lg:px-[4%]"
      >
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-tinta"
        >
          Umbral
        </Link>

        {/* Enlaces en desktop */}
        <ul className="hidden items-center gap-[2.5rem] md:flex">
          {enlaces.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                className="font-body text-sm tracking-wide text-tinta-suave transition-colors hover:text-arcilla"
              >
                {e.texto}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón hamburguesa en móvil */}
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          className="flex h-10 w-10 items-center justify-center rounded-md text-tinta transition active:scale-95 md:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {abierto ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Menú móvil desplegable */}
      {abierto && (
        <ul
          id="menu-movil"
          className="flex flex-col gap-1 border-t border-linea px-[6%] pb-4 md:hidden"
        >
          {enlaces.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                onClick={() => setAbierto(false)}
                className="block py-3 font-body text-base text-tinta-suave transition-colors hover:text-arcilla"
              >
                {e.texto}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
