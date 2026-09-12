import type { IllustrationName, StopCategory } from './types';
/** Fichas propias de los puntos del plano oficial que NO tienen parada en la ruta. Clave: 'REGIO-NUM'. */
export interface OfficialEntry {
  coords?: [number, number];
  category: StopCategory;
  illus: IllustrationName;
  intro: string;
  narration: string[];   // 2-3 párrafos, 110-180 palabras
  lookFor?: string[];
  tips?: string[];
}
export const OFFICIAL_ENTRIES: Record<string, OfficialEntry> = {};
