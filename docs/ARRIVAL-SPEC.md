# Spec: llegada a parada (narración automática + vibración) y desambiguación por orden de ruta

## Objetivo
1. Al entrar en el radio de 40 m de una parada no visitada, la app vibra y, si el usuario ha activado la opción, abre la parada y empieza a narrar sola.
2. Si hay varias paradas a menos de 40 m, se elige la que toca según el orden de ruta (la actual `currentStop` si está entre ellas; si no, la de menor índice en `stopsForMode(mode)`), nunca "la primera que aparezca en el array".

## Restricciones
- Web Speech solo arranca tras un gesto del usuario: la narración automática es OPT-IN con un conmutador persistido. Nunca activar por defecto.
- No reintroducir audio pregrabado. Solo `speechSynthesis`.
- TS strict, sin `any`. Estilo brutalista existente (clases `box`, `kicker`, `btn`). Textos en español de España, mayúsculas en botones como el resto de la UI. Marca "Pompei".
- Guardar en disco tras cada lote. Comprobar `npm run build`, `npx playwright test`, `npx tsc --noEmit`.

## Cambios

### Lote 1 — lógica pura
- `src/lib/narratorSettings.ts`: añadir `autoplayOnArrival?: boolean` (default `false`) y `vibrateOnArrival?: boolean` (default `true`).
- Nuevo `src/lib/arrival.ts`:
  - `export const ARRIVAL_RADIUS_M = 40;`
  - `export function stopAtPosition<T extends { id: string; coords: LatLng }>(pos: LatLng | null, stops: T[], visited: Record<string, unknown>, currentStop?: string, radius = ARRIVAL_RADIUS_M): T | undefined` — candidatos = no visitados dentro del radio; si `currentStop` es candidato, devolverlo; si no, el de menor índice en `stops`. Comentario breve explicando la regla.
  - `export function vibrateArrival()`: `navigator.vibrate?.([200, 100, 200])` envuelto en try/catch.
  - Tienda `useSyncExternalStore` mínima para "última parada anunciada" (`announcedStopId`) para no vibrar dos veces por la misma parada en la misma sesión; persistir en `sessionStorage` clave `pompei-guide:arrived`.
- Sustituir en `src/pages/Visit.tsx` el `nearbyUnvisited` (find < 40) por `stopAtPosition(pos, stops, visited, currentStop)`. En `src/pages/StopPage.tsx` usar `ARRIVAL_RADIUS_M` en lugar del literal 40.

### Lote 2 — comportamiento de llegada
- En `Visit.tsx`: `useEffect` sobre `nearbyUnvisited?.id`: si hay parada y no es la ya anunciada → marcar anunciada, `vibrateArrival()` si `vibrateOnArrival`, y si `autoplayOnArrival` → `navigate(`/visita/${id}?auto=1`)`.
- En `StopPage.tsx`: leer `useSearchParams`; si `auto=1` y la parada existe → pasar `autoStart` a `<Narrator>` y limpiar el parámetro (replace) para que recargar no vuelva a arrancar. Además, si el usuario ya está en la página de la parada y `arrived` pasa a `true` con autoplay activado y esa parada no está anunciada → marcar anunciada, vibrar y `autoStart`.
- `Narrator.tsx`: nueva prop `autoStart?: boolean`; en un `useEffect` al montar (o cuando pasa a true) y `status === 'idle'` y `speechOk`, llamar a la misma función que el botón ESCUCHAR. Si `speechSynthesis` falla, mostrar el error existente sin romper.
- Conmutador en `Visit.tsx`, justo debajo de `<LocationToggle />`: componente nuevo `src/components/ArrivalToggle.tsx` con dos botones tipo `btn` con `aria-pressed`: "NARRAR AL LLEGAR" y "VIBRAR AL LLEGAR". Leen/escriben `narratorSettings`. Texto de ayuda pequeño (`mono`): "Con el GPS activo, al llegar a una parada el móvil vibra y, si lo activáis, empieza a narrar." Estilos en el CSS existente donde están los de LocationToggle.

### Lote 3 — tests
- `tests/arrival.spec.ts` (Playwright):
  1. Conmutador persiste tras recargar (`aria-pressed`).
  2. Con `context.grantPermissions(['geolocation'])` + `setGeolocation` en las coordenadas de una parada de la ruta completa y el GPS activado desde la UI (ver cómo lo hacen tests existentes en `tests/app.spec.ts`; si no hay precedente, activar el toggle de ubicación), el banner "ESTÁS EN" muestra esa parada.
  3. Desambiguación: buscar en `src/content` dos paradas a < 40 m entre sí (escribir un script rápido en el scratchpad para hallarlas); poner la posición en el punto medio y comprobar que el banner muestra la de menor orden. Si no existe tal pareja, poner la posición sobre una parada y marcar como visitada la anterior por UI; el test documenta que la elegida es la de menor orden entre las candidatas.
  4. Con autoplay activado y posición sobre una parada, la app navega a `/#/visita/<id>` (no comprobar audio: headless no tiene voces; solo que el Narrator se renderiza sin error de consola).
- Los 42 tests existentes deben seguir pasando.

## Entregable
Resumen de archivos tocados, resultado de `tsc`, `build` y `playwright` (número de tests pasados), y cualquier duda o desviación.
