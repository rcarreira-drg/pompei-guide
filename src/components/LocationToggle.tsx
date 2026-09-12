/** Activar / detener el seguimiento de ubicación en tiempo real, con estado visible. */
import { useGeolocation } from '@/lib/useGeolocation';

export default function LocationToggle({ label = 'ACTIVAR UBICACIÓN' }: { label?: string }) {
  const { enabled, enable, disable, accuracy, pos, error } = useGeolocation();
  if (!enabled) {
    return (
      <>
        <button type="button" className="btn btn-accent btn-block" onClick={enable} aria-label="Activar ubicación en tiempo real">
          {label}
        </button>
        {error && <p className="callout callout--warn">{error}</p>}
      </>
    );
  }
  return (
    <div className="geo-status" role="status">
      <span className="geo-status-dot" aria-hidden="true" />
      <span className="mono geo-status-text">
        {pos ? `UBICACIÓN ACTIVA${accuracy != null ? ` · ±${Math.round(accuracy)} m` : ''}` : 'BUSCANDO SEÑAL GPS…'}
      </span>
      <button type="button" className="btn btn-sm geo-stop" onClick={disable} aria-label="Detener la ubicación en tiempo real">
        ■ DETENER
      </button>
      {error && <p className="callout callout--warn geo-status-error">{error}</p>}
    </div>
  );
}
