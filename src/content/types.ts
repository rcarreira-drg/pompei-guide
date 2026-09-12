/**
 * Tipos compartidos de contenido. TODO el contenido de la app se declara como datos
 * tipados en src/content/*.ts para que el texto sea revisable y traducible.
 */

/** Bloque de texto enriquecido. Se renderiza en orden. */
export type Block =
  | { type: 'p'; text: string }                       // párrafo (permite **negrita** y *cursiva* simples)
  | { type: 'h3'; text: string }                      // subtítulo
  | { type: 'quote'; text: string; cite?: string }    // cita de fuente antigua (Plinio, etc.)
  | { type: 'list'; items: string[] }
  | { type: 'fact'; label: string; value: string }    // dato destacado (p.ej. "Población" / "~11.000")
  | { type: 'img'; src: string; alt: string; caption?: string; credit?: string }
  | { type: 'illus'; name: IllustrationName; caption?: string } // ilustración SVG propia
  | { type: 'callout'; tone: 'tip' | 'warn' | 'info'; text: string }
  | { type: 'glossary'; term: string; def: string };

export type IllustrationName =
  | 'vesuvio' | 'foro' | 'anfiteatro' | 'columna' | 'fresco' | 'lararium'
  | 'termopolio' | 'termas' | 'domus' | 'calle' | 'plinio' | 'yeso'
  | 'gladiador' | 'anfora' | 'mosaico' | 'teatro' | 'lupanar' | 'pan'
  | 'ceniza' | 'brujula';

export interface Section {
  id: string;            // slug para URL
  title: string;
  kicker: string;        // sobretítulo corto en mayúsculas (p.ej. "CAPÍTULO 01")
  summary: string;       // 1-2 frases para la tarjeta índice
  readingMinutes: number;
  cover?: { src: string; alt: string; credit?: string } | { illus: IllustrationName };
  blocks: Block[];
}

export interface TimelineEvent {
  year: string;          // "s. VII a.C.", "79 d.C.", "1748"
  title: string;
  text: string;
}

export type StopCategory =
  | 'puerta' | 'foro' | 'templo' | 'domus' | 'villa' | 'termas' | 'comercio'
  | 'espectaculo' | 'calle' | 'necropolis' | 'servicio';

export interface Stop {
  id: string;              // slug
  order: number;           // 1..N
  name: string;
  latinName?: string;
  category: StopCategory;
  coords: [number, number]; // [lat, lng] WGS84
  regio?: string;           // p.ej. "VII.8" (Regio.Insula) si aplica
  minutes: number;          // tiempo recomendado en la parada
  walkMinutesToNext?: number;
  intro: string;            // 1 frase gancho (lo que dice el guía al llegar)
  narration: string[];      // párrafos que el guía "lee" en voz alta (2-5 párrafos, prosa cuidada)
  lookFor: string[];        // "Fíjate en…": detalles concretos que buscar con la vista
  anecdote?: string;        // curiosidad o cita antigua
  directionsToNext?: string; // indicaciones a pie hacia la siguiente parada
  image?: { src: string; alt: string; credit?: string };
  illus?: IllustrationName;
  tips?: string[];          // consejos prácticos (sombra, colas, cerrado a veces…)
  accessibility?: 'facil' | 'medio' | 'dificil';
  /** Párrafo narrado al final: por qué el recorrido sigue ahora hacia la siguiente parada (ruta completa). */
  whyNext?: string;
  /** Igual, pero para la ruta exprés (solo en paradas de la ruta exprés; la siguiente parada es distinta). */
  whyNextExpress?: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  totalHours: string;      // p.ej. "5-6 h"
  distanceKm: number;
  start: string;           // id de parada
  stops: Stop[];
  path?: [number, number][]; // polilínea opcional del recorrido completo [lat,lng]
  /** Presentación narrada de la ruta completa: lógica del itinerario (por dónde, en qué orden y por qué). */
  logic?: string[];
  /** Presentación narrada de la ruta exprés. */
  logicExpress?: string[];
}

export interface ChecklistItem { id: string; text: string; why?: string }
export interface Faq { q: string; a: string }
