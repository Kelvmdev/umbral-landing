"use client";

import { useEffect, useRef, useState } from "react";

const SALUDO = {
  role: "assistant",
  content:
    "¡Hola! Soy el asesor de Umbral. Pregúntame por propiedades, precios, zonas o lo que necesites. 🏡",
};

export default function Asesor() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([SALUDO]);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const finRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const botonRef = useRef(null);
  const raizRef = useRef(null);

  // Cierra y devuelve el foco al botón flotante (no se pierde en el vacío)
  function cerrar() {
    setAbierto(false);
    botonRef.current?.focus();
  }

  // Tab queda atrapado dentro del panel (focus-trap, tema 08). Esc se maneja
  // aparte con un listener global (ver useEffect de arriba).
  function onKeyDownPanel(e) {
    if (e.key !== "Tab") return;
    const focuseables = panelRef.current?.querySelectorAll(
      'button, textarea, input, a[href], [tabindex]:not([tabindex="-1"])'
    );
    const lista = Array.from(focuseables || []).filter((el) => !el.disabled);
    if (!lista.length) return;
    const primero = lista[0];
    const ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  }

  // Auto-scroll al último mensaje
  useEffect(() => {
    finRef.current?.scrollIntoView({ block: "end" });
  }, [mensajes]);

  // Al abrir, enfoca el campo
  useEffect(() => {
    if (abierto) inputRef.current?.focus();
  }, [abierto]);

  // Esc cierra el chat estés donde estés (no solo con foco dentro del panel)
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", alPresionar);
    return () => window.removeEventListener("keydown", alPresionar);
  }, [abierto]);

  // Al abrir, marca el resto de la página como `inert`: bloquea ratón, teclado
  // y cursor virtual del lector de pantalla detrás del modal (tema 08). El
  // focus-trap solo atrapa Tab; inert sella todo lo demás.
  useEffect(() => {
    if (!abierto) return;
    const hermanos = Array.from(document.body.children).filter(
      (el) => el !== raizRef.current
    );
    hermanos.forEach((el) => el.setAttribute("inert", ""));
    return () => hermanos.forEach((el) => el.removeAttribute("inert"));
  }, [abierto]);

  async function enviar() {
    const pregunta = texto.trim();
    if (!pregunta || enviando) return;

    const historial = [...mensajes, { role: "user", content: pregunta }];
    setMensajes([...historial, { role: "assistant", content: "" }]);
    setTexto("");
    setEnviando(true);

    const ponerUltimo = (contenido) =>
      setMensajes((prev) => {
        const copia = prev.slice();
        copia[copia.length - 1] = { role: "assistant", content: contenido };
        return copia;
      });

    try {
      const r = await fetch("/api/asesor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensajes: historial }),
      });

      if (!r.ok || !r.body) {
        ponerUltimo(
          r.status === 503
            ? "El asesor no está disponible en este momento. Escríbenos por WhatsApp y te ayudamos. 🙏"
            : "Tuve un problema para responder. Intenta de nuevo o escríbenos por WhatsApp."
        );
        return;
      }

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        ponerUltimo(acc);
      }
    } catch {
      ponerUltimo("Error de conexión. Intenta de nuevo, por favor.");
    } finally {
      setEnviando(false);
      inputRef.current?.focus();
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  return (
    <div ref={raizRef} className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Panel del chat */}
      {abierto && (
        <section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Asesor virtual de Umbral"
          onKeyDown={onKeyDownPanel}
          className="mb-3 flex h-[70vh] max-h-[34rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-[1.25rem] border border-linea bg-papel-2 shadow-2xl"
        >
          <header className="flex items-center justify-between border-b border-linea bg-papel-3 px-4 py-3">
            <div>
              <p className="font-display text-lg font-semibold text-tinta">Asesor Umbral</p>
              <p className="font-body text-xs text-tenue">Responde con datos del catálogo</p>
            </div>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar chat"
              className="flex h-9 w-9 items-center justify-center rounded-md text-tinta transition active:scale-95 hover:text-arcilla"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </header>

          {/* Mensajes */}
          <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {mensajes.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 font-body text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-arcilla text-papel"
                    : "mr-auto border border-linea bg-papel text-tinta"
                }`}
              >
                {m.content || (enviando && i === mensajes.length - 1 ? "…" : "")}
              </div>
            ))}
            <div ref={finRef} />
          </div>

          {/* Entrada */}
          <div className="border-t border-linea p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Escribe tu pregunta…"
                aria-label="Escribe tu pregunta para el asesor"
                className="max-h-28 flex-1 resize-none rounded-xl border border-linea bg-papel px-3 py-2 font-body text-sm text-tinta outline-none focus:border-arcilla"
              />
              <button
                type="button"
                onClick={enviar}
                disabled={enviando || !texto.trim()}
                aria-label="Enviar"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-arcilla text-papel transition active:scale-95 hover:bg-arcilla-honda disabled:opacity-50 disabled:active:scale-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Botón flotante */}
      <button
        ref={botonRef}
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label={abierto ? "Cerrar asesor virtual" : "Abrir asesor virtual"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-arcilla text-papel shadow-xl transition active:scale-95 hover:bg-arcilla-honda"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.8-5.4A8.5 8.5 0 1 1 21 11.5z" />
        </svg>
      </button>
    </div>
  );
}
