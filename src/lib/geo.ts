/** Utilidades geográficas (Haversine, rumbo, formato). */
export type LatLng = [number, number];
const R = 6371000;
const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

export function distanceM(a: LatLng, b: LatLng): number {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const la1 = toRad(a[0]), la2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
export function bearingDeg(a: LatLng, b: LatLng): number {
  const la1 = toRad(a[0]), la2 = toRad(b[0]);
  const dLng = toRad(b[1] - a[1]);
  const y = Math.sin(dLng) * Math.cos(la2);
  const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
export function formatDistance(m: number): string {
  return m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`;
}
export function walkMinutes(m: number): number { return Math.max(1, Math.round(m / 75)); } // ~4,5 km/h
export function compassLabel(deg: number): string {
  const labels = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return labels[Math.round(deg / 45) % 8];
}
/** Centro y bounds del parque para el mapa */
export const PARK_CENTER: LatLng = [40.7505, 14.4865];
export const PARK_BOUNDS: [LatLng, LatLng] = [[40.7440, 14.4740], [40.7570, 14.5000]];
