/** Mantiene la pantalla encendida durante el recorrido (Screen Wake Lock API). */
let sentinel: WakeLockSentinel | null = null;
export const wakeLockSupported = () => typeof navigator !== 'undefined' && 'wakeLock' in navigator;
export async function requestWakeLock(): Promise<boolean> {
  if (!wakeLockSupported()) return false;
  try {
    sentinel = await navigator.wakeLock.request('screen');
    sentinel.addEventListener('release', () => { sentinel = null; });
    return true;
  } catch { return false; }
}
export async function releaseWakeLock() { try { await sentinel?.release(); } catch { /* ignore */ } sentinel = null; }
export const wakeLockActive = () => sentinel !== null;
