import crypto from "node:crypto";

export const COOKIE = "umbral_sesion";
const HORAS = 8;
export const MAX_EDAD = HORAS * 60 * 60; // segundos

function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s) console.error("⚠ FALTA SESSION_SECRET: el login no es seguro.");
  return s || "";
}

function firmar(dato) {
  return crypto.createHmac("sha256", secreto()).update(dato).digest("hex");
}

/** Token = "expira.HMAC(expira)". No contiene la contraseña. */
export function crearToken() {
  const expira = String(Date.now() + HORAS * 60 * 60 * 1000);
  return `${expira}.${firmar(expira)}`;
}

/** Válido = firma correcta (tiempo constante) + no expirado. */
export function tokenValido(token) {
  if (!token || typeof token !== "string") return false;
  const i = token.indexOf(".");
  if (i < 0) return false;
  const expira = token.slice(0, i);
  const sig = token.slice(i + 1);
  if (!/^\d+$/.test(expira) || Date.now() > Number(expira)) return false;
  const esperado = firmar(expira);
  const a = Buffer.from(sig);
  const b = Buffer.from(esperado);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Compara la contraseña en tiempo constante (hash de ambas). */
export function passwordOk(intento) {
  const real = process.env.ADMIN_PASSWORD || "";
  const a = crypto.createHash("sha256").update(String(intento)).digest();
  const b = crypto.createHash("sha256").update(real).digest();
  return crypto.timingSafeEqual(a, b) && real.length > 0;
}
