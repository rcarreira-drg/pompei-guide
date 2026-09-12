/**
 * Detección de llegada a una parada: radio de aviso y desambiguación cuando hay
 * varias paradas cercanas (elige la que toca según el orden de la ruta, no la
 * primera que aparezca en el array).
 */
import { useCallback, useSyncExternalStore } from 'react';
import { distanceM, type LatLng } from './geo';

export const ARRIVAL_RADIUS_M = 40;

/**
 * Candidatas = no visitadas dentro del radio. Si `currentStop` es una de ellas, se
 * elige esa; si no, la de menor índice en `stops` (es decir, la que toca antes según
 * el orden de la ruta).
 */
export function stopAtPosition<T extends { id: string; coords: LatLng }>(
  pos: LatLng | null,
  stops: T[],
  visited: Record<string, unknown>,
  currentStop?: string,
  radius = ARRIVAL_RADIUS_M
): T | undefined {
  if (!pos) return undefined;
  const candidates = stops.filter((s) => !visited[s.id] && distanceM(pos, s.coords) < radius);
  if (candidates.length === 0) return undefined;
  if (currentStop) {
    const cur = candidates.find((s) => s.id === currentStop);
    if (cur) return cur;
  }
  return candidates[0];
}

/** Vibra en llegada (patrón corto); silenciosamente ignorado si no está soportado. */
export function vibrateArrival(): void {
  try { navigator.vibrate?.([200, 100, 200]); } catch { /* ignore */ }
}

/** Última parada anunciada en esta sesión, para no vibrar/narrar dos veces por la misma. */
const KEY = 'pompei-guide:arrived';
let announcedStopId: string | undefined = (() => {
  try { return sessionStorage.getItem(KEY) ?? undefined; } catch { return undefined; }
})();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const getSnapshot = () => announcedStopId;

export function setAnnouncedStop(id: string | undefined): void {
  announcedStopId = id;
  try {
    if (id) sessionStorage.setItem(KEY, id);
    else sessionStorage.removeItem(KEY);
  } catch { /* ignore */ }
  emit();
}

export function useAnnouncedStop(): { announcedStopId: string | undefined; setAnnouncedStop: (id: string | undefined) => void } {
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const set = useCallback((id: string | undefined) => setAnnouncedStop(id), []);
  return { announcedStopId: value, setAnnouncedStop: set };
}
