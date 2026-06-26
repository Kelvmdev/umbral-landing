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
- **Auditoría final (26 jun)** — segunda pasada `revisor-final` contra los 10 temas + GEO. **GEO confirmado correcto.** Arreglado (commit `792137a`): fallback `SITE_URL` al dominio real, FAQPage de la home cuadrado con las 5 visibles, `image` en JSON-LD de fichas, OG de ficha con crop Cloudinary 1200×630, skip-link a `focus-visible`, **`inert` al fondo cuando abre el Asesor**, guardas si una propiedad llega sin foto, limpieza de SVGs del scaffold. PageSpeed móvil **95/100/100/100**.
  - *Pendientes opcionales no bloqueantes (YAGNI):* `app/error.js`, `twitter-image.js`, `type="button"` en botones del admin, `hero.alt` editable desde CMS, campo `destacada` sin uso, `bg-x/N` en Chrome<111.
- **Deploy en Vercel** + env vars: `GROQ_API_KEY`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `FORMSPREE_ID`, `NEXT_PUBLIC_SITE_URL`, `GITHUB_TOKEN`.
- **CMS de TEXTO en producción**: `/admin` ya commitea a GitHub (no escribe disco). `src/lib/repo.js` → `commitArchivos()` con **Git Data API** (5 pasos, commit atómico de `propiedades.json`+`sitio.json`). `api/content` = backend dual (con `GITHUB_TOKEN` → GitHub; sin token → `fs` en dev). Probado end-to-end.

## ✅ Parte 2 del CMS — imágenes a Cloudinary (HECHO Y VERIFICADO EN VIVO, 26 jun)
El botón "Subir desde PC" (`src/app/admin/PanelAdmin.js` → `SubirBoton`) sube **directo del navegador a Cloudinary** (unsigned) y guarda la `secure_url` en el JSON. Ruta vieja `api/upload` (escribía a disco) **borrada**. Cuenta: cloud `dm43alaeg`, preset unsigned `umbral_unsigned`.
- **Cloud name y preset están HARDCODEADOS** en `PanelAdmin.js` (son públicos por diseño: el preset unsigned no expone API key). Se intentó primero con `NEXT_PUBLIC_*` env vars pero el build no las "horneaba" (caché de build / Sensitive) → más simple y robusto hardcodear. Las env vars `NEXT_PUBLIC_CLOUDINARY_*` en Vercel/`​.env.local` ya **no se usan** (se pueden borrar).
- **Probado end-to-end en producción:** subir foto desde `/admin` en vivo funciona, URL `res.cloudinary.com/dm43alaeg/...` guardada y visible.

## ⏳ Contenido real (cuando Kervin lo tenga)
- Datos reales en `src/content/sitio.json`: WhatsApp/tel/email (hoy `573000000000`), URLs de redes (hoy raíz de instagram/facebook).
- Fotos reales en `propiedades.json` (hoy `picsum.photos`) — editar desde `/admin` una vez Cloudinary esté listo.
- Medir **PageSpeed** real en la URL de Vercel.
- ✅ **Portafolio (HECHO 26 jun):** Umbral + Lumen publicados en `mi-portafolio` (8 proyectos). Umbral 2º tras Pulso. Repo de Lumen pasado a público.

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
