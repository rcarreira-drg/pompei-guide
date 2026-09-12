/** Camino a pie recalculado cuando el origen se mueve más de `minMove` metros. */
import { useEffect, useRef, useState } from 'react';
import { distanceM, type LatLng } from './geo';
import { walkRoute, type WalkRoute } from './router';

export function useWalkRoute(from: LatLng | null | undefined, to: LatLng | null | undefined, minMove = 8): WalkRoute | null {
  const [route, setRoute] = useState<WalkRoute | null>(null);
  const lastFrom = useRef<LatLng | null>(null);
  const lastTo = useRef<LatLng | null>(null);
  useEffect(() => {
    if (!from || !to) { setRoute(null); lastFrom.current = null; return; }
    const movedEnough = !lastFrom.current || distanceM(lastFrom.current, from) >= minMove;
    const toChanged = !lastTo.current || lastTo.current[0] !== to[0] || lastTo.current[1] !== to[1];
    if (!movedEnough && !toChanged) return;
    lastFrom.current = from; lastTo.current = to;
    setRoute(walkRoute(from, to));
  }, [from?.[0], from?.[1], to?.[0], to?.[1], minMove]); // eslint-disable-line react-hooks/exhaustive-deps
  return route;
}
