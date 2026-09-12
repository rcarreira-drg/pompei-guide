/**
 * Rumbo del dispositivo (brújula) compartido entre componentes: la brújula, el marcador del mapa…
 * Se activa con enable() tras un gesto del usuario (iOS pide permiso) y se recuerda en la sesión.
 */
import { useCallback, useEffect, useSyncExternalStore } from 'react';

export interface HeadingState { heading: number | null; on: boolean; supported: boolean; unsupported: boolean }
const KEY = 'pompei-guide:heading-on';
const norm360 = (d: number) => ((d % 360) + 360) % 360;
let state: HeadingState = { heading: null, on: false, supported: typeof window !== 'undefined' && 'DeviceOrientationEvent' in window, unsupported: false };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const getSnapshot = () => state;
const set = (patch: Partial<HeadingState>) => { state = { ...state, ...patch }; emit(); };

let attached = false, received = false, gotAbsolute = false, lastEmit = 0;
interface EvWebkit extends DeviceOrientationEvent { webkitCompassHeading?: number }
function onOrientation(e: Event) {
  const ev = e as EvWebkit;
  if (e.type === 'deviceorientation' && gotAbsolute) return;
  let h: number | null = null;
  if (typeof ev.webkitCompassHeading === 'number') h = ev.webkitCompassHeading;
  else if (ev.alpha != null) {
    if (e.type === 'deviceorientationabsolute' || ev.absolute) gotAbsolute = true;
    const screenAngle = window.screen?.orientation?.angle ?? 0;
    h = norm360(360 - ev.alpha + screenAngle);
  }
  if (h == null) return;
  received = true;
  const now = performance.now();
  if (now - lastEmit < 80 && state.heading != null && Math.abs(h - state.heading) < 2) return; // limita re-renders
  lastEmit = now;
  set({ heading: Math.round(h * 10) / 10, unsupported: false });
}
function attach() {
  if (attached) return;
  attached = true; received = false; gotAbsolute = false;
  window.addEventListener('deviceorientationabsolute', onOrientation);
  window.addEventListener('deviceorientation', onOrientation);
  set({ on: true, unsupported: false });
  try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
  window.setTimeout(() => { if (!received) set({ unsupported: true }); }, 2500);
}
export async function enableHeading(): Promise<void> {
  // Enganchamos primero (en Android los eventos llegan sin permiso explícito); el permiso es para iOS 13+,
  // donde requestPermission() abre un diálogo y la promesa no se resuelve hasta que el usuario contesta.
  attach();
  const ctor = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied' | 'prompt'> };
  if (ctor && typeof ctor.requestPermission === 'function') {
    try { const r = await ctor.requestPermission(); if (r === 'denied') disableHeading(); }
    catch { /* algunos navegadores lanzan si no hay gesto: mantenemos los listeners */ }
  }
}
export function disableHeading() {
  window.removeEventListener('deviceorientationabsolute', onOrientation);
  window.removeEventListener('deviceorientation', onOrientation);
  attached = false;
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  set({ heading: null, on: false, unsupported: false });
}
const wasOn = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };

export function useHeading() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  // Reactiva sin gesto solo en plataformas que no exigen permiso (Android); en iOS hará falta pulsar de nuevo.
  useEffect(() => {
    if (!s.on && !attached && wasOn()) {
      const ctor = window.DeviceOrientationEvent as unknown as { requestPermission?: unknown };
      if (!(ctor && typeof ctor.requestPermission === 'function')) attach();
    }
  }, [s.on]);
  const enable = useCallback(() => enableHeading(), []);
  const disable = useCallback(() => disableHeading(), []);
  return { ...s, enable, disable };
}
