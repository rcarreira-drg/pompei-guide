/**
 * Mapa Leaflet brutalista. Solo usa divIcon/CircleMarker (nunca el icono por
 * defecto de Leaflet, que rompe con Vite si no se gestionan sus assets).
 */
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useCallback, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-rotate';
import { Link } from 'react-router-dom';
import type { Stop } from '@/content/types';
import type { LatLng } from '@/lib/geo';
import { PARK_BOUNDS } from '@/lib/geo';

export type VisitedMap = Record<string, string> | Set<string>;

export interface RouteMapProps {
  stops: Stop[];
  path?: LatLng[];
  currentId?: string;
  visited?: VisitedMap;
  userPos?: LatLng | null;
  onSelect?: (id: string) => void;
  height?: string;
  /** Camino dinámico (p.ej. desde tu posición hasta la siguiente parada). */
  walk?: LatLng[] | null;
  /** Puntos extra que deben caber en el encuadre (posición del usuario, destino…). */
  fitExtra?: LatLng[];
  /** Si true, re-encuadra cuando cambian los puntos (seguimiento). */
  follow?: boolean;
  /** Rumbo del dispositivo en grados (0 = norte). Si se indica, el marcador del usuario muestra un cono de dirección. */
  heading?: number | null;
  /** Ids de paradas "menores" (puntos extra): se dibujan pequeñas y sin número hasta acercar el zoom. */
  minor?: Set<string>;
}

function isVisited(visited: VisitedMap | undefined, id: string): boolean {
  if (!visited) return false;
  if (visited instanceof Set) return visited.has(id);
  return Boolean(visited[id]);
}

function stopIcon(order: number, state: 'visited' | 'current' | 'default', minor = false) {
  return L.divIcon({
    className: minor ? 'stop-divicon stop-divicon--minor' : 'stop-divicon',
    html: `<span class="stop-pin stop-pin--${state} ${minor ? 'stop-pin--minor' : ''}">${order}</span>`,
    iconSize: minor ? [18, 18] : [30, 30],
    iconAnchor: minor ? [9, 9] : [15, 15],
    popupAnchor: [0, minor ? -12 : -18],
  });
}

/** Marca en el contenedor el nivel de zoom (lejos/cerca) para adaptar los pines menores por CSS. */
function ZoomClass({ onChange }: { onChange: (far: boolean) => void }) {
  const map = useMapEvents({ zoomend: () => onChange(map.getZoom() < 17) });
  useEffect(() => { onChange(map.getZoom() < 17); }, [map, onChange]);
  return null;
}

const bounds = L.latLngBounds(PARK_BOUNDS).pad(0.15);

/** Marcador del usuario: punto rojo y, si hay rumbo, cono de visión que gira con el móvil. */
function userIcon(heading: number | null | undefined) {
  const hasH = heading != null && Number.isFinite(heading);
  return L.divIcon({
    className: 'user-divicon',
    html: `<span class="user-pin ${hasH ? 'has-heading' : ''}" style="--h:${hasH ? Math.round(heading as number) : 0}deg"><span class="user-cone"></span><span class="user-dot"></span></span>`,
    iconSize: [64, 64],
    iconAnchor: [32, 32],
  });
}

const STYLE_KEY = 'pompei-guide:map-style';
type MapStyle = 'tinta' | 'color';
const loadStyle = (): MapStyle => { try { return (localStorage.getItem(STYLE_KEY) as MapStyle) || 'tinta'; } catch { return 'tinta'; } };

/** Bloqueo de interacción: el mapa no captura el dedo hasta que el usuario lo toca a propósito (evita
 *  que el scroll de la página "se quede atrapado" al pasar por encima del mapa). */
function InteractionLock({ active, onActivate }: { active: boolean; onActivate: () => void }) {
  const map = useMap();
  useEffect(() => {
    if (active) { map.dragging.enable(); map.touchZoom.enable(); map.scrollWheelZoom.enable(); }
    else { map.dragging.disable(); map.touchZoom.disable(); map.scrollWheelZoom.disable(); }
  }, [map, active]);
  if (active) return null;
  return (
    <button type="button" className="map-lock" onClick={onActivate} aria-label="Activar el mapa para moverlo y ampliarlo">
      <span className="map-lock-label">TOCA PARA USAR EL MAPA</span>
    </button>
  );
}

/** Rotación: gesto de dos dedos (plugin leaflet-rotate) y modo "brújula" (el mapa gira con el rumbo del móvil). */
function RotationControls({ heading }: { heading: number | null | undefined }) {
  const map = useMap();
  const [headingUp, setHeadingUp] = useState(false);
  const [bearing, setBearing] = useState(0);
  useEffect(() => {
    const onRotate = () => setBearing(Math.round(map.getBearing?.() ?? 0));
    map.on('rotate', onRotate);
    return () => { map.off('rotate', onRotate); };
  }, [map]);
  useEffect(() => {
    if (!headingUp || heading == null || !map.setBearing) return;
    try { map.setBearing(-heading); } catch { /* ignore */ }
  }, [headingUp, heading, map]);
  const resetNorth = () => { setHeadingUp(false); try { map.setBearing(0); } catch { /* ignore */ } };
  return (
    <div className="map-rotate-controls">
      {heading != null && (
        <button type="button" className={`map-ctrl-btn ${headingUp ? 'is-on' : ''}`} onClick={() => (headingUp ? resetNorth() : setHeadingUp(true))} aria-pressed={headingUp} aria-label="Girar el mapa con la brújula">
          {headingUp ? '⟲ BRÚJULA ON' : '⟲ GIRAR CON BRÚJULA'}
        </button>
      )}
      {bearing !== 0 && !headingUp && (
        <button type="button" className="map-ctrl-btn" onClick={resetNorth} aria-label="Volver a orientar el mapa al norte">
          <span className="map-north" style={{ transform: `rotate(${bearing}deg)` }}>▲</span> NORTE
        </button>
      )}
    </div>
  );
}

