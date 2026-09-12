#!/usr/bin/env node
/**
 * Genera los GeoJSON propios del parque que el mapa dibuja por encima de las teselas
 * vectoriales (que solo llegan a zoom 14): edificios/ruinas del yacimiento y calles.
 *
 * - public/geo/park-buildings.json: polígonos building=*, historic=ruins, ruins=*,
 *   historic=archaeological_site dentro del bbox del parque, descargados de Overpass
 *   (ways y relaciones multipolígono, con `out geom` para no necesitar una segunda
 *   pasada). Se recortan a 6 decimales, se descartan polígonos < 4 m² y, si el fichero
 *   supera los 900 KB, se simplifican (Douglas-Peucker, tolerancia ~0,3 m) antes de
 *   volver a comprobar el tamaño.
 * - public/geo/park-streets.json: las calles ya trianguladas en src/content/streets.json
 *   (grafo de nodos + aristas usado para el trazado de rutas) convertidas a LineStrings.
 *
 * Uso: node scripts/build-park-geo.mjs
 */
import { writeFileSync, mkdirSync, statSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, 'public/geo');
mkdirSync(outDir, { recursive: true });
const streets = JSON.parse(readFileSync(join(root, 'src/content/streets.json'), 'utf8'));

const BBOX = { s: 40.744, w: 14.474, n: 40.757, e: 14.5 }; // sur,oeste,norte,este
const MAX_BYTES = 900 * 1024;
const MIN_AREA_M2 = 4;
const SIMPLIFY_TOLERANCE_M = 0.3;

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const QUERY = `[out:json][timeout:60];
(
  way["building"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  way["historic"="ruins"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  way["ruins"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  way["historic"="archaeological_site"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  relation["building"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  relation["historic"="ruins"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  relation["ruins"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
  relation["historic"="archaeological_site"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});
);
out geom;`;

async function fetchOverpass(query, attempt = 1) {
  const endpoint = OVERPASS_ENDPOINTS[(attempt - 1) % OVERPASS_ENDPOINTS.length];
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'pompei-guide-build-script/1.0 (+https://github.com/rcarreira-drg/pompei-guide)',
      },
      body: `data=${encodeURIComponent(query)}`,
    });
    const text = await res.text();
    if (!res.ok || text.trimStart().startsWith('<?xml') || text.includes('runtime error')) {
      throw new Error(`Overpass respondió con error (intento ${attempt}): ${text.slice(0, 200)}`);
    }
    return JSON.parse(text);
  } catch (err) {
    if (attempt >= 5) throw err;
    const wait = 4000 * attempt;
    console.warn(`[build-park-geo] Overpass falló (${err.message.slice(0, 120)}), reintento ${attempt + 1} en ${wait}ms…`);
    await new Promise((r) => setTimeout(r, wait));
    return fetchOverpass(query, attempt + 1);
  }
}

// ---- Geometría ----

const round6 = (n) => Math.round(n * 1e6) / 1e6;

/** Proyección local equirrectangular (metros) centrada en el bbox, suficiente para áreas/tolerancias cortas. */
const lat0 = (BBOX.s + BBOX.n) / 2;
const mPerDegLat = 110540;
const mPerDegLng = 111320 * Math.cos((lat0 * Math.PI) / 180);
const toXY = ([lng, lat]) => [lng * mPerDegLng, lat * mPerDegLat];

function ringAreaM2(ring) {
  const pts = ring.map(toXY);
  let sum = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    sum += pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1];
  }
  return Math.abs(sum) / 2;
}

function polygonAreaM2(rings) {
  if (!rings.length) return 0;
  let area = ringAreaM2(rings[0]);
  for (let i = 1; i < rings.length; i++) area -= ringAreaM2(rings[i]);
  return Math.max(area, 0);
}

function perpendicularDistanceM(p, a, b) {
  const [px, py] = toXY(p);
  const [ax, ay] = toXY(a);
  const [bx, by] = toXY(b);
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  const t = ((px - ax) * dx + (py - ay) * dy) / len2;
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

/** Douglas-Peucker sobre coordenadas [lng,lat], tolerancia en metros. */
function simplifyRing(ring, toleranceM) {
  if (ring.length <= 4) return ring; // triángulo cerrado mínimo
  const dp = (points) => {
    if (points.length <= 2) return points;
    let maxDist = -1;
    let idx = 0;
    for (let i = 1; i < points.length - 1; i++) {
      const d = perpendicularDistanceM(points[i], points[0], points[points.length - 1]);
      if (d > maxDist) { maxDist = d; idx = i; }
    }
    if (maxDist > toleranceM) {
      const left = dp(points.slice(0, idx + 1));
      const right = dp(points.slice(idx));
      return [...left.slice(0, -1), ...right];
    }
    return [points[0], points[points.length - 1]];
  };
  const simplified = dp(ring);
  // Mantiene el anillo cerrado y con al menos 4 puntos (3 + cierre).
  if (simplified.length < 4) return ring;
  return simplified;
}

/** Encadena tramos de una relación multipolígono (por rol) en anillos cerrados. */
function chainMembersToRings(segments) {
  const remaining = segments.map((s) => s.slice());
  const rings = [];
  while (remaining.length) {
    let chain = remaining.shift();
    let closed = pointsEqual(chain[0], chain[chain.length - 1]);
    let guard = 0;
    while (!closed && remaining.length && guard++ < remaining.length + 5) {
      const tail = chain[chain.length - 1];
      let joined = false;
      for (let i = 0; i < remaining.length; i++) {
        const seg = remaining[i];
        if (pointsEqual(seg[0], tail)) { chain = chain.concat(seg.slice(1)); remaining.splice(i, 1); joined = true; break; }
        if (pointsEqual(seg[seg.length - 1], tail)) { chain = chain.concat(seg.slice(0, -1).reverse()); remaining.splice(i, 1); joined = true; break; }
      }
      if (!joined) break;
      closed = pointsEqual(chain[0], chain[chain.length - 1]);
    }
    if (!closed) chain = chain.concat([chain[0]]); // cierra a la fuerza (geometría rara pero rara vez ocurre)
    rings.push(chain);
  }
  return rings;
}

function pointsEqual(a, b) {
  return Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
}

function geomToLngLat(geom) {
  return geom.map((g) => [g.lon, g.lat]);
}

function wayToFeature(way) {
  if (!way.geometry || way.geometry.length < 4) return null;
  const ring = geomToLngLat(way.geometry);
  if (!pointsEqual(ring[0], ring[ring.length - 1])) ring.push(ring[0]);
  return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [ring] } };
}

