// Polilínea peatonal real: red viaria del parque desde Overpass (OSM) + Dijkstra entre paradas.
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync('src/content/route.ts', 'utf8');
const stops = [...src.matchAll(/id:\s*'([a-z0-9-]+)'[\s\S]*?coords:\s*\[\s*([\d.]+)\s*,\s*([\d.]+)\s*\]/g)]
  .map(m => ({ id: m[1], lat: +m[2], lng: +m[3] }));
const bbox = '40.7440,14.4740,40.7570,14.5000';
const q = `[out:json][timeout:60];(way["highway"](${bbox});)->.w;(.w;>;);out body;`;
const r = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'User-Agent': 'pompei-guide/1.0 (educational)' } });
const j = await r.json();
const nodes = new Map(), adj = new Map();
for (const el of j.elements) if (el.type === 'node') nodes.set(el.id, [el.lat, el.lon]);
const R = 6371000, rad = d => d * Math.PI / 180;
const dist = (a, b) => { const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]); const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
let ways = 0;
for (const el of j.elements) if (el.type === 'way' && el.tags?.highway && !/motorway|trunk|primary/.test(el.tags.highway)) {
  ways++;
  for (let i = 0; i < el.nodes.length - 1; i++) {
    const a = el.nodes[i], b = el.nodes[i + 1]; if (!nodes.has(a) || !nodes.has(b)) continue;
    const d = dist(nodes.get(a), nodes.get(b));
    (adj.get(a) ?? adj.set(a, []).get(a)).push([b, d]);
    (adj.get(b) ?? adj.set(b, []).get(b)).push([a, d]);
  }
}
console.log('ways', ways, 'nodes', nodes.size);
// componente conectada del nodo más cercano a la entrada
function component(s) { const seen = new Set([s]); const st = [s]; while (st.length) { const u = st.pop(); for (const [v] of adj.get(u) ?? []) if (!seen.has(v)) { seen.add(v); st.push(v); } } return seen; }
let comp = null;
const nearest = p => { let best, bd = 1e9; for (const [id, c] of nodes) if (adj.has(id) && (!comp || comp.has(id))) { const d = dist(p, c); if (d < bd) { bd = d; best = id; } } return [best, bd]; };
function dijkstra(s, t) {
  const D = new Map([[s, 0]]), P = new Map(), Q = new Set([s]);
  while (Q.size) {
    let u, du = 1e18; for (const n of Q) if (D.get(n) < du) { du = D.get(n); u = n; }
    Q.delete(u); if (u === t) break;
    for (const [v, w] of adj.get(u) ?? []) { const nd = du + w; if (nd < (D.get(v) ?? 1e18)) { D.set(v, nd); P.set(v, u); Q.add(v); } }
  }
  if (!D.has(t)) return null;
  const path = [t]; while (path[0] !== s) path.unshift(P.get(path[0])); return { path, d: D.get(t) };
}
const main = stops.filter(s => s.id !== 'villa-misterios');
comp = component(nearest([main[0].lat, main[0].lng])[0]); console.log('componente', comp.size);
const out = []; const legs = []; let total = 0;
for (let i = 0; i < main.length - 1; i++) {
  const a = main[i], b = main[i + 1];
  const [na, da] = nearest([a.lat, a.lng]), [nb, db] = nearest([b.lat, b.lng]);
  const res = dijkstra(na, nb);
  const pts = [[a.lat, a.lng], ...(res ? res.path.map(n => nodes.get(n)) : []), [b.lat, b.lng]];
  const d = res ? res.d + da + db : dist([a.lat, a.lng], [b.lat, b.lng]);
  legs.push({ from: a.id, to: b.id, m: Math.round(d), snapA: Math.round(da), snapB: Math.round(db), ok: !!res });
  total += d;
  out.push(...(i ? pts.slice(1) : pts));
}
console.table(legs); console.log('puntos', out.length, 'total m', Math.round(total));
const round = n => Math.round(n * 1e6) / 1e6;
const pathStr = '[\n' + out.map(p => `    [${round(p[0])}, ${round(p[1])}]`).join(',\n') + '\n  ]';
const res = src.replace(/path:\s*\[[\s\S]*?\n\s*\]\s*(,?)\s*\n(\s*)\}\s*;?\s*$/m, (m, comma, ind) => `path: ${pathStr}${comma}\n${ind}};`);
if (res === src) { console.error('no se pudo sustituir path'); process.exit(1); }
writeFileSync('src/content/route.ts', res);
writeFileSync('scripts/path-legs.json', JSON.stringify(legs, null, 2));
