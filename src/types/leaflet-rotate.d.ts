import 'leaflet';
declare module 'leaflet' {
  interface MapOptions { rotate?: boolean; touchRotate?: boolean; rotateControl?: boolean | object; bearing?: number; shiftKeyRotate?: boolean; compassBearing?: boolean; trackContainerMutation?: boolean }
  interface Map { setBearing(deg: number): this; getBearing(): number }
}