function relationToFeature(rel) {
  const outer = [];
  const inner = [];
  for (const m of rel.members ?? []) {
    if (!m.geometry || m.geometry.length < 2) continue;
    const line = geomToLngLat(m.geometry);
    (m.role === 'inner' ? inner : outer).push(line);
  }
  const outerRings = chainMembersToRings(outer).filter((r) => r.length >= 4);
  if (!outerRings.length) return null;
  const innerRings = chainMembersToRings(inner).filter((r) => r.length >= 4);
  // Una relación puede tener varios outer (multipolígono real); cada uno se une con los
  // inner que caen dentro de su propio anillo (aproximación simple: todos los inner se
  // asignan al primer outer si solo hay uno, si no al que primero los contenga en bbox).
  if (outerRings.length === 1) {
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [outerRings[0], ...innerRings] },
    };
  }
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'MultiPolygon', coordinates: outerRings.map((r) => [r]) },
  };
}

function roundGeometry(geometry) {
  const roundRing = (ring) => ring.map(([lng, lat]) => [round6(lng), round6(lat)]);
  if (geometry.type === 'Polygon') return { ...geometry, coordinates: geometry.coordinates.map(roundRing) };
  if (geometry.type === 'MultiPolygon') return { ...geometry, coordinates: geometry.coordinates.map((poly) => poly.map(roundRing)) };
  return geometry;
}

function simplifyGeometry(geometry, toleranceM) {
  const simplifyRingKeepClosed = (ring) => {
    const s = simplifyRing(ring, toleranceM);
    return pointsEqual(s[0], s[s.length - 1]) ? s : [...s, s[0]];
  };
  if (geometry.type === 'Polygon') return { ...geometry, coordinates: geometry.coordinates.map(simplifyRingKeepClosed) };
  if (geometry.type === 'MultiPolygon') return { ...geometry, coordinates: geometry.coordinates.map((poly) => poly.map(simplifyRingKeepClosed)) };
  return geometry;
}

function geometryAreaM2(geometry) {
  if (geometry.type === 'Polygon') return polygonAreaM2(geometry.coordinates);
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.reduce((a, poly) => a + polygonAreaM2(poly), 0);
  return 0;
}

async function buildBuildings() {
  console.log('[build-park-geo] Consultando Overpass (edificios/ruinas del parque)…');
  const data = await fetchOverpass(QUERY);
  const elements = data.elements ?? [];
  console.log(`[build-park-geo] Overpass devolvió ${elements.length} elementos.`);

  let features = [];
  for (const el of elements) {
    const f = el.type === 'way' ? wayToFeature(el) : el.type === 'relation' ? relationToFeature(el) : null;
    if (f) features.push(f);
  }

  // Descarta polígonos minúsculos (ruido/errores de trazado).
  features = features.filter((f) => geometryAreaM2(f.geometry) >= MIN_AREA_M2);
  features = features.map((f) => ({ ...f, geometry: roundGeometry(f.geometry) }));

  let geojson = { type: 'FeatureCollection', features };
  let bytes = Buffer.byteLength(JSON.stringify(geojson));
  console.log(`[build-park-geo] ${features.length} polígonos, ${(bytes / 1024).toFixed(1)} KB antes de simplificar.`);

  let tolerance = SIMPLIFY_TOLERANCE_M;
  let pass = 0;
  while (bytes > MAX_BYTES && pass < 4) {
    pass++;
    features = features.map((f) => ({ ...f, geometry: roundGeometry(simplifyGeometry(f.geometry, tolerance)) }));
    geojson = { type: 'FeatureCollection', features };
    bytes = Buffer.byteLength(JSON.stringify(geojson));
    console.log(`[build-park-geo] Simplificado (tolerancia ${tolerance} m, pasada ${pass}): ${(bytes / 1024).toFixed(1)} KB.`);
    tolerance *= 2;
  }

  const outPath = join(outDir, 'park-buildings.json');
  writeFileSync(outPath, JSON.stringify(geojson));
  console.log(`[build-park-geo] Escrito ${outPath} (${(statSync(outPath).size / 1024).toFixed(1)} KB).`);
}

function buildStreets() {
  const nodes = streets.n.map(([la, ln]) => [ln / 1e6, la / 1e6]);
  const features = streets.e.map(([a, b]) => ({
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: [nodes[a], nodes[b]] },
  }));
  const geojson = { type: 'FeatureCollection', features };
  const outPath = join(outDir, 'park-streets.json');
  writeFileSync(outPath, JSON.stringify(geojson));
  console.log(`[build-park-geo] Escrito ${outPath} (${(statSync(outPath).size / 1024).toFixed(1)} KB, ${features.length} tramos).`);
}

buildStreets();
await buildBuildings();
