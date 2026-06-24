"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { btnPrimario } from "@/lib/estilos";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (r.ok) {
        router.refresh(); // vuelve a /admin ya autenticado → muestra el panel
      } else {
        const d = await r.json().catch(() => ({}));
        setError(d.error || "No se pudo iniciar sesión");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-[8%] py-[10vh]">
      <p className="font-body text-xs uppercase tracking-[0.4em] text-tenue">Panel</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-tinta">Umbral · Admin</h1>
      <p className="mt-2 font-body text-sm text-tenue">
        Ingresa la contraseña para editar el sitio.
      </p>

      <form onSubmit={enviar} className="mt-8 flex flex-col gap-4">
        <label className="font-body text-sm font-medium text-tinta-suave" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border border-linea bg-papel-2 px-4 py-3 font-body text-tinta outline-none focus:border-arcilla"
          required
        />
        {error && (
          <p role="alert" className="font-body text-sm text-arcilla">
            {error}
          </p>
        )}
        <button type="submit" disabled={cargando} className={`${btnPrimario} disabled:opacity-60 disabled:active:scale-100`}>
          {cargando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
