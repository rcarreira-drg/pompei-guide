#!/usr/bin/env node
/**
 * MapLibre GL JS reparte su trabajo de teselas en un Worker (módulo ES) que a su vez
 * importa un chunk "shared" por ruta relativa. Vite no sabe seguir esa importación
 * interna (la URL del worker se calcula en tiempo de ejecución, no es un literal), así
 * que en vez de depender de su empaquetado copiamos los dos ficheros tal cual a
 * public/maplibre/ (servidos sin procesar, en dev y en build) y apuntamos ahí con
 * maplibregl.setWorkerUrl() (ver src/components/RouteMap.tsx).
 *
 * Este script se ejecuta en "postinstall" para mantenerlos al día si se actualiza
 * la dependencia; los ficheros copiados también quedan versionados por si el
 * postinstall no llega a correr (p.ej. instalaciones con --ignore-scripts).
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'node_modules/maplibre-gl/dist');
const dest = join(root, 'public/maplibre');

const files = ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs'];

if (!existsSync(src)) {
  console.warn('[copy-maplibre-worker] node_modules/maplibre-gl no encontrado, se omite (¿instalación parcial?).');
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
for (const f of files) {
  copyFileSync(join(src, f), join(dest, f));
}
console.log(`[copy-maplibre-worker] copiados ${files.join(', ')} a public/maplibre/`);
