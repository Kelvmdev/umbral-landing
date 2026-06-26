import { SITE_URL } from "@/lib/site";

// Next genera /robots.txt desde aquí. Bloqueamos /admin y la API (no son páginas).
export default function robots() {
  const disallow = ["/admin", "/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Bots de IA: permiso explícito para que nos lean y citen (GEO).
      {
        userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
