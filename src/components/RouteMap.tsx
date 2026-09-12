/**
 * Mapa Leaflet brutalista. Solo usa divIcon/CircleMarker (nunca el icono por
 * defecto de Leaflet, que rompe con Vite si no se gestionan sus assets).
 */
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
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
}

function isVisited(visited: VisitedMap | undefined, id: string): boolean {
  if (!visited) return false;
  if (visited instanceof Set) return visited.has(id);
  return Boolean(visited[id]);
}

function stopIcon(order: number, state: 'visited' | 'current' | 'default') {
  return L.divIcon({
    className: 'stop-divicon',
    html: `<span class="stop-pin stop-pin--${state}">${order}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -18],
  });
}

const bounds = L.latLngBounds(PARK_BOUNDS).pad(0.15);

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

export default function RouteMap({ stops, path = [], currentId, visited, userPos, onSelect, height = '55vh', walk, fitExtra = [], follow }: RouteMapProps) {
  if (stops.length === 0) {
    return (
      <div className="route-map route-map--empty box" style={{ height }}>
        <p className="empty-state">El mapa de la ruta está en preparación.</p>
      </div>
    );
  }

  const center: LatLng = stops[0].coords;

  return (
    <div className="route-map box" style={{ height }}>
      <MapContainer
        center={center}
        zoom={16}
        minZoom={14}
        maxZoom={19}
        maxBounds={bounds}
        zoomAnimation={false}
        markerZoomAnimation={false}
        maxBoundsViscosity={1.0}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        attributionControl
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
        />
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
          return (
            <Marker
              key={s.id}
              position={s.coords}
              icon={stopIcon(s.order, state)}
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

        {userPos && (
          <CircleMarker
            center={userPos}
            radius={9}
            pathOptions={{ color: '#111111', weight: 3, fillColor: '#b4321e', fillOpacity: 1 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
