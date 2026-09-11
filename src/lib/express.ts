/** Ruta exprés: subconjunto de paradas imprescindibles (~2,5 h) para visitas con poco tiempo. */
import type { Stop } from '@/content/types';

export const EXPRESS_IDS = [
  'porta-marina',
  'basilica',
  'templo-apolo',
  'foro',
  'termas-foro',
  'casa-fauno',
  'casa-vettii',
  'lupanar',
  'termas-estabianas',
  'via-abbondanza',
  'teatro-grande',
  'jardin-fugitivos',
  'anfiteatro',
];

export function filterStops(stops: Stop[], express: boolean): Stop[] {
  if (!express) return stops;
  const set = new Set(EXPRESS_IDS);
  return stops.filter((s) => set.has(s.id));
}
