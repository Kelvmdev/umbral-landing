"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Galería de la ficha + lightbox. Usa <dialog> nativo (.showModal): el fondo
// queda inerte de verdad (top-layer), con focus-trap, Esc y restauración de
// foco SIN código manual (manual tema 05). Solo bloqueamos el scroll a mano.
export default function Galeria({ imagenes = [], titulo }) {
  const dialogRef = useRef(null);
  const [i, setI] = useState(0);
  const total = imagenes.length;

  function abrir(idx) {
    setI(idx);
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden"; // congela el fondo
  }
  function cerrar() {
    dialogRef.current?.close();
  }

  // Al cerrar (botón, Esc o clic fuera) devolvemos el scroll del fondo.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const alCerrar = () => {
      document.documentElement.style.overflow = "";
    };
    d.addEventListener("close", alCerrar);
    return () => d.removeEventListener("close", alCerrar);
  }, []);

  const ir = (paso) => setI((p) => (p + paso + total) % total);

  function onKeyDown(e) {
    if (e.key === "ArrowRight") ir(1);
    else if (e.key === "ArrowLeft") ir(-1);
  }

  // Clic en el fondo (no en la imagen ni en un botón) cierra el visor.
  function onClickFondo(e) {
    if (!e.target.closest("img, button")) cerrar();
  }

  if (!total) return null;

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {imagenes.map((src, idx) => (
          <button
            type="button"
            key={src}
            onClick={() => abrir(idx)}
            aria-label={`Ampliar foto ${idx + 1} de ${titulo}`}
            className={`group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl border border-linea ${
              idx === 0 ? "sm:col-span-2 sm:aspect-[16/9]" : ""
            }`}
          >
            <Image
              src={src}
              alt={`${titulo} — foto ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              priority={idx === 0}
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onKeyDown={onKeyDown}
        onClick={onClickFondo}
        aria-label={`Galería de ${titulo}`}
        className="m-0 h-[100dvh] max-h-none w-[100vw] max-w-none bg-transparent p-0 backdrop:bg-tinta/95"
      >
        <div className="relative flex h-full w-full items-center justify-center p-4 sm:p-8">
          {/* Imagen grande (object-contain: se ve completa, sin recortar).
              ponytail: <img> normal — visor full-screen, no es LCP, next/image
              solo añadiría complejidad de sizing aquí. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagenes[i]}
            alt={`${titulo} — foto ${i + 1}`}
            className="max-h-full max-w-full rounded-lg object-contain"
          />

          {/* Cerrar */}
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar visor"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-papel/90 text-tinta shadow-lg transition active:scale-95 hover:bg-papel"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          {/* Flechas + contador (solo si hay más de una foto) */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => ir(-1)}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-papel/90 text-tinta shadow-lg transition active:scale-95 hover:bg-papel"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => ir(1)}
                aria-label="Foto siguiente"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-papel/90 text-tinta shadow-lg transition active:scale-95 hover:bg-papel"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <p
                aria-live="polite"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-papel/90 px-4 py-1.5 font-body text-sm font-medium text-tinta shadow-lg"
              >
                {i + 1} / {total}
              </p>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
