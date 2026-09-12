// Extrae la red viaria peatonal del parque (Overpass/OSM), se queda con la componente conectada
// de la entrada y la guarda compacta en src/content/streets.json para enrutar en el cliente.
import { writeFileSync } from 'node:fs';
const bbox = '40.7440,14.4740,40.7570,14.5000';
const q = `[out:json][timeout:60];(way["highway"](${bbox});)->.w;(.w;>;);out body;`;
const r = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'User-Agent': 'pompei-guide/1.0 (educational)' } });
const j = await r.json();
const nodes = new Map(), adj = new Map();
for (const el of j.elements) if (el.type === 'node') nodes.set(el.id, [el.lat, el.lon]);
const R = 6371000, rad = d => d * Math.PI / 180;
const dist = (a, b) => { const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]); const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
const edges = new Set();
for (const el of j.elements) if (el.type === 'way' && el.tags?.highway && !/motorway|trunk|primary|secondary|tertiary|motorway_link|trunk_link/.test(el.tags.highway)) {
  for (let i = 0; i < el.nodes.length - 1; i++) {
    const a = el.nodes[i], b = el.nodes[i + 1]; if (!nodes.has(a) || !nodes.has(b)) continue;
    (adj.get(a) ?? adj.set(a, new Set()).get(a)).add(b); (adj.get(b) ?? adj.set(b, new Set()).get(b)).add(a);
    edges.add(a < b ? `${a}-${b}` : `${b}-${a}`);
  }
}
// componente de Porta Marina
const start = [40.748509, 14.483085];
let s0, bd = 1e9; for (const [id, c] of nodes) if (adj.has(id)) { const d = dist(start, c); if (d < bd) { bd = d; s0 = id; } }
const comp = new Set([s0]); const st = [s0];
while (st.length) { const u = st.pop(); for (const v of adj.get(u) ?? []) if (!comp.has(v)) { comp.add(v); st.push(v); } }
// simplificación: eliminar nodos de grado 2 muy próximos entre sí no es necesario; guardamos compacto
const ids = [...comp]; const index = new Map(ids.map((id, i) => [id, i]));
const N = ids.map(id => { const [lat, lng] = nodes.get(id); return [Math.round(lat * 1e6), Math.round(lng * 1e6)]; });
const E = [];
for (const e of edges) { const [a, b] = e.split('-').map(Number); if (comp.has(a) && comp.has(b)) E.push([index.get(a), index.get(b)]); }
const out = { n: N, e: E };
writeFileSync('src/content/streets.json', JSON.stringify(out));
console.log('nodos', N.length, 'aristas', E.length, 'bytes', JSON.stringify(out).length);
