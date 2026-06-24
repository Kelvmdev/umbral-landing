"use client";

import { useRef, useState } from "react";

export default function Mapa({
  lat = 6.2117,
  lon = -75.5688,
  zoom = 13,
  titulo = "Nuestra zona",
  direccion = "Medellín, Colombia",
}) {
  const [activo, setActivo] = useState(false); // mapa interactivo tras doble clic
  const [pista, setPista] = useState(false); // muestra "doble clic para interactuar"
  const taps = useRef(0);
  const timer = useRef(null);

  const src = `https://maps.google.com/maps?q=${lat},${lon}&z=${zoom}&hl=es&output=embed`;
  const href = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

  const resetTaps = () => {
    taps.current = 0;
    setPista(false);
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const onOverlayClick = () => {
    taps.current += 1;
    if (taps.current === 1) {
      setPista(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(resetTaps, 1800);
    } else {
      setActivo(true);
      resetTaps();
    }
  };

  const relock = () => {
    if (activo) setActivo(false);
  };

  return (
    <section
      aria-label={`Mapa · ${titulo}`}
      className="relative h-[60svh] min-h-[20rem] w-full overflow-hidden rounded-[1.5rem] border border-linea bg-papel-3"
      onWheel={relock}
    >
      <iframe
        src={src}
        title={`Mapa · ${titulo}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
      />

      {/* Overlay anti-hijack: bloquea hasta doble clic */}
      {!activo && (
        <button
          type="button"
          onClick={onOverlayClick}
          aria-label="Doble clic para interactuar con el mapa"
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-transparent"
        >
          {pista && (
            <span className="pointer-events-none rounded-full bg-tinta/90 px-4 py-2 font-body text-sm text-papel shadow-lg">
              Doble clic para interactuar
            </span>
          )}
        </button>
      )}

      {/* Tarjeta flotante con la dirección */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute left-4 top-4 max-w-xs rounded-2xl border border-linea bg-papel/95 p-4 shadow-lg backdrop-blur-sm transition hover:shadow-xl"
        aria-label={`Ver ${titulo} en Google Maps`}
      >
        <p className="font-display text-lg font-semibold text-tinta">{titulo}</p>
        <p className="mt-0.5 font-body text-sm text-tenue">{direccion}</p>
      </a>
    </section>
  );
}