/** Botón para centrar el mapa en la posición del usuario. */
function CenterOnUser({ userPos }: { userPos: LatLng }) {
  const map = useMap();
  return (
    <button
      type="button"
      className="map-ctrl-btn map-center-btn"
      onClick={(e) => { e.stopPropagation(); try { map.setView(userPos, Math.max(map.getZoom(), 17), { animate: false }); } catch { /* ignore */ } }}
      aria-label="Centrar el mapa en mi posición"
    >
      ◎ CENTRAR EN MÍ
    </button>
  );
}

/** Encuadra todas las paradas al montar (y cuando cambia el conjunto). */
function FitStops({ points, single, follow }: { points: LatLng[]; single: boolean; follow?: boolean }) {
  const map = useMap();
  const key = follow ? points.map((p) => p[0].toFixed(4) + ',' + p[1].toFixed(4)).join('|') : String(points.length);
  useEffect(() => {
    if (points.length === 0) return;
    try {
      if (single) map.setView(points[0], 17, { animate: false });
      else map.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 18, animate: false });
    } catch { /* el mapa puede estar desmontándose */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key, single]);
  return null;
}

export default function RouteMap({ stops, path = [], currentId, visited, userPos, onSelect, height = '55vh', walk, fitExtra = [], follow, heading, minor }: RouteMapProps) {
  const [far, setFar] = useState(true);
  const onZoom = useCallback((f: boolean) => setFar(f), []);
  const [active, setActive] = useState(false);
  const [style, setStyle] = useState<MapStyle>(loadStyle);
  const toggleStyle = () => { const next: MapStyle = style === 'tinta' ? 'color' : 'tinta'; setStyle(next); try { localStorage.setItem(STYLE_KEY, next); } catch { /* ignore */ } };
  if (stops.length === 0) {
    return (
      <div className="route-map route-map--empty box" style={{ height }}>
        <p className="empty-state">El mapa de la ruta está en preparación.</p>
      </div>
    );
  }

  const center: LatLng = stops[0].coords;

  return (
    <div className={`route-map box ${far ? 'is-far' : 'is-near'} style-${style} ${active ? 'is-active' : 'is-locked'}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={16}
        minZoom={14}
        maxZoom={19}
        maxBounds={bounds}
        rotate
        touchRotate
        rotateControl={false}
        shiftKeyRotate={false}
        zoomAnimation={false}
        markerZoomAnimation={false}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={false}
        dragging={false}
        touchZoom={false}
        style={{ height: '100%', width: '100%' }}
        attributionControl
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={18}
          maxZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
        />
        <ZoomClass onChange={onZoom} />
        <FitStops
          points={[...stops.map((s) => s.coords), ...fitExtra, ...(walk ?? [])]}
          single={stops.length === 1 && fitExtra.length === 0 && !walk}
          follow={follow}
        />

        {path.length > 1 && (
          <>
            <Polyline positions={path} pathOptions={{ color: '#111111', weight: 5, opacity: 1 }} />
            <Polyline positions={path} pathOptions={{ color: '#b4321e', weight: 2, dashArray: '6 8', opacity: 1 }} />
          </>
        )}

        {walk && walk.length > 1 && (
          <>
            <Polyline positions={walk} pathOptions={{ color: '#111111', weight: 9, opacity: 1, lineCap: 'square' }} />
            <Polyline positions={walk} pathOptions={{ color: '#d9a521', weight: 5, opacity: 1, lineCap: 'square' }} />
          </>
        )}

        {stops.map((s) => {
          const state = s.id === currentId ? 'current' : isVisited(visited, s.id) ? 'visited' : 'default';
          const isMinor = !!minor?.has(s.id) && s.id !== currentId;
          return (
            <Marker
              key={s.id}
              position={s.coords}
              icon={stopIcon(s.order, state, isMinor)}
              zIndexOffset={isMinor ? -100 : 0}
              eventHandlers={onSelect ? { click: () => onSelect(s.id) } : undefined}
            >
              <Popup>
                <strong className="mono popup-title">
                  {s.order}. {s.name}
                </strong>
                <Link to={`/visita/${s.id}`} className="btn btn-accent btn-block popup-btn">
                  IR A LA PARADA
                </Link>
              </Popup>
            </Marker>
          );
        })}

        {userPos && <Marker position={userPos} icon={userIcon(heading)} interactive={false} zIndexOffset={1000} />}
        {userPos && <CenterOnUser userPos={userPos} />}
        <RotationControls heading={heading} />
        <InteractionLock active={active} onActivate={() => setActive(true)} />
      </MapContainer>
      <div className="map-style-toggle">
        <button type="button" className="map-ctrl-btn" onClick={toggleStyle} aria-label="Cambiar el estilo del mapa" aria-pressed={style === 'tinta'}>
          {style === 'tinta' ? '◐ TINTA' : '◑ COLOR'}
        </button>
      </div>
      <div className="map-container-end" />
    </div>
  );
}
