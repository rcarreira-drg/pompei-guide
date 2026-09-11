/** Botón para mantener la pantalla encendida durante la visita (Screen Wake Lock API). */
import { useEffect, useRef, useState } from 'react';
import { requestWakeLock, releaseWakeLock, wakeLockSupported } from '@/lib/wakeLock';

export default function WakeLockToggle() {
  const supported = useRef(wakeLockSupported()).current;
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!supported) return;
    async function handleVisibility() {
      if (document.visibilityState === 'visible' && onRef.current) {
        await requestWakeLock();
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      releaseWakeLock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported]);

  const onRef = useRef(on);
  onRef.current = on;

  async function toggle() {
    if (on) {
      await releaseWakeLock();
      setOn(false);
    } else {
      const ok = await requestWakeLock();
      setOn(ok);
    }
  }

  if (!supported) {
    return <p className="mono wakelock-unsupported">Tu navegador no permite bloquear la pantalla.</p>;
  }

  return (
    <button type="button" className={`btn btn-block wakelock-btn${on ? ' btn-ochre' : ''}`} onClick={toggle} aria-pressed={on}>
      PANTALLA SIEMPRE ENCENDIDA: {on ? 'ON' : 'OFF'}
    </button>
  );
}
