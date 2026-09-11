# POMPEYA — Guía de visita

Webapp mobile-first (PWA, offline) en estilo brutalista para **preparar** y **recorrer** el Parque Arqueológico de Pompeya.

- **Preparar**: 8 capítulos de historia y contexto, cronología, glosario y quiz.
- **Visita**: ruta guiada de 24 paradas con mapa (Leaflet/OSM), geolocalización, brújula, narración por voz (Web Speech API), progreso persistente y planificador horario.
- **Práctico**: entradas, transporte, planificación del día, normas, checklist y FAQ, con clima del día (Open-Meteo).

Stack: Vite · React 18 · TypeScript · react-router · react-leaflet · vite-plugin-pwa. Sin backend. Hosting: GitHub Pages.

```bash
npm install
npm run dev          # desarrollo
npm run build        # build + typecheck
npm run test:e2e     # Playwright (levanta preview automáticamente)
npm run deploy       # publica dist/ en gh-pages
```

Imágenes: Wikimedia Commons (dominio público / CC, créditos en `src/content/images.ts`). Mapa: © OpenStreetMap contributors. Proyecto no oficial, sin relación con el Parco Archeologico di Pompei.
