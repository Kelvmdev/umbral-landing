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

## Datos

`src/content/propiedades.json` y `src/content/sitio.json` (editables desde `/admin`). En local las imágenes subidas van a `public/uploads/` (gitignored); en producción irán a Cloudinary.

## Variables de entorno

Crear `.env.local` (NO se commitea). Pedir los valores reales al dueño; no inventarlos.

| Clave | Para qué | Estado |
|---|---|---|
| `GROQ_API_KEY` | Asesor IA (Groq, gratis; servidor, nunca al navegador) | ⏳ pendiente |
| `ADMIN_PASSWORD` · `SESSION_SECRET` | Login del panel `/admin` (auth HMAC) | ✅ local |
| `FORMSPREE_ID` | Envío del formulario de interés (Formspree) | ✅ `meebebvy` |
| `GITHUB_TOKEN` · `GITHUB_OWNER` · `GITHUB_REPO` · `GITHUB_BRANCH` | Guardado del CMS en producción (GitHub Contents API) | ⏳ al desplegar |
| `NEXT_PUBLIC_SITE_URL` | URL absoluta (SEO/OG/sitemap) | ⏳ al desplegar |

> Estado completo y próximos pasos: ver [`ESTADO.md`](./ESTADO.md).

## Desarrollo

```bash
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Plan por fases (loop, una por iteración)

- [x] **0** · Concepto + firma + tokens + estructura + README
- [x] **1** · Maquetado: nav, hero, grid, detalle `[slug]`, mapa, footer (+ dark mode, animaciones al scroll)
- [x] **2** · Datos JSON + CMS `/admin` (HMAC) + subir imágenes *(guardado local; GitHub al desplegar)*
- [x] **3** · Formulario → Formspree (proxy) + `/gracias`
- [x] **4** · 🤖 Asesor IA: endpoint server-side (Groq) + grounding + streaming + chat accesible *(falta poner `GROQ_API_KEY` y probar)*
- [ ] **5** · SEO/GEO + accesibilidad + rendimiento + CHECK FINAL ADVERSARIAL
