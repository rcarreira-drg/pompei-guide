/**
 * Hook de geolocalización en tiempo real. El seguimiento solo arranca cuando
 * el usuario llama a enable() (acción explícita), nunca automáticamente.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LatLng } from './geo';

export interface GeoState {
  pos: LatLng | null;
  accuracy: number | null;
  error: string | null;
  enabled: boolean;
}

export interface UseGeolocation extends GeoState {
  enable: () => void;
  disable: () => void;
}

export function useGeolocation(): UseGeolocation {
  const [state, setState] = useState<GeoState>({ pos: null, accuracy: null, error: null, enabled: false });
  const watchId = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (watchId.current != null && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const enable = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setState((s) => ({ ...s, error: 'Este dispositivo no permite geolocalización.', enabled: false }));
      return;
    }
    setState((s) => ({ ...s, enabled: true, error: null }));
    watchId.current = navigator.geolocation.watchPosition(
      (p) => {
        setState({
          pos: [p.coords.latitude, p.coords.longitude],
          accuracy: p.coords.accuracy,
          error: null,
          enabled: true,
        });
      },
      (err) => {
        setState((s) => ({ ...s, error: err.message || 'No se pudo obtener tu ubicación.' }));
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
  }, []);

  const disable = useCallback(() => {
    clear();
    setState({ pos: null, accuracy: null, error: null, enabled: false });
  }, [clear]);

  useEffect(() => clear, [clear]);

  return { ...state, enable, disable };
}
