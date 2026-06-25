"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { btnArcilla } from "@/lib/estilos";

const inputBase =
  "w-full rounded-xl border border-linea bg-papel px-4 py-2.5 font-body text-tinta outline-none focus:border-arcilla";
const labelBase = "font-body text-sm font-medium text-tinta-suave";

export default function Formulario() {
  const router = useRouter();
  const [estado, setEstado] = useState({ tipo: "", msg: "" });

  async function enviar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity(); // muestra los mensajes nativos del navegador
      return;
    }
    setEstado({ tipo: "cargando", msg: "Enviando…" });

    const fd = new FormData(form);
    const datos = Object.fromEntries(fd.entries());
    datos.pageUri = window.location.href;
    datos.pageName = document.title;

    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (r.ok) {
        form.reset();
        router.push("/gracias");
      } else {
        setEstado({ tipo: "error", msg: "No se pudo enviar. Intenta de nuevo o escríbenos por WhatsApp." });
      }
    } catch {
      setEstado({ tipo: "error", msg: "Error de conexión. Intenta de nuevo." });
    }
  }

  return (
    <form
      onSubmit={enviar}
      noValidate
      className="w-full rounded-[1.5rem] border border-linea bg-papel-2 p-6 text-left"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={labelBase}>Nombre</span>
          <input name="nombre" type="text" required minLength={2} maxLength={80} autoComplete="name" className={`mt-1 ${inputBase}`} />
        </label>
        <label className="block">
          <span className={labelBase}>Celular</span>
          <input name="celular" type="tel" required inputMode="numeric" pattern="[0-9+\s\-]{7,20}" autoComplete="tel" className={`mt-1 ${inputBase}`} />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelBase}>Correo</span>
          <input name="correo" type="email" required maxLength={120} autoComplete="email" className={`mt-1 ${inputBase}`} />
        </label>

        <label className="block">
          <span className={labelBase}>¿Qué buscas?</span>
          <select name="interes" required defaultValue="" className={`mt-1 ${inputBase}`}>
            <option value="" disabled>Selecciona…</option>
            <option value="Comprar">Comprar</option>
            <option value="Arrendar">Arrendar</option>
            <option value="Vender mi propiedad">Vender mi propiedad</option>
          </select>
        </label>
        <label className="block">
          <span className={labelBase}>Tipo de propiedad</span>
          <select name="tipo" required defaultValue="" className={`mt-1 ${inputBase}`}>
            <option value="" disabled>Selecciona…</option>
            <option value="Casa">Casa</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Apartaestudio">Apartaestudio</option>
            <option value="Loft">Loft</option>
            <option value="Habitación">Habitación</option>
            <option value="Otro">Otro</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className={labelBase}>Mensaje (opcional)</span>
          <textarea name="mensaje" rows={2} maxLength={1000} className={`mt-1 ${inputBase}`} />
        </label>
      </div>

      <label className="mt-3 flex items-start gap-3">
        <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-arcilla" />
        <span className="font-body text-sm text-tenue">
          Acepto que Umbral me contacte sobre propiedades de mi interés.
        </span>
      </label>

      {estado.msg && (
        <p
          role="status"
          className={`mt-3 font-body text-sm ${estado.tipo === "error" ? "text-arcilla" : "text-oliva"}`}
        >
          {estado.msg}
        </p>
      )}

      <button
        type="submit"
        disabled={estado.tipo === "cargando"}
        className={`${btnArcilla} mt-5 w-full disabled:opacity-60 disabled:active:scale-100`}
      >
        {estado.tipo === "cargando" ? "Enviando…" : "Quiero que me contacten"}
      </button>
    </form>
  );
}
