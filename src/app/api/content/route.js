import { cookies } from "next/headers";
import fs from "node:fs/promises";
import path from "node:path";
import { tokenValido, COOKIE } from "@/lib/auth";
import { usaGitHub, commitArchivos } from "@/lib/repo";

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

  // Serializa una vez; se reusa para ambos backends.
  const archivos = [
    {
      path: "src/content/propiedades.json",
      content: JSON.stringify(propiedades, null, 2) + "\n",
    },
    {
      path: "src/content/sitio.json",
      content: JSON.stringify(sitio, null, 2) + "\n",
    },
  ];

  try {
    if (usaGitHub()) {
      // Prod: un commit con ambos archivos → Vercel rebuildea una vez
      await commitArchivos(archivos, "CMS: actualizar contenido");
    } else {
      // Dev: escribe en disco local
      for (const a of archivos) {
        await fs.writeFile(path.join(process.cwd(), a.path), a.content, "utf-8");
      }
    }
  } catch (e) {
    console.error("[content] guardar:", e);
    return Response.json({ ok: false, error: "No se pudo guardar" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
