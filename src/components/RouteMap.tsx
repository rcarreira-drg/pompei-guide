/**
 * Mapa Leaflet brutalista. Solo usa divIcon/CircleMarker (nunca el icono por
 * defecto de Leaflet, que rompe con Vite si no se gestionan sus assets).
 */
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
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

export default function RouteMap({ stops, path = [], currentId, visited, userPos, onSelect, height = '55vh' }: RouteMapProps) {
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
        minZoom={15}
        maxZoom={19}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        attributionControl
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
        />

        {path.length > 1 && (
          <>
            <Polyline positions={path} pathOptions={{ color: '#111111', weight: 5, opacity: 1 }} />
            <Polyline positions={path} pathOptions={{ color: '#b4321e', weight: 2, dashArray: '6 8', opacity: 1 }} />
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
