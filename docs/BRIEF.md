# BRIEF — POMPEYA, guía de visita (webapp mobile-first, estilo brutalista)

## Objetivo
Webapp en **español** que (1) prepara al visitante antes del viaje con contexto histórico profundo y (2) el día de la visita funciona como guía interactiva parada a parada (mapa, geolocalización, narración por voz, progreso). Hosting gratuito en GitHub Pages (`base: /pompei-guide/`). PWA offline.

## Stack (ya instalado, NO cambiar)
Vite 5 + React 18 + TypeScript (strict) + react-router-dom 6 (HashRouter) + react-leaflet 4 / leaflet + vite-plugin-pwa. CSS plano con tokens (`src/styles/tokens.css`, `global.css`). Sin Tailwind. Alias `@/` → `src/`.

## Convenciones
- Tipos de contenido en `src/content/types.ts`. **Leerlo antes de escribir contenido o UI.**
- Exports obligatorios (la UI los importa con estos nombres exactos):
  - `src/content/sections.ts` → `export const SECTIONS: Section[]` (capítulos previos a la visita)
  - `src/content/timeline.ts` → `export const TIMELINE: TimelineEvent[]`
  - `src/content/glossary.ts` → `export const GLOSSARY: { term: string; def: string }[]`
  - `src/content/route.ts` → `export const ROUTE: Route`
  - `src/content/practical.ts` → `export const PRACTICAL_SECTIONS: Section[]`, `export const CHECKLIST: ChecklistItem[]`, `export const FAQS: Faq[]`
  - `src/content/images.ts` → `IMAGES`, `img(id)` (manifiesto; lo rellena el agente de imágenes)
  - `src/illustrations/index.tsx` → `export function Illustration({ name, className, title }: { name: IllustrationName; className?: string; title?: string })`
- Las imágenes se referencian por **id lógico** (ver lista abajo) usando `img('id')` en `src`, o en bloques `{ type: 'img', src: 'ID_LOGICO', ... }` (la UI resuelve con `img()` si `src` no empieza por `http` ni `/`).
- Texto: español de España, tono de guía culto pero cercano, sin florituras vacías. Datos verificables; cuando hay debate académico, decirlo. Citas de fuentes antiguas (Plinio el Joven, Cartas VI.16 y VI.20; Séneca; Tácito) en bloques `quote`.
- Estilo visual: **brutalismo** = bordes negros gruesos (3-5px), sombras duras desplazadas, tipografía display enorme en mayúsculas (Archivo Black), mono (JetBrains Mono) para etiquetas, paleta papel `#f2efe6` / tinta `#111` / rojo pompeyano `#b4321e` / ocre `#d9a521`. Sin radios, sin degradados suaves, sin sombras difusas. Alto contraste. Mobile-first (360-430px primero).

## Lista canónica de IDs de imagen (Wikimedia Commons, PD o CC)
vesubio-panoramica, foro-vesubio, foro-columnas, anfiteatro, anfiteatro-interior, teatro-grande, odeon, via-abbondanza, via-stabiana-adoquines, termopolio-asellina, termopolio-regio-v, casa-fauno, mosaico-alejandro, casa-vettii-fresco, casa-vettii-priapo, villa-misterios-fresco, villa-misterios-exterior, lupanar-fresco, termas-estabianas, termas-foro, calcos-yeso, jardin-fugitivos, templo-apolo, templo-jupiter, templo-isis, basilica, panaderia-horno, pan-carbonizado, porta-marina, cave-canem, casa-menandro, palestra-grande, fullonica-stephanus, graffiti, necropolis-porta-nocera, arco-caligula, macellum, edificio-eumachia, lararium, erupcion-pintura (John Martin o similar, PD), plinio-grabado (PD), plano-historico (plano s. XIX, PD), fiorelli-retrato (PD), herculano-papiros (opcional), perro-mosaico, cocina-romana, anfora, escritorio-tablillas, calle-fuente, comitium.

## Ruta (para el agente de ruta)
Entrada por **Porta Marina** (la principal, junto a estación Circumvesuviana "Pompei Scavi – Villa dei Misteri"). ~22-24 paradas, 5-6 h, terminando en Anfiteatro/Palestra Grande (salida Piazza Anfiteatro) o volviendo. Coordenadas WGS84 reales verificadas (buscar en web: Wikipedia/Wikidata/OSM). Orden lógico caminable. Incluir Villa de los Misterios como parada opcional/final.
