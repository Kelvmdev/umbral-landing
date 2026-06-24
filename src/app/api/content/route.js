import { cookies } from "next/headers";
import fs from "node:fs/promises";
import path from "node:path";
import { tokenValido, COOKIE } from "@/lib/auth";

// ponytail: backend local (fs). En producción (con GITHUB_TOKEN) se commiteará
// vía GitHub Contents API; se añade al conectar el deploy.
export async function POST(req) {
  const jar = await cookies();
  if (!tokenValido(jar.get(COOKIE)?.value)) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  let datos;
  try {
    datos = await req.json();
  } catch {
    return Response.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const { propiedades, sitio } = datos || {};
  if (!Array.isArray(propiedades) || !sitio || typeof sitio !== "object") {
    return Response.json({ ok: false, error: "Faltan datos" }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "src", "content");
  try {
    await fs.writeFile(
      path.join(dir, "propiedades.json"),
      JSON.stringify(propiedades, null, 2) + "\n",
      "utf-8"
    );
    await fs.writeFile(
      path.join(dir, "sitio.json"),
      JSON.stringify(sitio, null, 2) + "\n",
      "utf-8"
    );
  } catch (e) {
    return Response.json({ ok: false, error: "No se pudo guardar" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
