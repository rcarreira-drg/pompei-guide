# CLAUDE.md — Guía de Pompeya

## Forma de trabajar (regla del usuario, obligatoria)
- **Orquestación**: el modelo principal (Fable) actúa solo como orquestador inteligente: define arquitectura, criterios, guías de estilo, revisa resultados e integra.
- **Ejecución con modelos menores, siempre**: toda tarea delegable (contenido, investigación, componentes, tests, refactors mecánicos, QA) se lanza con agentes `sonnet` o `haiku`, nunca con `fable` ni `opus`. Si una tarea exige más calidad, se compensa con una guía de estilo detallada, ejemplos y una pasada de revisión, no subiendo de modelo.
- Los agentes trabajan por lotes y guardan en disco tras cada lote (los límites de sesión de la API pueden cortarlos).
- Verificar siempre con Playwright (`npx playwright test`) y con `node scripts/lint-content.mjs` antes de desplegar.

## Proyecto
- Webapp mobile-first, brutalista, en español (España, registro "vosotros"), para preparar y recorrer Pompeya. Vite + React 18 + TS strict + react-router (HashRouter) + react-leaflet + vite-plugin-pwa. Sin backend.
- Publicación: GitHub Pages en https://rcarreira-drg.github.io/pompei-guide/ (`npm run build && npm run deploy`). Base `/pompei-guide/`.
- Contenido tipado en `src/content/*.ts` (ver `types.ts`). Guía de estilo de narración en `docs/STYLE.md`; brief en `docs/BRIEF.md`; notas verificadas en `docs/RESEARCH-NOTES.md`.
- Narración: solo voz del móvil (Web Speech). No reintroducir audio pregrabado (el usuario lo descartó).
- Marca: "Pompei" (italiano) en toda la interfaz; la prosa de los relatos usa "Pompeya" (castellano).
- Modos de ruta: exprés (13), completa (24), total (clásica + puntos extra). Plano oficial: `src/content/official.ts` (leyenda transcrita del plano de papel) + `official-entries.ts`.
- Mapa: MapLibre GL con teselas vectoriales de OpenFreeMap y estilo propio en `src/lib/mapStyle.ts` (capas configurables, bloqueo táctil, rotación). El worker de MapLibre se copia a `public/maplibre/` en `postinstall` (no quitar). Leaflet ya no se usa.
- Estado compartido con `useSyncExternalStore` en `src/lib/useProgress.ts`, `useGeolocation.ts` (GPS persistente que activa la brújula) y `useHeading.ts`.
- Coordenadas: `scripts/osm-names.json` (OSM) y Wikidata; trazado de calles con `scripts/build-path.mjs` y `build-streets.mjs`; imágenes con `scripts/fetch-images.mjs` / `fetch-gallery.mjs` (solo licencias libres de Wikimedia Commons, crédito en `images.ts`).
- Onboarding: `docs/ONBOARDING-SPEC.md`; three.js solo por carga perezosa (`src/components/three/`).
- Flujo de una tarea: escribir spec/guía → agente sonnet por lotes → `npm run build` → `npx playwright test` → `node scripts/lint-content.mjs` si hay contenido → commit → `npm run deploy` → smoke en producción.
