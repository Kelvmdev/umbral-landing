"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Asesor from "./Asesor";

// Oculta nav y footer del sitio público dentro de /admin (Fase 2).
export default function Chrome({ children, sitio }) {
  const esAdmin = usePathname()?.startsWith("/admin");
  return (
    <>
      {/* Skip-link: PRIMER elemento enfocable del body, antes de la nav, para
          que realmente salte el menú (tema 08). El <main id="contenido"> lo
          define cada página. */}
      {!esAdmin && (
        <a
          href="#contenido"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-tinta focus-visible:px-4 focus-visible:py-2 focus-visible:text-papel"
        >
          Saltar al contenido
        </a>
      )}
      {!esAdmin && <Navbar marca={sitio.marca.nombre} />}
      {children}
      {!esAdmin && <Footer sitio={sitio} />}
      {!esAdmin && <Asesor />}
    </>
  );
}
