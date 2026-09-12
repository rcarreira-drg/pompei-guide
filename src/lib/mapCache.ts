/** Descarga las teselas vectoriales de OpenFreeMap del parque (zoom 12-14, el máximo
 *  del TileJSON de "planet"), más el propio TileJSON y los glifos usados, a la caché
 *  que usa el service worker ('ofm-tiles'). */
import { PARK_BOUNDS } from './geo';
import { OFM_TILEJSON_URL } from './mapStyle';

const CACHE = 'ofm-tiles';
const ZOOMS = [12, 13, 14];
/** Rango 0-255 de "Noto Sans Regular": suficiente para los rótulos (opcionales) que dibuja la app. */
const GLYPH_URLS = ['https://tiles.openfreemap.org/fonts/Noto%20Sans%20Regular/0-255.pbf'];

function tileXY(lat: number, lng: number, z: number) {
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latR = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2) * n);
  return { x, y };
}

let tileTemplate: string | null = null;

/** Obtiene la plantilla de URL de teselas (p.ej. ".../{z}/{x}/{y}.pbf") a partir del TileJSON. */
async function getTileTemplate(): Promise<string> {
  if (tileTemplate) return tileTemplate;
  const res = await fetch(OFM_TILEJSON_URL);
  if (!res.ok) throw new Error('No se pudo leer el TileJSON de OpenFreeMap');
  const json = (await res.json()) as { tiles?: string[] };
  const tpl = json.tiles?.[0];
  if (!tpl) throw new Error('El TileJSON no trae plantilla de teselas');
  tileTemplate = tpl;
  return tpl;
}

/** URLs de las teselas .pbf del parque para los zooms 12-14 (requiere red para leer el TileJSON). */
export async function parkTileUrls(zooms: number[] = ZOOMS): Promise<string[]> {
  const tpl = await getTileTemplate();
  const [[s, w], [n, e]] = PARK_BOUNDS;
  const urls: string[] = [];
  for (const z of zooms) {
    const a = tileXY(n, w, z);
    const b = tileXY(s, e, z);
    for (let x = a.x; x <= b.x; x++) {
      for (let y = a.y; y <= b.y; y++) {
        urls.push(tpl.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y)));
      }
    }
  }
  return urls;
}

/** Todas las URLs que forman el "mapa sin conexión": TileJSON, teselas y glifos. */
export async function allMapUrls(): Promise<string[]> {
  const tiles = await parkTileUrls();
  return [OFM_TILEJSON_URL, ...tiles, ...GLYPH_URLS];
}

export async function cachedTileCount(urls: string[]): Promise<number> {
  if (!('caches' in window)) return 0;
  const c = await caches.open(CACHE);
  let n = 0;
  for (const u of urls) if (await c.match(u, { ignoreSearch: true })) n++;
  return n;
}

export async function downloadParkTiles(onProgress: (done: number, total: number) => void, signal?: AbortSignal): Promise<void> {
  if (!('caches' in window)) throw new Error('Cache Storage no disponible');
  const c = await caches.open(CACHE);
  const urls = await allMapUrls();
  let done = 0;
  const queue = [...urls];
  const worker = async () => {
    while (queue.length) {
      if (signal?.aborted) return;
      const u = queue.shift()!;
      if (!(await c.match(u))) {
        try {
          const r = await fetch(u, { signal, mode: 'cors' });
          if (r.ok) await c.put(u, r);
        } catch {
          /* tesela fallida: seguimos */
        }
      }
      done++;
      onProgress(done, urls.length);
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]); // 4 en paralelo: teselas vectoriales muy ligeras
}

export async function clearTileCache() {
  if ('caches' in window) await caches.delete(CACHE);
}
