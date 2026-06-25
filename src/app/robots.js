import { SITE_URL } from "@/lib/site";

// Next genera /robots.txt desde aquí. Bloqueamos /admin y la API (no son páginas).
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
