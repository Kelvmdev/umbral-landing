"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { btnPrimario, btnSecundario } from "@/lib/estilos";

// ── Inputs reutilizables ───────────────────────────────────────────────
function Campo({ label, value, onChange, type = "text", textarea }) {
  const base =
    "w-full rounded-lg border border-linea bg-papel px-3 py-2 font-body text-sm text-tinta outline-none focus:border-arcilla";
  return (
    <label className="block">
      <span className="font-body text-xs uppercase tracking-wide text-tenue">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`mt-1 ${base}`} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
          className={`mt-1 ${base}`}
        />
      )}
    </label>
  );
}

export default function PanelAdmin({ propiedadesIniciales, sitioInicial }) {
  const router = useRouter();
  // El estado parte del ORIGINAL completo → al guardar no se pierde nada (blindaje).
  const [props, setProps] = useState(() => structuredClone(propiedadesIniciales));
  const [sitio, setSitio] = useState(() => structuredClone(sitioInicial));
  const [tab, setTab] = useState("propiedades");
  const [estado, setEstado] = useState({ tipo: "", msg: "" });

  const setProp = (i, campo, v) =>
    setProps((arr) => arr.map((p, j) => (j === i ? { ...p, [campo]: v } : p)));
  const setSit = (sec, campo, v) =>
    setSitio((s) => ({ ...s, [sec]: { ...s[sec], [campo]: v } }));

  async function guardar() {
    setEstado({ tipo: "guardando", msg: "Guardando…" });
    try {
      const r = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propiedades: props, sitio }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok) setEstado({ tipo: "ok", msg: "✓ Guardado. Recarga el sitio para verlo." });
      else setEstado({ tipo: "error", msg: d.error || "No se pudo guardar" });
    } catch {
      setEstado({ tipo: "error", msg: "Error de conexión" });
    }
  }

  async function salir() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-4xl px-[6%] py-[6vh]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-linea pb-5">
        <div>
          <p className="font-body text-xs uppercase tracking-[0.3em] text-tenue">Panel</p>
          <h1 className="font-display text-3xl font-semibold text-tinta">Umbral · Admin</h1>
        </div>
        <button onClick={salir} className={btnSecundario}>
          Cerrar sesión
        </button>
      </header>

      {/* Pestañas */}
      <div className="mt-6 flex gap-2">
        {[
          ["propiedades", "Propiedades"],
          ["sitio", "Sitio"],
        ].map(([id, txt]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-full px-5 py-2 font-body text-sm font-medium transition ${
              tab === id ? "bg-tinta text-papel" : "border border-linea text-tinta-suave hover:bg-papel-2"
            }`}
          >
            {txt}
          </button>
        ))}
      </div>

      {/* ── Propiedades ── */}
      {tab === "propiedades" && (
        <div className="mt-6 space-y-5">
          {props.map((p, i) => (
            <details key={p.slug} className="group rounded-2xl border border-linea bg-papel-2 p-5" open={i === 0}>
              <summary className="cursor-pointer list-none font-display text-lg font-semibold text-tinta [&::-webkit-details-marker]:hidden">
                {p.titulo}{" "}
                <span className="font-body text-sm font-normal text-tenue">· {p.tipo}</span>
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Campo label="Título" value={p.titulo} onChange={(v) => setProp(i, "titulo", v)} />
                <Campo label="Tipo" value={p.tipo} onChange={(v) => setProp(i, "tipo", v)} />
                <label className="block">
                  <span className="font-body text-xs uppercase tracking-wide text-tenue">Operación</span>
                  <select
                    value={p.operacion}
                    onChange={(e) => setProp(i, "operacion", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-linea bg-papel px-3 py-2 font-body text-sm text-tinta outline-none focus:border-arcilla"
                  >
                    <option value="venta">Venta</option>
                    <option value="arriendo">Arriendo</option>
                  </select>
                </label>
                <Campo label="Precio" type="number" value={p.precio} onChange={(v) => setProp(i, "precio", v)} />
                <Campo label="Habitaciones" type="number" value={p.habitaciones} onChange={(v) => setProp(i, "habitaciones", v)} />
                <Campo label="Baños" type="number" value={p.banos} onChange={(v) => setProp(i, "banos", v)} />
                <Campo label="Área (m²)" type="number" value={p.area_m2} onChange={(v) => setProp(i, "area_m2", v)} />
                <Campo label="Parqueaderos" type="number" value={p.parqueaderos} onChange={(v) => setProp(i, "parqueaderos", v)} />
                <div className="sm:col-span-2">
                  <Campo label="Dirección" value={p.direccion} onChange={(v) => setProp(i, "direccion", v)} />
                </div>
                <div className="sm:col-span-2">
                  <Campo label="Descripción" textarea value={p.descripcion} onChange={(v) => setProp(i, "descripcion", v)} />
                </div>
              </div>
            </details>
          ))}
        </div>
      )}

      {/* ── Sitio ── */}
      {tab === "sitio" && (
        <div className="mt-6 space-y-6">
          <section className="rounded-2xl border border-linea bg-papel-2 p-5">
            <h2 className="font-display text-lg font-semibold text-tinta">Marca</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Campo label="Nombre" value={sitio.marca.nombre} onChange={(v) => setSit("marca", "nombre", v)} />
              <Campo label="Tagline" value={sitio.marca.tagline} onChange={(v) => setSit("marca", "tagline", v)} />
            </div>
          </section>

          <section className="rounded-2xl border border-linea bg-papel-2 p-5">
            <h2 className="font-display text-lg font-semibold text-tinta">Hero</h2>
            <div className="mt-4 grid gap-4">
              <Campo label="Eyebrow" value={sitio.hero.eyebrow} onChange={(v) => setSit("hero", "eyebrow", v)} />
              <Campo label="Título" value={sitio.hero.titulo} onChange={(v) => setSit("hero", "titulo", v)} />
              <Campo label="Subtítulo" textarea value={sitio.hero.sub} onChange={(v) => setSit("hero", "sub", v)} />
            </div>
          </section>

          <section className="rounded-2xl border border-linea bg-papel-2 p-5">
            <h2 className="font-display text-lg font-semibold text-tinta">Contacto</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Campo label="WhatsApp (solo números)" value={sitio.contacto.whatsapp} onChange={(v) => setSit("contacto", "whatsapp", v)} />
              <Campo label="Teléfono" value={sitio.contacto.tel} onChange={(v) => setSit("contacto", "tel", v)} />
              <Campo label="Email" value={sitio.contacto.email} onChange={(v) => setSit("contacto", "email", v)} />
              <Campo label="Ciudad" value={sitio.contacto.ciudad} onChange={(v) => setSit("contacto", "ciudad", v)} />
            </div>
          </section>
        </div>
      )}

      {/* Barra de guardado */}
      <div className="sticky bottom-0 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-linea bg-papel/95 py-4 backdrop-blur-sm">
        {estado.msg && (
          <p
            role="status"
            className={`font-body text-sm ${estado.tipo === "error" ? "text-arcilla" : "text-oliva"}`}
          >
            {estado.msg}
          </p>
        )}
        <button
          onClick={guardar}
          disabled={estado.tipo === "guardando"}
          className={`${btnPrimario} ml-auto disabled:opacity-60 disabled:active:scale-100`}
        >
          {estado.tipo === "guardando" ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </main>
  );
}
