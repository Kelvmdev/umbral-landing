// URL pública del sitio, fuente única para SEO/OG/sitemap.
// En local y en preview funciona con el fallback; en producción define
// NEXT_PUBLIC_SITE_URL en Vercel con tu dominio real.
// ponytail: fallback al dominio real de Vercel; cámbialo cuando tengas dominio propio.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://umbral-landing-pi.vercel.app"
).replace(/\/$/, ""); // sin barra final, para construir URLs sin "//"
