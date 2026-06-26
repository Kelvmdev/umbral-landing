# Estado del proyecto — Umbral

> Última sesión: **2026-06-26**. Próxima: por definir.
> Ruta del proyecto: `C:\Users\pc\Documents\Trabajos\Landings\Proyectos\umbral`
> **En vivo:** https://umbral-landing-pi.vercel.app · **Repo:** github.com/Kelvmdev/umbral-landing (público, rama `main`)

## Cómo trabajamos (loop por fases)
Una fase por iteración: construir → verificar (`npm run build`) → commit → checklist para que Kervin pruebe. El loop **se detiene en "puertas de decisión"** (cuando hace falta un secreto o un dato que solo Kervin tiene). Kervin es aprendiz: explicar el **porqué antes del cómo**, en tandas pequeñas.

## ✅ Hecho
- **Fases 0–4** Concepto + maquetado completo (nav, hero, grid, `/propiedad/[slug]`, mapa anti-hijack, footer, 404, `/preguntas`), dark mode, animaciones al scroll, panel `/admin` con login **HMAC**, formulario → Formspree → `/gracias`.
- **Asesor IA** (chat flotante, streaming, **Groq** gratis, grounded en el catálogo). Mejorado: precios legibles, separa venta/arriendo, respeta presupuesto, exhaustividad, aclara intención ("habitaciones" ambiguo), `temperature 0`. Accesible: `role=dialog` + Esc (listener global) + focus-trap.
- **Fase 5 — SEO/GEO + accesibilidad AA** (todo el código):
  - SEO: `metadataBase`, OG por página, `robots.txt` (con bots de IA), `sitemap.xml`, `llms.txt` autogenerado, favicon de marca (`icon.svg` + `apple-icon`).
  - JSON-LD: `RealEstateAgent` (solo home, con geo), `FAQPage` (home + /preguntas), `House`/`Apartment` + Offer (precio, venta/arriendo) por ficha.
  - A11y: contraste AA real en claro y oscuro (tokens tenue/arcilla/oliva), skip-link funcional, `focus-visible`, `color-scheme`, `scroll-padding-top`, `<main tabIndex=-1>`.
  - Auditoría adversarial (`revisor-final`) corrida y resuelta.
- **Deploy en Vercel** + env vars: `GROQ_API_KEY`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `FORMSPREE_ID`, `NEXT_PUBLIC_SITE_URL`, `GITHUB_TOKEN`.
- **CMS de TEXTO en producción**: `/admin` ya commitea a GitHub (no escribe disco). `src/lib/repo.js` → `commitArchivos()` con **Git Data API** (5 pasos, commit atómico de `propiedades.json`+`sitio.json`). `api/content` = backend dual (con `GITHUB_TOKEN` → GitHub; sin token → `fs` en dev). Probado end-to-end.

## ⏳ PENDIENTE INMEDIATO (retomar aquí)
**Parte 2 del CMS — imágenes a Cloudinary.** Hoy `src/app/api/upload/route.js` guarda en `public/uploads/` (no funciona en Vercel, disco de solo lectura). Migrar a **Cloudinary** (unsigned upload): el navegador/servidor sube a Cloudinary y se guarda la **URL** en el JSON (nunca el binario). Necesita **cuenta gratis de Cloudinary** (Kervin) → `CLOUDINARY_CLOUD_NAME` + un unsigned upload preset. Detalle en manual tema 06.

## ⏳ Contenido real (cuando Kervin lo tenga)
- Datos reales en `src/content/sitio.json`: WhatsApp/tel/email (hoy `573000000000`), URLs de redes (hoy raíz de instagram/facebook).
- Fotos reales en `propiedades.json` (hoy `picsum.photos`) — editar desde `/admin` una vez Cloudinary esté listo.
- Medir **PageSpeed** real en la URL de Vercel.

## ⚠️ Gotchas conocidos (importantes)
- **REGLA DE ORO CMS:** tras editar desde `/admin` (local o prod), `git pull --no-rebase --no-edit` ANTES de tocar código local. El CMS edita la copia de GitHub; tu local se desfasa.
- **`.env.local` local tiene ahora `GITHUB_TOKEN`** → tu `/admin` local commitea a GitHub (no a disco). Es lo esperado.
- **Next.js 16**: breaking changes; antes de tocar APIs leer `node_modules/next/dist/docs/`. `params` es **asíncrono** en `[slug]`.
- **Caché de Turbopack pegada**: si el dev tira 500 raros o el CSS no refresca → **borrar `.next` y reiniciar**. Ojo: si el puerto 3000 está ocupado por un server viejo, Next arranca en 3001 (cuidado al probar contra el puerto correcto).
- **`.env.local` se lee solo al arrancar** `npm run dev` → reiniciar tras editarlo. Está **gitignored** (`.env*`).

## Comandos
```bash
npm run dev      # http://localhost:3000
npm run build    # build de producción (verificación de cada fase)
```
