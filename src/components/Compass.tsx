/**
 * Brújula hacia la siguiente parada: dial giratorio (orientado al norte real
 * cuando hay heading del dispositivo) + flecha roja hacia el objetivo.
 * Sin userPos: dial apagado. Con userPos sin heading: "modo mapa" (rumbo fijo
 * respecto al norte). Con heading: la flecha gira con el móvil.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LatLng } from '@/lib/geo';
import { bearingDeg, compassLabel, distanceM, formatDistance, walkMinutes } from '@/lib/geo';

interface DeviceOrientationEventWithWebkit extends Event {
  webkitCompassHeading?: number;
  alpha?: number | null;
  absolute?: boolean;
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

/** Nombre completo del rumbo cardinal, para el aria-label. */
const CARDINAL_FULL: Record<string, string> = {
  N: 'norte',
  NE: 'noreste',
  E: 'este',
  SE: 'sureste',
  S: 'sur',
  SO: 'suroeste',
  O: 'oeste',
  NO: 'noroeste',
};

const norm360 = (deg: number) => ((deg % 360) + 360) % 360;

/** Diferencia angular más corta de a → b, en el rango (-180, 180]. */
function shortestDiff(a: number, b: number): number {
  const d = norm360(b - a + 180) - 180;
  return d <= -180 ? d + 360 : d;
}

/**
 * Ángulo animable sin saltos bruscos: en vez de saltar al valor módulo 360,
 * acumula la diferencia más corta para que la rotación en pantalla nunca dé
 * una vuelta larga al cruzar 0°/360°.
 */
function useSmoothAngle(target: number | null): number {
  const [angle, setAngle] = useState(0);
  const accRef = useRef(0);
  const initedRef = useRef(false);

  useEffect(() => {
    if (target == null) return;
    if (!initedRef.current) {
      initedRef.current = true;
      accRef.current = target;
      setAngle(target);
      return;
    }
    const delta = shortestDiff(norm360(accRef.current), norm360(target));
    accRef.current += delta;
    setAngle(accRef.current);
  }, [target]);

  return angle;
}

const VB = 200;
const CENTER = VB / 2;
const TICKS_DEG = Array.from({ length: 72 }, (_, i) => i * 5);
const CARDINALS: { deg: number; letter: string }[] = [
  { deg: 0, letter: 'N' },
  { deg: 90, letter: 'E' },
  { deg: 180, letter: 'S' },
  { deg: 270, letter: 'O' },
];

function polar(deg: number, r: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [CENTER + r * Math.sin(rad), CENTER - r * Math.cos(rad)];
}

