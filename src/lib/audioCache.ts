/** Descarga toda la narración pregrabada a la Cache Storage para usarla sin conexión. */
import { AUDIO, audioUrl } from '@/content/audio';
import { EXTRA_IDS } from './modes';
export const AUDIO_CACHE = 'pompei-audio-v1';
export function allAudioFiles(): string[] { return Object.values(AUDIO).map(a => audioUrl(a.file)); }
/** Pistas necesarias para un modo: completa = paradas sin sufijo + presentación; exprés = pistas ':express' + presentación. */
export type AudioMode = 'completa' | 'express' | 'total';
function keysForMode(mode: AudioMode): string[] {
  return Object.keys(AUDIO).filter((k) => {
    if (mode === 'express') return k.endsWith(':express') || k === 'route:express';
    if (mode === 'total') return !k.includes(':') || k === 'route:completa'; // clásicas + extras (sin sufijo) + presentación
    return (!k.includes(':') && !EXTRA_IDS.has(k)) || k === 'route:completa';
  });
}
export function audioFilesForMode(mode: AudioMode): string[] { return keysForMode(mode).map((k) => audioUrl(AUDIO[k].file)); }
export function audioMegabytesForMode(mode: AudioMode): number {
  const secs = keysForMode(mode).reduce((s, k) => s + AUDIO[k].total, 0);
  return Math.round(secs * 6 / 1024); // ~6 KB/s a 48 kbps
}
export function totalAudioMinutes(): number { return Math.round(Object.values(AUDIO).reduce((s, a) => s + a.total, 0) / 60); }
export async function cachedAudioCount(files: string[] = allAudioFiles()): Promise<number> {
  if (!('caches' in window)) return 0;
  const c = await caches.open(AUDIO_CACHE);
  let n = 0; for (const f of files) if (await c.match(f)) n++;
  return n;
}
export async function downloadAllAudio(onProgress: (done: number, total: number) => void, signal?: AbortSignal, files: string[] = allAudioFiles()): Promise<void> {
  if (!('caches' in window)) throw new Error('Cache Storage no disponible');
  const c = await caches.open(AUDIO_CACHE);
  let done = 0;
  const queue = [...files];
  const worker = async () => {
    while (queue.length) {
      if (signal?.aborted) return;
      const f = queue.shift()!;
      if (!(await c.match(f))) { const res = await fetch(f, { signal }); if (res.ok) await c.put(f, res); }
      done++; onProgress(done, files.length);
    }
  };
  await Promise.all([worker(), worker(), worker()]);
}
export async function clearAudioCache() { if ('caches' in window) await caches.delete(AUDIO_CACHE); }
