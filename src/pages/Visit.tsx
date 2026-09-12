import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressBar from '@/components/ProgressBar';
import RouteMap from '@/components/RouteMap';
import Compass from '@/components/Compass';
import { ROUTE } from '@/content/route';
import { useGeolocation } from '@/lib/useGeolocation';
import { useHeading } from '@/lib/useHeading';
import { useProgress } from '@/lib/useProgress';
import type { StopCategory } from '@/content/types';
import ExpressToggle from '@/components/ExpressToggle';
import WakeLockToggle from '@/components/WakeLockToggle';
import WeatherCard from '@/components/WeatherCard';
import Planner from '@/components/Planner';
import Diploma from '@/components/Diploma';
import MapDownload from '@/components/MapDownload';
import { stopsForMode, modeSummary, EXTRA_IDS, type RouteMode } from '@/lib/modes';
import { useWalkRoute } from '@/lib/useWalkRoute';
import LocationToggle from '@/components/LocationToggle';
import Narrator from '@/components/Narrator';
import ArrivalToggle from '@/components/ArrivalToggle';
import { stopAtPosition, vibrateArrival, useAnnouncedStop } from '@/lib/arrival';
import { loadNarratorSettings } from '@/lib/narratorSettings';

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
  const { pos } = useGeolocation();
  const { heading } = useHeading();
  const { visited, currentStop, reset, mode, routeStartedAt } = useProgress();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const navigate = useNavigate();
  const { announcedStopId, setAnnouncedStop } = useAnnouncedStop();

  const rmode: RouteMode = (mode as RouteMode) ?? 'completa';
  const stops = useMemo(() => stopsForMode(rmode), [rmode]);
  const visitedCount = stops.filter((s) => visited[s.id]).length;

  const nextStop = useMemo(() => {
    if (currentStop) {
      const cur = stops.find((x) => x.id === currentStop);
      if (cur && !visited[cur.id]) return cur;
    }
    return stops.find((s) => !visited[s.id]) ?? stops[stops.length - 1];
  }, [stops, visited, currentStop]);

  const walk = useWalkRoute(pos, nextStop?.coords ?? null);

  const nearbyUnvisited = useMemo(
    () => stopAtPosition(pos, stops, visited, currentStop),
    [pos, stops, visited, currentStop]
  );

  useEffect(() => {
    if (!nearbyUnvisited || nearbyUnvisited.id === announcedStopId) return;
    setAnnouncedStop(nearbyUnvisited.id);
    const settings = loadNarratorSettings();
    if (settings.vibrateOnArrival) vibrateArrival();
    if (settings.autoplayOnArrival) navigate(`/visita/${nearbyUnvisited.id}?auto=1`);
  }, [nearbyUnvisited, announcedStopId, setAnnouncedStop, navigate]);

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
        <LocationToggle />
        <ArrivalToggle />

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
            {nextStop && (
              <div className="box next-stop-card">
                <p className="kicker">SIGUIENTE PARADA</p>
                <h2 className="next-stop-title">
                  {nextStop.order}. {nextStop.name}
                </h2>
                <Compass target={nextStop.coords} userPos={pos} label={nextStop.name} compact />
                <Link to={`/visita/${nextStop.id}`} className="btn btn-primary btn-block">
                  IR A LA PARADA
                </Link>
              </div>
            )}

            <RouteMap stops={stops} path={ROUTE.path} currentId={nextStop?.id} visited={visited} userPos={pos} heading={heading} walk={walk?.path ?? null} height="60vh" minor={rmode === 'total' ? EXTRA_IDS : undefined} />

            {((mode === 'express' ? ROUTE.logicExpress : ROUTE.logic) ?? []).length > 0 && (
              <details className="practical-accordion box visit-logic" open={visitedCount === 0}>
                <summary><span className="kicker">ANTES DE EMPEZAR</span><h2>{mode === 'express' ? 'POR QUÉ ESTA RUTA EXPRÉS' : 'POR QUÉ ESTE RECORRIDO'}</h2></summary>
                <div className="practical-accordion-body">
                  <Narrator
                    texts={(mode === 'express' ? ROUTE.logicExpress : ROUTE.logic) ?? []}
                    title={mode === 'express' ? 'Presentación de la ruta exprés' : 'Presentación del recorrido'}
                    compactHeader
                  />
                </div>
              </details>
            )}
            {walk && pos && (
              <p className="mono walk-summary">HASTA LA SIGUIENTE PARADA: {`${Math.round(walk.distance / 10) * 10} m`} · ≈ {Math.max(1, Math.round(walk.distance / 75))} min a pie (camino en ocre)</p>
            )}

            <Diploma visitedCount={visitedCount} total={stops.length} startedAt={routeStartedAt} />

            <div className="visit-tools">
              <ExpressToggle />
              <WakeLockToggle />
            </div>
            <MapDownload />

            <h2 className="section-title">{rmode === 'express' ? 'RUTA EXPRÉS' : rmode === 'total' ? 'RUTA TOTAL' : 'TODAS LAS PARADAS'}</h2>
            <p className="mono stop-list-summary">
              {`TOTAL: ${modeSummary(rmode)}`}
            </p>
            <ol className="stop-list">
              {stops.map((s) => (
                <li key={s.id} className={`stop-list-item ${visited[s.id] ? 'is-visited' : ''}`}>
                  <Link to={`/visita/${s.id}`}>
                    <span className="stop-list-num mono">{s.order}</span>
                    <span className="stop-list-body">
                      <strong>{s.name}</strong>
                      <span className="stop-list-meta">
                        <span className="tag">{CATEGORY_LABEL[s.category] ?? s.category}</span>
                        {rmode === 'total' && EXTRA_IDS.has(s.id) && <span className="tag tag--extra">MAPA OFICIAL</span>}
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

        <details className="practical-accordion box visit-planner">
              <summary><span className="kicker">HORARIO</span><h2>PLANIFICADOR DEL DÍA</h2></summary>
              <div className="practical-accordion-body"><Planner stops={stops} /></div>
            </details>
            <details className="practical-accordion box visit-weather">
              <summary><span className="kicker">CIELO SOBRE EL VESUBIO</span><h2>EL TIEMPO</h2></summary>
              <div className="practical-accordion-body"><WeatherCard /></div>
            </details>

            <button type="button" className="btn btn-block" onClick={handleReset} aria-label="Reiniciar el recorrido">
          {confirmingReset ? '¿SEGURO? TOCA DE NUEVO PARA REINICIAR' : 'REINICIAR RECORRIDO'}
        </button>

        <p className="callout callout--info">
          <span className="mono">
            Modo sin conexión: la guía funciona sin internet una vez cargada; el mapa necesita datos móviles la primera vez que visitas
            cada zona.
          </span>
         <span className="mono">Versión {__BUILD_TIME__}.</span></p>
      </div>
    </div>
  );
}
