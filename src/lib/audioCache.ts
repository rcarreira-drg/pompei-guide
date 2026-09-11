/** Descarga toda la narración pregrabada a la Cache Storage para usarla sin conexión. */
import { AUDIO, audioUrl } from '@/content/audio';
export const AUDIO_CACHE = 'pompei-audio-v1';
export function allAudioFiles(): string[] { return Object.values(AUDIO).flatMap(a => a.files).map(audioUrl); }
export async function cachedAudioCount(): Promise<number> {
  if (!('caches' in window)) return 0;
  const c = await caches.open(AUDIO_CACHE);
  const keys = await c.keys();
  return keys.length;
}
export async function downloadAllAudio(onProgress: (done: number, total: number) => void, signal?: AbortSignal): Promise<void> {
  if (!('caches' in window)) throw new Error('Cache Storage no disponible');
  const c = await caches.open(AUDIO_CACHE);
  const files = allAudioFiles();
  let done = 0;
  const queue = [...files];
  const worker = async () => {
    while (queue.length) {
      if (signal?.aborted) return;
      const f = queue.shift()!;
      if (!(await c.match(f))) {
        const res = await fetch(f, { signal });
        if (res.ok) await c.put(f, res);
      }
      done++; onProgress(done, files.length);
    }
  };
  await Promise.all([worker(), worker(), worker()]);
}
export async function clearAudioCache() { if ('caches' in window) await caches.delete(AUDIO_CACHE); }
