import { cookies } from "next/headers";
import fs from "node:fs/promises";
import path from "node:path";
import { tokenValido, COOKIE } from "@/lib/auth";

// ponytail: subida LOCAL a public/uploads (gitignored). En producción se
// reemplaza por subida a Cloudinary (Vercel tiene disco de solo lectura).
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const EXT_OK = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

export async function POST(req) {
  const jar = await cookies();
  if (!tokenValido(jar.get(COOKIE)?.value)) {
    return Response.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  let file;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return Response.json({ ok: false, error: "Subida inválida" }, { status: 400 });
  }
  if (!file || typeof file === "string") {
    return Response.json({ ok: false, error: "Falta el archivo" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return Response.json({ ok: false, error: "Solo imágenes" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ ok: false, error: "Máximo 8 MB" }, { status: 400 });
  }

  // Nombre seguro: base saneada + extensión válida (evita path traversal)
  const ext = path.extname(file.name || "").toLowerCase();
  if (!EXT_OK.has(ext)) {
    return Response.json({ ok: false, error: "Formato no soportado" }, { status: 400 });
  }
  const base = path
    .basename(file.name || "img", ext)
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .slice(0, 40);
  const nombre = `${Date.now()}-${base || "img"}${ext}`;

  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(dir, { recursive: true });
    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, nombre), buf);
  } catch {
    return Response.json({ ok: false, error: "No se pudo guardar" }, { status: 500 });
  }

  return Response.json({ ok: true, url: `/uploads/${nombre}` });
}
