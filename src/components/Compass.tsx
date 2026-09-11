/** Flecha que apunta a la siguiente parada; usa heading del dispositivo si está disponible. */
import { useCallback, useEffect, useState } from 'react';
import type { LatLng } from '@/lib/geo';
import { bearingDeg, compassLabel, distanceM, formatDistance } from '@/lib/geo';

interface DeviceOrientationEventWithWebkit extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

interface DeviceOrientationEventConstructorWithPermission {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

export interface CompassProps {
  target: LatLng;
  userPos?: LatLng | null;
  label?: string;
  compact?: boolean;
}

export default function Compass({ target, userPos, label = 'Siguiente parada', compact }: CompassProps) {
  const [heading, setHeading] = useState<number | null>(null);
  const [orientationOn, setOrientationOn] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'DeviceOrientationEvent' in window);
  }, []);

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    const ev = e as DeviceOrientationEventWithWebkit;
    if (typeof ev.webkitCompassHeading === 'number') {
      setHeading(ev.webkitCompassHeading);
    } else if (ev.alpha != null) {
      setHeading(360 - ev.alpha);
    }
  }, []);

  useEffect(() => {
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [handleOrientation]);

  const enableCompass = useCallback(async () => {
    const ctor = window.DeviceOrientationEvent as unknown as DeviceOrientationEventConstructorWithPermission;
    try {
      if (ctor && typeof ctor.requestPermission === 'function') {
        const result = await ctor.requestPermission();
        if (result === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setOrientationOn(true);
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
        setOrientationOn(true);
      }
    } catch {
      // permiso denegado o no soportado: se mantiene el modo rumbo cardinal
    }
  }, [handleOrientation]);

  const bearing = userPos ? bearingDeg(userPos, target) : null;
  const distance = userPos ? distanceM(userPos, target) : null;
  const rotation = bearing == null ? 0 : heading != null ? bearing - heading : bearing;

  return (
    <div className={`compass ${compact ? 'compass--compact' : ''}`}>
      <div className="compass-dial" aria-hidden="true">
        <span className="compass-arrow" style={{ transform: `rotate(${rotation}deg)` }} />
      </div>
      <div className="compass-info">
        <p className="kicker">{label}</p>
        {bearing != null && distance != null ? (
          <p className="compass-reading mono">
            {compassLabel(bearing)} · {formatDistance(distance)}
          </p>
        ) : (
          <p className="compass-reading mono">Activa la ubicación para ver rumbo y distancia</p>
        )}
        {supported && !orientationOn && (
          <button type="button" className="btn btn-sm" onClick={enableCompass} aria-label="Activar brújula del dispositivo">
            ACTIVAR BRÚJULA
          </button>
        )}
      </div>
    </div>
  );
}
