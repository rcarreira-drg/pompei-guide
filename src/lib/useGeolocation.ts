/**
 * Geolocalización compartida entre páginas (store a nivel de módulo).
 * El seguimiento arranca con enable() tras un gesto del usuario; la elección se recuerda
 * (localStorage) y se reactiva al abrir la app hasta que el usuario pulse DETENER. Activar el GPS activa también la brújula.
 */
import { useCallback, useEffect, useSyncExternalStore } from 'react';
import type { LatLng } from './geo';
import { enableHeading, disableHeading } from './useHeading';

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
  try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
  watchId = navigator.geolocation.watchPosition(
    (p) => set({ pos: [p.coords.latitude, p.coords.longitude], accuracy: p.coords.accuracy, error: null, enabled: true }),
    (err) => set({ error: err.code === 1 ? 'Permiso de ubicación denegado. Actívalo en los ajustes del navegador.' : (err.message || 'No se pudo obtener tu ubicación.') }),
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
  );
  // El GPS arrastra la brújula (pero apagar la brújula no apaga el GPS; apagar el GPS sí apaga la brújula)
  void enableHeading();
}
function stopWatch() {
  if (watchId != null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
  watchId = null;
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  disableHeading();
  state = { pos: null, accuracy: null, error: null, enabled: false }; emit();
}
const wasEnabled = () => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } };

export function useGeolocation(): UseGeolocation {
  const s = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  // Reactiva automáticamente si el usuario ya lo activó en esta sesión (el permiso ya está concedido).
  useEffect(() => { if (!s.enabled && watchId == null && wasEnabled()) startWatch(); }, [s.enabled]);
  const enable = useCallback(() => startWatch(), []);
  const disable = useCallback(() => stopWatch(), []);
  return { ...s, enable, disable };
}
