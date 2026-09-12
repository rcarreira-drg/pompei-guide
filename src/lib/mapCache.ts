/** Descarga las teselas OSM del parque (zoom 15-18) a la caché que usa el service worker ('osm-tiles'). */
import { PARK_BOUNDS } from './geo';
const CACHE = 'osm-tiles';
const SUBS = ['a', 'b', 'c'];
function tileXY(lat: number, lng: number, z: number) {
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latR = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2) * n);
  return { x, y };
}
export function parkTileUrls(zooms = [15, 16, 17, 18]): string[] {
  const [[s, w], [n, e]] = PARK_BOUNDS;
  const urls: string[] = []; let k = 0;
  for (const z of zooms) {
    const a = tileXY(n, w, z), b = tileXY(s, e, z);
    for (let x = a.x; x <= b.x; x++) for (let y = a.y; y <= b.y; y++) urls.push(`https://${SUBS[k++ % 3]}.tile.openstreetmap.org/${z}/${x}/${y}.png`);
  }
  return urls;
}
export async function cachedTileCount(urls: string[]): Promise<number> {
  if (!('caches' in window)) return 0;
  const c = await caches.open(CACHE);
  let n = 0; for (const u of urls) if (await c.match(u, { ignoreSearch: true })) n++;
  return n;
}
export async function downloadParkTiles(onProgress: (done: number, total: number) => void, signal?: AbortSignal): Promise<void> {
  if (!('caches' in window)) throw new Error('Cache Storage no disponible');
  const c = await caches.open(CACHE);
  const urls = parkTileUrls();
  let done = 0; const queue = [...urls];
  const worker = async () => {
    while (queue.length) {
      if (signal?.aborted) return;
      const u = queue.shift()!;
      if (!(await c.match(u))) {
        try { const r = await fetch(u, { signal, mode: 'cors' }); if (r.ok) await c.put(u, r); } catch { /* tesela fallida: seguimos */ }
      }
      done++; onProgress(done, urls.length);
    }
  };
  await Promise.all([worker(), worker()]); // 2 en paralelo: respeta la política de uso de los servidores OSM
}
export async function clearTileCache() { if ('caches' in window) await caches.delete(CACHE); }
