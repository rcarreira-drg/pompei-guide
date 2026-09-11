/**
 * Geolocalización compartida entre páginas (store a nivel de módulo).
 * El seguimiento arranca con enable() tras un gesto del usuario; la elección se recuerda
 * (sessionStorage) para reactivarlo al navegar entre pantallas sin volver a pedirlo.
 */
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type { LatLng } from './geo';

export interface GeoState { pos: LatLng | null; accuracy: number | null; error: string | null; enabled: boolean }
export interface UseGeolocation extends GeoState { enable: () => void; disable: () => void }

const KEY = 'pompei-guide:geo-enabled';
let state: GeoState = { pos: null, accuracy: null, error: null, enabled: false };
let watchId: number | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
const getSnapshot = () => state;
const set = (patch: Partial<GeoState>) => { state = { ...state, ...patch }; emit(); };

function startWatch() {
  if (watchId != null) return;
  if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
    set({ error: 'Este dispositivo no permite geolocalización.', enabled: false }); return;
  }
  set({ enabled: true, error: null });
  try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
  watchId = navigator.geolocation.watchPosition(
    (p) => set({ pos: [p.coords.latitude, p.coords.longitude], accuracy: p.coords.accuracy, error: null, enabled: true }),
    (err) => set({ error: err.code === 1 ? 'Permiso de ubicación denegado. Actívalo en los ajustes del navegador.' : (err.message || 'No se pudo obtener tu ubicación.') }),
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
  );
}
function stopWatch() {
  if (watchId != null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
  watchId = null;
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
  state = { pos: null, accuracy: null, error: null, enabled: false }; emit();
}
const wasEnabled = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };

export function useGeolocation(): UseGeolocation {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  // Reactiva automáticamente si el usuario ya lo activó en esta sesión (el permiso ya está concedido).
  useEffect(() => { if (!s.enabled && watchId == null && wasEnabled()) startWatch(); }, [s.enabled]);
  const enable = useCallback(() => startWatch(), []);
  const disable = useCallback(() => stopWatch(), []);
  return { ...s, enable, disable };
}
