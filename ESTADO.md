# Estado del proyecto — Umbral

> Última sesión: **2026-06-24**. Próxima: **2026-06-25**.
> Ruta del proyecto: `C:\Users\pc\Documents\Trabajos\Landings\Proyectos\umbral`

## Cómo trabajamos (loop por fases)
Una fase por iteración: construir → verificar (`npm run build`) → commit → checklist para que Kervin pruebe. El loop **se detiene en "puertas de decisión"** (cuando hace falta un secreto o un dato que solo Kervin tiene). Kervin es aprendiz: explicar el **porqué antes del cómo**, en tandas pequeñas.

## ✅ Hecho (Fases 0–4)
- **0** Concepto "Umbral" (estudio de arquitectura cálido), tokens, fuentes Fraunces + Hanken Grotesk.
- **1** Maquetado completo: nav (hamburguesa), hero, grid, detalle `/propiedad/[slug]`, mapa anti-hijack, footer, 404, `/preguntas`. **Dark mode** (toggle sol/luna) + **animaciones al scroll** (`Reveal`). Botones con efecto de tarjeta.
- **2** Datos en `src/content/*.json`. Panel `/admin` con login **HMAC** (`lib/auth.js`), pestañas Propiedades/Sitio/Preguntas, **subir imágenes desde el PC** (`/api/upload` → `public/uploads/`, gitignored). Guardado **local** (`/api/content` escribe los JSON).
- **3** Formulario de interés (`components/Formulario.js`) → proxy `/api/lead` → **Formspree** (`FORMSPREE_ID=meebebvy`, ya configurado y probado) → `/gracias`. Campos: nombre, celular, correo, ¿qué buscas?, tipo de propiedad, mensaje, consentimiento.
- **4** Asesor IA: chat flotante accesible (`components/Asesor.js`) → `/api/asesor` (server, **streaming**) usando **Groq** (gratis, `llama-3.3-70b-versatile`). Grounding en `lib/asesor-prompt.js` (responde solo con los datos, no inventa).

## ⏳ PENDIENTE INMEDIATO (retomar aquí mañana)
**Probar el Asesor IA** — Kervin YA tiene su `GROQ_API_KEY` pero NO la ha puesto ni probado el chat.
1. Editar `.env.local` (sin VS Code, con Bloc de notas): `notepad "...\umbral\.env.local"`, descomentar y completar `GROQ_API_KEY=gsk_...`, guardar.
2. **Reiniciar** el dev server (el `.env` se lee al arrancar). ← lo puede hacer el agente en segundo plano.
3. Abrir el botón de chat (abajo-derecha) y preguntar p.ej. "¿qué casas hay en Laureles?".

## ⏳ Fase 5 (siguiente fase, NO necesita secretos)
SEO + GEO (metadata por página, JSON-LD Organization + Product/Offer + FAQPage, OG, sitemap, robots, `llms.txt`, favicon), accesibilidad AA, rendimiento, y **CHECK FINAL ADVERSARIAL** (subagente `revisor-final`). Se puede correr de principio a fin.

## ⏳ Para el despliegue (Vercel, más adelante)
- Subir el proyecto a un **repo de GitHub** + deploy en Vercel.
- **CMS en prod:** cambiar el guardado de `/api/content` a **GitHub Contents API** (`GITHUB_TOKEN/OWNER/REPO/BRANCH`). Hoy escribe disco local (Vercel es read-only).
- **Imágenes en prod:** cambiar la subida de `/api/upload` (local) a **Cloudinary** (unsigned upload). Hoy guarda en `public/uploads/`.
- `NEXT_PUBLIC_SITE_URL` real para SEO/OG/sitemap.

## ⚠️ Gotchas conocidos (importantes)
- **Next.js 16**: tiene breaking changes; antes de tocar APIs, leer `node_modules/next/dist/docs/`. `params` es **asíncrono** en `[slug]`.
- **CSS no se actualiza en dev**: caché de Turbopack pegada → **borrar `.next` y reiniciar** el dev server (pasó con el dark mode y con rutas nuevas).
- **`.env.local` se lee solo al arrancar** `npm run dev` → reiniciar tras editarlo.
- **VS Code de Kervin está ocupado con otro proyecto** → editar `.env.local` con Bloc de notas y **correr/reiniciar el dev server de Umbral en segundo plano** desde la sesión (Next bloquea 2 dev servers del mismo proyecto a la vez).
- `.env.local` está **gitignored** (no se commitea). Secretos nunca en el chat.

## Comandos
```bash
npm run dev      # http://localhost:3000
npm run build    # build de producción (verificación de cada fase)
```