export default function Compass({ target, userPos, label = 'Siguiente parada', compact }: CompassProps) {
  const [heading, setHeading] = useState<number | null>(null);
  const [orientationOn, setOrientationOn] = useState(false);
  const [supported, setSupported] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const receivedRef = useRef(false);
  const gotAbsoluteRef = useRef(false);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'DeviceOrientationEvent' in window);
  }, []);

  const handleOrientation = useCallback((e: Event) => {
    const ev = e as DeviceOrientationEventWithWebkit;
    if (e.type === 'deviceorientation' && gotAbsoluteRef.current) return; // preferimos el evento absoluto si llega
    let h: number | null = null;
    if (typeof ev.webkitCompassHeading === 'number') {
      h = ev.webkitCompassHeading; // iOS Safari
    } else if (ev.alpha != null) {
      if (e.type === 'deviceorientationabsolute' || ev.absolute) gotAbsoluteRef.current = true;
      const screenAngle =
        typeof window !== 'undefined' && window.screen && window.screen.orientation ? window.screen.orientation.angle : 0;
      h = norm360(360 - ev.alpha + screenAngle);
    }
    if (h != null) {
      receivedRef.current = true;
      setUnsupported(false);
      setHeading(h);
    }
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  const enableCompass = useCallback(async () => {
    const attach = () => {
      receivedRef.current = false;
      gotAbsoluteRef.current = false;
      window.addEventListener('deviceorientationabsolute', handleOrientation);
      window.addEventListener('deviceorientation', handleOrientation);
      setOrientationOn(true);
      setUnsupported(false);
      window.setTimeout(() => {
        if (!receivedRef.current) setUnsupported(true);
      }, 2000);
    };
    const ctor = window.DeviceOrientationEvent as unknown as DeviceOrientationEventConstructorWithPermission;
    try {
      if (ctor && typeof ctor.requestPermission === 'function') {
        const result = await ctor.requestPermission();
        if (result === 'granted') attach();
      } else {
        attach();
      }
    } catch {
      // permiso denegado o no soportado: se mantiene el modo mapa
    }
  }, [handleOrientation]);

  const active = !!userPos;
  const bearing = userPos ? bearingDeg(userPos, target) : null;
  const distance = userPos ? distanceM(userPos, target) : null;
  const hasHeading = heading != null;

  const dialTarget = hasHeading ? norm360(-(heading as number)) : 0;
  const arrowTarget = bearing == null ? null : hasHeading ? norm360(bearing - (heading as number)) : norm360(bearing);
  const dialAngle = useSmoothAngle(dialTarget);
  const arrowAngle = useSmoothAngle(arrowTarget);

  const diff = hasHeading && bearing != null ? shortestDiff(heading as number, bearing) : null;
  const hint = diff == null ? null : Math.abs(diff) < 15 ? '¡RECTO!' : diff > 0 ? 'GIRA A LA DERECHA' : 'GIRA A LA IZQUIERDA';

  let helpText: string;
  if (!active) {
    helpText = 'Activa la ubicación (botón arriba) para ver hacia dónde caminar.';
  } else if (hasHeading) {
    helpText = 'Gira sobre ti mismo hasta que la flecha apunte hacia arriba y camina.';
  } else if (!supported || unsupported) {
    helpText = 'Tu dispositivo no ofrece brújula; usa el modo mapa: la flecha indica la dirección respecto al norte.';
  } else if (orientationOn) {
    helpText = 'Buscando señal de la brújula…';
  } else {
    helpText = 'Modo mapa: la flecha indica la dirección respecto al norte. Pulsa ACTIVAR BRÚJULA para que gire con tu móvil.';
  }

  const showButton = active && !hasHeading && supported && !unsupported && !orientationOn;

  const ariaLabel =
    bearing != null && distance != null
      ? `${label} a ${formatDistance(distance)} hacia el ${CARDINAL_FULL[compassLabel(bearing)]}`
      : `Brújula hacia ${label}: activa la ubicación para ver la dirección`;

  const dialBg = active ? 'var(--white)' : 'var(--paper-2)';
  const tickColor = active ? 'var(--ink)' : 'var(--ash-light)';
  const arrowColor = active ? 'var(--pompeian)' : 'var(--ash-light)';
  const size = compact ? 120 : 200;

  return (
    <div className={`compass ${compact ? 'compass--compact' : ''}`}>
      <p className="kicker compass-title">HACIA: {label.toUpperCase()}</p>
      <div className="compass-body">
        <svg
          className="compass-dial-svg"
          width={size}
          height={size}
          viewBox={`0 0 ${VB} ${VB}`}
          role="img"
          aria-label={ariaLabel}
        >
          <circle cx={CENTER} cy={CENTER} r={92} fill={dialBg} stroke="var(--ink)" strokeWidth={6} />
          <g className="compass-rotatable" transform={`rotate(${dialAngle} ${CENTER} ${CENTER})`}>
            {TICKS_DEG.map((deg) => {
              const major = deg % 45 === 0;
              const [x1, y1] = polar(deg, 88);
              const [x2, y2] = polar(deg, major ? 66 : 78);
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={tickColor}
                  strokeWidth={major ? 3 : 1.5}
                  strokeLinecap="square"
                />
              );
            })}
            {CARDINALS.map(({ deg, letter }) => {
              const [x, y] = polar(deg, 52);
              return (
                <text
                  key={letter}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontWeight={700}
                  fontSize={22}
                  fill={active && letter === 'N' ? 'var(--pompeian)' : tickColor}
                >
                  {letter}
                </text>
              );
            })}
          </g>
          <g className="compass-rotatable" transform={`rotate(${arrowAngle ?? 0} ${CENTER} ${CENTER})`}>
            <polygon points="100,24 84,64 116,64" fill={arrowColor} stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
            <rect x={93} y={64} width={14} height={72} fill={arrowColor} stroke="var(--ink)" strokeWidth={2} />
          </g>
          <circle cx={CENTER} cy={CENTER} r={9} fill="var(--ink)" />
        </svg>
        <div className="compass-info">
          {bearing != null && distance != null && (
            <p className="compass-reading mono">
              {formatDistance(distance)} · {compassLabel(bearing)} · ~{walkMinutes(distance)} min a pie
            </p>
          )}
          <p className="compass-help" aria-live="polite">
            {helpText}
          </p>
          {hint && (
            <span
              className={`compass-hint ${hint === '¡RECTO!' ? 'compass-hint--ok' : 'compass-hint--turn'}`}
              aria-live="polite"
            >
              {hint}
            </span>
          )}
          {showButton && (
            <button type="button" className="btn btn-sm" onClick={enableCompass} aria-label="Activar brújula del dispositivo">
              ACTIVAR BRÚJULA
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
