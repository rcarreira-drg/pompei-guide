/**
 * Estilo de mapa "tinta" brutalista sobre teselas vectoriales de OpenFreeMap
 * (esquema OpenMapTiles, servidas por https://tiles.openfreemap.org/planet).
 * Sin capas de POI, uso de suelo ni etiquetas de lugares: solo lo necesario
 * para orientarse dentro del yacimiento (edificios, calles, agua).
 */
import type { StyleSpecification } from '@maplibre/maplibre-gl-style-spec';

export const OFM_TILEJSON_URL = 'https://tiles.openfreemap.org/planet';
export const OFM_GLYPHS_URL = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';
/** Cadena compacta única: el TileJSON de OpenFreeMap trae su propia atribución, que
 *  MapLibre concatenaría con esta si no se anulara explícitamente (ver `attribution: ''`
 *  en la fuente `ofm` más abajo) — sin eso se ve duplicada y ocupa varias líneas. */
export const OFM_ATTRIBUTION = '© OpenFreeMap · OpenMapTiles · OpenStreetMap';

/** GeoJSON propios del parque (edificios/ruinas y calles) generados por
 *  scripts/build-park-geo.mjs; suplen el límite de zoom 14 de las teselas del planet. */
const PARK_GEO_BASE = `${import.meta.env.BASE_URL}geo/`;
export const PARK_BUILDINGS_URL = `${PARK_GEO_BASE}park-buildings.json`;
export const PARK_STREETS_URL = `${PARK_GEO_BASE}park-streets.json`;

export interface MapLayerFlags {
  buildings: boolean;
  parkStreets: boolean;
  otherStreets: boolean;
  streetNames: boolean;
  water: boolean;
}

export const DEFAULT_MAP_LAYERS: MapLayerFlags = {
  buildings: true,
  parkStreets: true,
  otherStreets: true,
  streetNames: false,
  water: true,
};

const LAYERS_KEY = 'pompei-guide:map-layers';

export function loadMapLayers(): MapLayerFlags {
  try {
    const raw = localStorage.getItem(LAYERS_KEY);
    if (!raw) return { ...DEFAULT_MAP_LAYERS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_MAP_LAYERS, ...parsed };
  } catch {
    return { ...DEFAULT_MAP_LAYERS };
  }
}

export function saveMapLayers(flags: MapLayerFlags): void {
  try {
    localStorage.setItem(LAYERS_KEY, JSON.stringify(flags));
  } catch {
    /* almacenamiento no disponible: se ignora */
  }
}

/** Clases de vía "de paseo" dentro del parque (se dibujan en tinta, más gruesas). */
const PARK_WAY_CLASSES = ['path', 'footway', 'pedestrian', 'track', 'service'];

/** Ids de las capas propias que gestiona el mapa de rutas (para toggles y orden). */
export const LAYER_IDS = {
  water: 'pg-water',
  buildingFill: 'pg-building-fill',
  buildingOutline: 'pg-building-outline',
  parkBuildingFill: 'pg-park-building-fill',
  parkBuildingOutline: 'pg-park-building-outline',
  streetsOther: 'pg-transportation-other',
  streetsPark: 'pg-transportation-park',
  parkStreetsOwn: 'pg-park-streets',
  streetNames: 'pg-transportation-name',
} as const;

/** Qué capas (de teselas y/o propias del parque) controla cada casilla del popover CAPAS. */
export const LAYER_GROUPS: Record<keyof MapLayerFlags, string[]> = {
  buildings: [LAYER_IDS.buildingFill, LAYER_IDS.buildingOutline, LAYER_IDS.parkBuildingFill, LAYER_IDS.parkBuildingOutline],
  parkStreets: [LAYER_IDS.streetsPark, LAYER_IDS.parkStreetsOwn],
  otherStreets: [LAYER_IDS.streetsOther],
  streetNames: [LAYER_IDS.streetNames],
  water: [LAYER_IDS.water],
};

/** Visibilidad MapLibre a partir de un booleano. */
function vis(on: boolean): 'visible' | 'none' {
  return on ? 'visible' : 'none';
}

