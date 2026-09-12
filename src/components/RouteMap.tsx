/**
 * Mapa brutalista con MapLibre GL JS sobre teselas vectoriales de OpenFreeMap
 * (esquema OpenMapTiles, ver src/lib/mapStyle.ts). Un único `maplibregl.Map`
 * por instancia del componente: se crea al montar y se actualiza de forma
 * imperativa (fuentes GeoJSON con `setData`, marcadores reutilizados) en
 * lugar de recrearse en cada render.
 */
import * as maplibregl from 'maplibre-gl';
import type { FeatureCollection, LineString } from 'geojson';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Stop } from '@/content/types';
import type { LatLng } from '@/lib/geo';
import { PARK_BOUNDS } from '@/lib/geo';
import {
  buildMapStyle,
  LAYER_GROUPS,
  loadMapLayers,
  saveMapLayers,
  OFM_ATTRIBUTION,
  type MapLayerFlags,
} from '@/lib/mapStyle';

// MapLibre decodifica las teselas en un Worker (módulo ES) que a su vez importa un chunk
// "shared" por ruta relativa; Vite no sabe seguir esa importación interna (la URL del
// worker se calcula en tiempo de ejecución). Por eso los dos ficheros se sirven tal cual
// desde public/maplibre/ (ver scripts/copy-maplibre-worker.mjs) en vez de dejar que el
// bundler los empaquete: sin esto, en producción el worker no carga y el mapa se queda
// sin teselas para siempre, sin ningún error visible en consola.
maplibregl.setWorkerUrl(`${import.meta.env.BASE_URL}maplibre/maplibre-gl-worker.mjs`);

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

/** [lat, lng] (formato de la app) -> [lng, lat] (formato MapLibre/GeoJSON). */
function toLngLat(p: LatLng): [number, number] {
  return [p[1], p[0]];
}

function toLine(points: LatLng[]): FeatureCollection<LineString> {
  return {
    type: 'FeatureCollection',
    features:
      points.length > 1
        ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: points.map(toLngLat) } }]
        : [],
  };
}

function emptyLine(): FeatureCollection<LineString> {
  return { type: 'FeatureCollection', features: [] };
}

/** Bounds del parque, con un margen del 15% (igual que el `pad(0.15)` anterior con Leaflet). */
function paddedParkBounds(): maplibregl.LngLatBoundsLike {
  const [[s, w], [n, e]] = PARK_BOUNDS;
  const latPad = (n - s) * 0.15;
  const lngPad = (e - w) * 0.15;
  return [
    [w - lngPad, s - latPad],
    [e + lngPad, n + latPad],
  ];
}

function stopPinNode(order: number, state: 'visited' | 'current' | 'default', minor: boolean): HTMLElement {
  const el = document.createElement('div');
  el.className = minor ? 'stop-divicon stop-divicon--minor' : 'stop-divicon';
  const span = document.createElement('span');
  span.className = `stop-pin stop-pin--${state}${minor ? ' stop-pin--minor' : ''}`;
  span.textContent = String(order);
  el.appendChild(span);
  return el;
}

function popupNode(order: number, name: string, id: string): HTMLElement {
  const wrap = document.createElement('div');
  const strong = document.createElement('strong');
  strong.className = 'mono popup-title';
  strong.textContent = `${order}. ${name}`;
  const a = document.createElement('a');
  a.href = `#/visita/${id}`;
  a.className = 'btn btn-accent btn-block popup-btn';
  a.textContent = 'IR A LA PARADA';
  wrap.appendChild(strong);
  wrap.appendChild(a);
  return wrap;
}

function userPinNode(): HTMLElement {
  const el = document.createElement('span');
  el.className = 'user-pin';
  el.style.pointerEvents = 'none';
  el.innerHTML = '<span class="user-cone"></span><span class="user-dot"></span>';
  return el;
}

const LAYER_TOGGLES: Array<{ key: keyof MapLayerFlags; label: string }> = [
  { key: 'buildings', label: 'Edificios' },
  { key: 'parkStreets', label: 'Calles del parque' },
  { key: 'otherStreets', label: 'Otras vías' },
  { key: 'streetNames', label: 'Nombres de calles' },
  { key: 'water', label: 'Agua' },
];

