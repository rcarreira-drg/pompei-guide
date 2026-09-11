import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import RouteMap from '@/components/RouteMap';
import Compass from '@/components/Compass';
import { ROUTE } from '@/content/route';
import { useGeolocation } from '@/lib/useGeolocation';
import { useProgress } from '@/lib/useProgress';
import { distanceM } from '@/lib/geo';
import type { StopCategory } from '@/content/types';

const CATEGORY_LABEL: Record<StopCategory, string> = {
  puerta: 'PUERTA',
  foro: 'FORO',
  templo: 'TEMPLO',
  domus: 'CASA',
  villa: 'VILLA',
  termas: 'TERMAS',
  comercio: 'COMERCIO',
  espectaculo: 'ESPECTÁCULO',
  calle: 'CALLE',
  necropolis: 'NECRÓPOLIS',
  servicio: 'SERVICIO',
};

export default function Visit() {
  const { pos, accuracy, error, enabled, enable } = useGeolocation();
  const { visited, currentStop, reset } = useProgress();
  const [confirmingReset, setConfirmingReset] = useState(false);

  const stops = ROUTE.stops;
  const visitedCount = stops.filter((s) => visited[s.id]).length;

  const nextStop = useMemo(() => {
    if (currentStop) {
      const cur = stops.find((x) => x.id === currentStop);
      if (cur && !visited[cur.id]) return cur;
    }
    return stops.find((s) => !visited[s.id]) ?? stops[stops.length - 1];
  }, [stops, visited, currentStop]);

  const nearbyUnvisited = useMemo(() => {
    if (!pos) return undefined;
    return stops.find((s) => !visited[s.id] && distanceM(pos, s.coords) < 40);
  }, [pos, stops, visited]);

  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    reset();
    setConfirmingReset(false);
  };

  return (
    <div>
      <header className="visit-header container">
        <p className="kicker">EL DÍA DE LA VISITA</p>
        <h1 className="hero-title">{ROUTE.name || 'EL RECORRIDO'}</h1>
        <ProgressBar visited={visitedCount} total={stops.length} />
      </header>

      <div className="container">
        {!enabled && (
          <button type="button" className="btn btn-accent btn-block" onClick={enable} aria-label="Activar ubicación en tiempo real">
            ACTIVAR UBICACIÓN
          </button>
        )}
        {error && <p className="callout callout--warn">{error}</p>}
        {enabled && accuracy != null && <p className="mono geo-accuracy">Precisión: ±{Math.round(accuracy)} m</p>}

        {nearbyUnvisited && (
          <Link to={`/visita/${nearbyUnvisited.id}`} className="box banner-here" aria-label={`Estás en ${nearbyUnvisited.name}`}>
            <span className="kicker">ESTÁS EN</span>
            <strong>{nearbyUnvisited.name}</strong>
          </Link>
        )}

        {stops.length === 0 ? (
          <p className="empty-state box">La ruta está en preparación.</p>
        ) : (
          <>
            <RouteMap stops={stops} path={ROUTE.path} currentId={nextStop?.id} visited={visited} userPos={pos} height="45vh" />

            {nextStop && (
              <div className="box next-stop-card">
                <p className="kicker">SIGUIENTE PARADA</p>
                <h3>
                  {nextStop.order}. {nextStop.name}
                </h3>
                <Compass target={nextStop.coords} userPos={pos} label={nextStop.name} compact />
                <Link to={`/visita/${nextStop.id}`} className="btn btn-primary btn-block">
                  IR A LA PARADA
                </Link>
              </div>
            )}

            <h2 className="section-title">TODAS LAS PARADAS</h2>
            <ol className="stop-list">
              {stops.map((s) => (
                <li key={s.id} className={`stop-list-item ${visited[s.id] ? 'is-visited' : ''}`}>
                  <Link to={`/visita/${s.id}`}>
                    <span className="stop-list-num mono">{s.order}</span>
                    <span className="stop-list-body">
                      <strong>{s.name}</strong>
                      <span className="stop-list-meta">
                        <span className="tag">{CATEGORY_LABEL[s.category] ?? s.category}</span>
                        <span className="mono">{s.minutes} min</span>
                      </span>
                    </span>
                    <span className="stop-list-check" aria-hidden="true">
                      {visited[s.id] ? '✓' : ''}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </>
        )}

        <button type="button" className="btn btn-block" onClick={handleReset} aria-label="Reiniciar el recorrido">
          {confirmingReset ? '¿SEGURO? TOCA DE NUEVO PARA REINICIAR' : 'REINICIAR RECORRIDO'}
        </button>

        <p className="callout callout--info">
          <span className="mono">
            Modo sin conexión: la guía funciona sin internet una vez cargada; el mapa necesita datos móviles la primera vez que visitas
            cada zona.
          </span>
        </p>
      </div>
    </div>
  );
}
