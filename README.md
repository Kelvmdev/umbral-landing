# Umbral — *donde empieza el hogar*

Sitio inmobiliario (catálogo de propiedades en venta/arriendo) con **Asesor virtual de IA**.

## Concepto

Estudio de arquitectura boutique, no portal genérico. Editorial, cálido, hecho a mano.

- **Firma:** cada propiedad va enmarcada por un *umbral* (líneas tipo plano) + número de catálogo editorial.
- **Paleta:** tinta cálida · papel hueso · acento **arcilla/terracota** · oliva apagado. (tokens en `src/app/globals.css`)
- **Tipografía:** Fraunces (serif editorial, titulares) + Hanken Grotesk (sans humanista, cuerpo).

## Stack

Next.js 16 (App Router, JavaScript) · Tailwind v4 (`@theme`) · fuentes self-host con `next/font` · deploy en Vercel.

> ⚠️ Esta es Next.js 16: tiene cambios que rompen vs versiones previas. Antes de tocar APIs, consultar `node_modules/next/dist/docs/`.

## Datos (desde la Fase 2)

`src/content/propiedades.json` y `src/content/sitio.json`. Imágenes vía Cloudinary (nunca binarios en el repo).

## Variables de entorno

Crear `.env.local` (NO se commitea). Pedir los valores reales al dueño; no inventarlos.

| Clave | Para qué |
|---|---|
| `ANTHROPIC_API_KEY` | Asesor IA (servidor, nunca al navegador) |
| `ADMIN_PASSWORD` · `SESSION_SECRET` | Login del panel `/admin` (auth HMAC) |
| `GITHUB_TOKEN` · `GITHUB_OWNER` · `GITHUB_REPO` · `GITHUB_BRANCH` | Guardado del CMS vía GitHub Contents API |
| `HUBSPOT_PORTAL_ID` · `HUBSPOT_FORM_ID` | Envío del formulario de interés |
| `NEXT_PUBLIC_SITE_URL` | URL absoluta (SEO/OG/sitemap) |

## Desarrollo

```bash
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Plan por fases (loop, una por iteración)

- [x] **0** · Concepto + firma + tokens + estructura + README
- [ ] **1** · Maquetado: nav, hero, grid, detalle `[slug]`, mapa, footer
- [ ] **2** · Datos + CMS `/admin` (HMAC) + GitHub API
- [ ] **3** · Formulario → HubSpot (proxy) + `/gracias`
- [ ] **4** · 🤖 Asesor IA: endpoint server-side + grounding + streaming + chat accesible
- [ ] **5** · SEO/GEO + accesibilidad + rendimiento + CHECK FINAL ADVERSARIAL
