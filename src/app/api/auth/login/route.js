import { cookies } from "next/headers";
import { crearToken, passwordOk, COOKIE, MAX_EDAD } from "@/lib/auth";

export async function POST(req) {
  let password = "";
  try {
    ({ password } = await req.json());
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (!passwordOk(password)) {
    return Response.json({ ok: false, error: "Contraseña incorrecta" }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(COOKIE, crearToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_EDAD,
  });
  return Response.json({ ok: true });
}