/**
 * Construye la hoja de estilo completa (fuente vectorial OpenFreeMap + capas propias).
 * La visibilidad inicial de cada capa refleja `flags`; los cambios posteriores del
 * usuario se aplican con `setLayoutProperty` (ver RouteMap.tsx) para no perder los
 * marcadores ni las fuentes de ruta añadidas encima del estilo.
 */
export function buildMapStyle(flags: MapLayerFlags): StyleSpecification {
  return {
    version: 8,
    name: 'pompei-guide-tinta',
    sources: {
      // `attribution: ''` anula la que trae el TileJSON de OpenFreeMap: sin esto MapLibre
      // la concatena con la nuestra (customAttribution) y se ve duplicada.
      ofm: { type: 'vector', url: OFM_TILEJSON_URL, attribution: '' },
      'park-buildings': { type: 'geojson', data: PARK_BUILDINGS_URL, attribution: '' },
      'park-streets': { type: 'geojson', data: PARK_STREETS_URL, attribution: '' },
    },
    glyphs: OFM_GLYPHS_URL,
    layers: [
      {
        id: 'pg-background',
        type: 'background',
        paint: { 'background-color': '#f2efe6' },
      },
      {
        id: LAYER_IDS.water,
        type: 'fill',
        source: 'ofm',
        'source-layer': 'water',
        layout: { visibility: vis(flags.water) },
        paint: { 'fill-color': '#cfd8dc' },
      },
      {
        id: LAYER_IDS.buildingFill,
        type: 'fill',
        source: 'ofm',
        'source-layer': 'building',
        minzoom: 13,
        layout: { visibility: vis(flags.buildings) },
        paint: { 'fill-color': '#e6e1d3', 'fill-outline-color': '#111111' },
      },
      {
        id: LAYER_IDS.buildingOutline,
        type: 'line',
        source: 'ofm',
        'source-layer': 'building',
        minzoom: 15,
        layout: { visibility: vis(flags.buildings) },
        paint: {
          'line-color': '#111111',
          'line-width': 1,
        },
      },
      {
        id: LAYER_IDS.parkBuildingFill,
        type: 'fill',
        source: 'park-buildings',
        minzoom: 15,
        layout: { visibility: vis(flags.buildings) },
        paint: { 'fill-color': '#e6e1d3' },
      },
      {
        id: LAYER_IDS.parkBuildingOutline,
        type: 'line',
        source: 'park-buildings',
        minzoom: 15,
        layout: { visibility: vis(flags.buildings) },
        paint: { 'line-color': '#111111', 'line-width': 1.2 },
      },
      {
        id: LAYER_IDS.streetsOther,
        type: 'line',
        source: 'ofm',
        'source-layer': 'transportation',
        filter: ['!', ['in', ['get', 'class'], ['literal', PARK_WAY_CLASSES]]],
        layout: { visibility: vis(flags.otherStreets), 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#a8a8a8',
          'line-width': ['interpolate', ['linear'], ['zoom'], 13, 0.4, 16, 0.8, 19, 1.4],
        },
      },
      {
        id: LAYER_IDS.streetsPark,
        type: 'line',
        source: 'ofm',
        'source-layer': 'transportation',
        filter: ['in', ['get', 'class'], ['literal', PARK_WAY_CLASSES]],
        layout: { visibility: vis(flags.parkStreets), 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#111111',
          'line-width': ['interpolate', ['linear'], ['zoom'], 14, 1.5, 18, 2.5],
        },
      },
      {
        id: LAYER_IDS.parkStreetsOwn,
        type: 'line',
        source: 'park-streets',
        layout: { visibility: vis(flags.parkStreets), 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#111111',
          'line-width': ['interpolate', ['linear'], ['zoom'], 15, 1.5, 19, 3],
        },
      },
      {
        id: LAYER_IDS.streetNames,
        type: 'symbol',
        source: 'ofm',
        'source-layer': 'transportation_name',
        minzoom: 15,
        layout: {
          visibility: vis(flags.streetNames),
          'text-field': ['get', 'name'],
          'text-font': ['Noto Sans Regular'],
          'text-size': 10,
          'symbol-placement': 'line',
          'text-letter-spacing': 0.02,
        },
        paint: {
          'text-color': '#6b6b6b',
          'text-halo-color': '#f2efe6',
          'text-halo-width': 1,
        },
      },
    ],
  };
}
