"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { btnPrimario, btnSecundario } from "@/lib/estilos";

// ── Inputs reutilizables ───────────────────────────────────────────────
const inputBase =
  "w-full rounded-lg border border-linea bg-papel px-3 py-2 font-body text-sm text-tinta outline-none focus:border-arcilla";

function Campo({ label, value, onChange, type = "text", textarea }) {
  return (
    <label className="block">
      <span className="font-body text-xs uppercase tracking-wide text-tenue">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`mt-1 ${inputBase}`} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
          className={`mt-1 ${inputBase}`}
        />
      )}
    </label>
  );
}

// Cloudinary unsigned: el navegador sube la foto al "almacen externo" y nos
// devuelve la URL. Cloud name + preset son PUBLICOS por diseno (el preset
// unsigned no expone API key), por eso van hardcodeados y no como secreto.
// ponytail: config publica que no cambia -> constante, no env var.
const CLOUD = "dm43alaeg";
const PRESET = "umbral_unsigned";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

// Botón que sube un archivo desde el PC a Cloudinary y devuelve su secure_url
function SubirBoton({ onSubido, label = "⬆ Subir desde PC" }) {
  const [subiendo, setSubiendo] = useState(false);
  const [err, setErr] = useState("");

  async function manejar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    if (!file.type.startsWith("image/")) return setErr("Solo imágenes");
    if (file.size > MAX_BYTES) return setErr("Máximo 8 MB");
    if (!CLOUD || !PRESET) return setErr("Cloudinary no configurado");
    setSubiendo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", PRESET);
      const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.secure_url) onSubido(d.secure_url);
      else setErr(d.error?.message || "Falló la subida");
    } catch {
      setErr("Error de red");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <label className="cursor-pointer rounded-full border border-linea px-4 py-1.5 font-body text-sm text-tinta-suave transition hover:bg-papel-3">
        <input type="file" accept="image/*" onChange={manejar} className="hidden" disabled={subiendo} />
        {subiendo ? "Subiendo…" : label}
      </label>
      {err && <span className="font-body text-xs text-arcilla">{err}</span>}
    </span>
  );
}

// Editor de una lista de URLs de imagen (subir desde PC o pegar link)
function ListaImagenes({ urls, onChange }) {
  const set = (j, v) => onChange(urls.map((u, k) => (k === j ? v : u)));
  const quitar = (j) => onChange(urls.filter((_, k) => k !== j));
  const agregar = () => onChange([...urls, ""]);

  return (
    <div className="sm:col-span-2">
      <span className="font-body text-xs uppercase tracking-wide text-tenue">
        Imágenes (pega la URL)
      </span>
      <div className="mt-1 space-y-2">
        {urls.map((u, j) => (
          <div key={j} className="flex items-center gap-2">
            {u ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
            ) : (
              <div className="h-10 w-14 shrink-0 rounded bg-papel-3" />
            )}
            <input value={u} onChange={(e) => set(j, e.target.value)} placeholder="https://…" className={inputBase} />
            <button
              type="button"
              onClick={() => quitar(j)}
              aria-label="Quitar imagen"
              className="shrink-0 rounded-md px-2 py-1 font-body text-sm text-arcilla transition hover:bg-papel-3"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <SubirBoton onSubido={(url) => onChange([...urls, url])} />
        <button type="button" onClick={agregar} className="font-body text-sm text-arcilla hover:underline">
          + Pegar URL
        </button>
      </div>
    </div>
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

  // FAQ
  const setFaq = (i, campo, v) =>
    setSitio((s) => ({ ...s, faqs: s.faqs.map((f, j) => (j === i ? { ...f, [campo]: v } : f)) }));
  const addFaq = () => setSitio((s) => ({ ...s, faqs: [...s.faqs, { q: "", a: "" }] }));
  const delFaq = (i) => setSitio((s) => ({ ...s, faqs: s.faqs.filter((_, j) => j !== i) }));

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
      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ["propiedades", "Propiedades"],
          ["sitio", "Sitio"],
          ["preguntas", "Preguntas"],
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
                    className={`mt-1 ${inputBase}`}
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
                <ListaImagenes urls={p.imagenes} onChange={(arr) => setProp(i, "imagenes", arr)} />
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
              <div>
                <div className="flex items-center gap-3">
                  {sitio.hero.imagen && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sitio.hero.imagen} alt="" className="h-14 w-20 shrink-0 rounded object-cover" />
                  )}
                  <div className="flex-1">
                    <Campo label="Imagen del hero (URL)" value={sitio.hero.imagen} onChange={(v) => setSit("hero", "imagen", v)} />
                  </div>
                </div>
                <div className="mt-3">
                  <SubirBoton onSubido={(url) => setSit("hero", "imagen", url)} />
                </div>
              </div>
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

      {/* ── Preguntas (FAQ) ── */}
      {tab === "preguntas" && (
        <div className="mt-6 space-y-4">
          {sitio.faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-linea bg-papel-2 p-5">
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <Campo label="Pregunta" value={f.q} onChange={(v) => setFaq(i, "q", v)} />
                  <Campo label="Respuesta" textarea value={f.a} onChange={(v) => setFaq(i, "a", v)} />
                </div>
                <button
                  type="button"
                  onClick={() => delFaq(i)}
                  aria-label="Eliminar pregunta"
                  className="shrink-0 rounded-md px-2 py-1 font-body text-sm text-arcilla transition hover:bg-papel-3"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addFaq} className={btnSecundario}>
            + Añadir pregunta
          </button>
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