export default function RouteMap({
  stops,
  path = [],
  currentId,
  visited,
  userPos,
  onSelect,
  height = '55vh',
  walk,
  fitExtra = [],
  follow,
  heading,
  minor,
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const stopMarkersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const userElRef = useRef<HTMLElement | null>(null);

  const [styleReady, setStyleReady] = useState(false);
  const [far, setFar] = useState(true);
  const [active, setActive] = useState(false);
  const [bearing, setBearing] = useState(0);
  const [headingUp, setHeadingUp] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [layers, setLayers] = useState<MapLayerFlags>(loadMapLayers);

  const hasStops = stops.length > 0;

  // ---- Creación del mapa (una sola vez por instancia del componente) ----
  useEffect(() => {
    if (!containerRef.current || !hasStops) return undefined;
    const center: LatLng = stops[0].coords;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: buildMapStyle(layers),
      center: toLngLat(center),
      zoom: 16,
      minZoom: 14,
      maxZoom: 19,
      maxBounds: paddedParkBounds(),
      dragPan: false,
      scrollZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      touchZoomRotate: false,
      attributionControl: { compact: true, customAttribution: OFM_ATTRIBUTION },
    });
    map.touchZoomRotate.enableRotation();
    mapRef.current = map;

    map.on('load', () => {
      map.addSource('route-path', { type: 'geojson', data: emptyLine() });
      map.addLayer({
        id: 'route-path-casing',
        type: 'line',
        source: 'route-path',
        paint: { 'line-color': '#111111', 'line-width': 5 },
      });
      map.addLayer({
        id: 'route-path-top',
        type: 'line',
        source: 'route-path',
        paint: { 'line-color': '#b4321e', 'line-width': 2, 'line-dasharray': [3, 4] },
      });
      map.addSource('walk-route', { type: 'geojson', data: emptyLine() });
      map.addLayer({
        id: 'walk-route-casing',
        type: 'line',
        source: 'walk-route',
        layout: { 'line-cap': 'square', 'line-join': 'round' },
        paint: { 'line-color': '#111111', 'line-width': 9 },
      });
      map.addLayer({
        id: 'walk-route-top',
        type: 'line',
        source: 'walk-route',
        layout: { 'line-cap': 'square', 'line-join': 'round' },
        paint: { 'line-color': '#d9a521', 'line-width': 5 },
      });
      setStyleReady(true);
    });

    const onZoom = () => setFar(map.getZoom() < 17);
    const onRotate = () => setBearing(Math.round(map.getBearing()));
    map.on('zoomend', onZoom);
    map.on('rotate', onRotate);
    onZoom();

    return () => {
      map.remove();
      mapRef.current = null;
      stopMarkersRef.current = [];
      userMarkerRef.current = null;
      setStyleReady(false);
    };
    // Solo se recrea si cambia el conjunto de paradas iniciales (nueva página de mapa).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStops]);

  // ---- Marcadores de parada ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    stopMarkersRef.current.forEach((m) => m.remove());
    stopMarkersRef.current = [];
    const minorStops = stops.filter((s) => !!minor?.has(s.id) && s.id !== currentId);
    const normalStops = stops.filter((s) => !(!!minor?.has(s.id) && s.id !== currentId));
    for (const s of [...minorStops, ...normalStops]) {
      const state = s.id === currentId ? 'current' : isVisited(visited, s.id) ? 'visited' : 'default';
      const isMinor = !!minor?.has(s.id) && s.id !== currentId;
      const el = stopPinNode(s.order, state, isMinor);
      if (onSelect) el.style.cursor = 'pointer';
      const popup = new maplibregl.Popup({ offset: isMinor ? 12 : 18, closeButton: true }).setDOMContent(
        popupNode(s.order, s.name, s.id),
      );
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(toLngLat(s.coords))
        .setPopup(popup)
        .addTo(map);
      if (onSelect) marker.on('click', () => onSelect(s.id));
      stopMarkersRef.current.push(marker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, currentId, visited, minor, onSelect]);

  // ---- Marcador del usuario ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!userPos) {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      userElRef.current = null;
      return;
    }
    if (!userMarkerRef.current) {
      const el = userPinNode();
      userElRef.current = el;
      userMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(toLngLat(userPos))
        .addTo(map);
    } else {
      userMarkerRef.current.setLngLat(toLngLat(userPos));
    }
    const hasH = heading != null && Number.isFinite(heading);
    const el = userElRef.current;
    if (el) {
      el.classList.toggle('has-heading', hasH);
      el.style.setProperty('--h', `${hasH ? Math.round(heading as number) : 0}deg`);
    }
  }, [userPos, heading]);

  // ---- Encuadre (fitBounds / setView / follow) ----
  const fitKey = follow
    ? [...stops.map((s) => s.coords), ...fitExtra, ...(walk ?? [])].map((p) => `${p[0].toFixed(5)},${p[1].toFixed(5)}`).join('|')
    : String(stops.length + fitExtra.length + (walk?.length ?? 0));
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const points = [...stops.map((s) => s.coords), ...fitExtra, ...(walk ?? [])];
    if (points.length === 0) return;
    try {
      if (points.length === 1) {
        map.jumpTo({ center: toLngLat(points[0]), zoom: 17 });
      } else {
        const lngs = points.map((p) => p[1]);
        const lats = points.map((p) => p[0]);
        const bounds: maplibregl.LngLatBoundsLike = [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ];
        map.fitBounds(bounds, { padding: 28, maxZoom: 18, animate: false });
      }
    } catch {
      /* el mapa puede estar desmontándose */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey]);

  // ---- Camino de la ruta (fijo) ----
  useEffect(() => {
    if (!styleReady) return;
    const map = mapRef.current;
    const src = map?.getSource('route-path') as maplibregl.GeoJSONSource | undefined;
    src?.setData(toLine(path));
  }, [path, styleReady]);

  // ---- Camino dinámico (walk) ----
  useEffect(() => {
    if (!styleReady) return;
    const map = mapRef.current;
    const src = map?.getSource('walk-route') as maplibregl.GeoJSONSource | undefined;
    src?.setData(walk && walk.length > 1 ? toLine(walk) : emptyLine());
  }, [walk, styleReady]);

  // ---- Capas activables por el usuario (CAPAS) ----
  useEffect(() => {
    if (!styleReady) return;
    const map = mapRef.current;
    if (!map) return;
    for (const key of Object.keys(LAYER_GROUPS) as Array<keyof MapLayerFlags>) {
      const visibility = layers[key] ? 'visible' : 'none';
      for (const id of LAYER_GROUPS[key]) {
        try {
          map.setLayoutProperty(id, 'visibility', visibility);
        } catch {
          /* la capa aún no existe (estilo cargando) */
        }
      }
    }
  }, [layers, styleReady]);

  const toggleLayer = useCallback((key: keyof MapLayerFlags) => {
    setLayers((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveMapLayers(next);
      return next;
    });
  }, []);

  // ---- Bloqueo de interacción ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (active) {
      map.dragPan.enable();
      map.scrollZoom.enable();
      map.touchZoomRotate.enable();
      map.touchZoomRotate.enableRotation();
    } else {
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.touchZoomRotate.disable();
    }
  }, [active]);

  // ---- Brújula: gira el mapa con el rumbo del móvil ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !headingUp || heading == null) return;
    try {
      map.setBearing(-heading);
    } catch {
      /* ignore */
    }
  }, [headingUp, heading]);

  const resetNorth = useCallback(() => {
    setHeadingUp(false);
    try {
      mapRef.current?.resetNorth({ duration: 0 });
    } catch {
      /* ignore */
    }
  }, []);

  const centerOnUser = useCallback(() => {
    const map = mapRef.current;
    if (!map || !userPos) return;
    try {
      map.jumpTo({ center: toLngLat(userPos), zoom: Math.max(map.getZoom(), 17) });
    } catch {
      /* ignore */
    }
  }, [userPos]);

  if (!hasStops) {
    return (
      <div className="route-map route-map--empty box" style={{ height }}>
        <p className="empty-state">El mapa de la ruta está en preparación.</p>
      </div>
    );
  }

  return (
    <div className={`route-map box ${far ? 'is-far' : 'is-near'} ${active ? 'is-active' : 'is-locked'}`} style={{ height }}>
      <div ref={containerRef} className="route-map-canvas" style={{ height: '100%', width: '100%' }} />

      <div className="map-zoom-controls">
        <button type="button" className="map-ctrl-btn map-zoom-btn" onClick={() => mapRef.current?.zoomIn({ duration: 0 })} aria-label="Acercar el mapa">
          +
        </button>
        <button type="button" className="map-ctrl-btn map-zoom-btn" onClick={() => mapRef.current?.zoomOut({ duration: 0 })} aria-label="Alejar el mapa">
          −
        </button>
      </div>

      <div className="map-layers-toggle">
        <button
          type="button"
          className="map-ctrl-btn"
          onClick={() => setLayersOpen((v) => !v)}
          aria-expanded={layersOpen}
          aria-label="Elegir qué se ve en el mapa"
        >
          ▤ CAPAS
        </button>
        {layersOpen && (
          <div className="map-layers-panel box">
            {LAYER_TOGGLES.map((t) => (
              <label key={t.key} className="map-layers-item">
                <input type="checkbox" checked={layers[t.key]} onChange={() => toggleLayer(t.key)} />
                {t.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {userPos && (
        <button type="button" className="map-ctrl-btn map-center-btn" onClick={(e) => { e.stopPropagation(); centerOnUser(); }} aria-label="Centrar el mapa en mi posición">
          ◎ CENTRAR EN MÍ
        </button>
      )}

      <div className="map-rotate-controls">
        {heading != null && (
          <button
            type="button"
            className={`map-ctrl-btn ${headingUp ? 'is-on' : ''}`}
            onClick={() => (headingUp ? resetNorth() : setHeadingUp(true))}
            aria-pressed={headingUp}
            aria-label="Girar el mapa con la brújula"
          >
            {headingUp ? '⟲ BRÚJULA ON' : '⟲ GIRAR CON BRÚJULA'}
          </button>
        )}
        {bearing !== 0 && !headingUp && (
          <button type="button" className="map-ctrl-btn" onClick={resetNorth} aria-label="Volver a orientar el mapa al norte">
            <span className="map-north" style={{ transform: `rotate(${bearing}deg)` }}>▲</span> NORTE
          </button>
        )}
      </div>

      {!active && (
        <button type="button" className="map-lock" onClick={() => setActive(true)} aria-label="Activar el mapa para moverlo y ampliarlo">
          <span className="map-lock-label">TOCA PARA USAR EL MAPA</span>
        </button>
      )}
      <div className="map-container-end" />
    </div>
  );
}
