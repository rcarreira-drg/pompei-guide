/** Modos de recorrido: exprés (13), completa/clásica (24) y total (clásica + todos los puntos del mapa oficial). */
import type { Stop } from '@/content/types';
import { ROUTE } from '@/content/route';
import { EXTRA_STOPS } from '@/content/extra';
import { EXPRESS_IDS } from './express';

export type RouteMode = 'express' | 'completa' | 'total';
export const MODE_LABEL: Record<RouteMode, string> = { express: 'EXPRÉS', completa: 'COMPLETA', total: 'TOTAL' };

/** Todas las paradas conocidas (clásicas + extra), sin renumerar. */
export const ALL_STOPS: Stop[] = [...ROUTE.stops, ...EXTRA_STOPS];
export const EXTRA_IDS = new Set(EXTRA_STOPS.map((s) => s.id));
export function findStop(id: string | undefined): Stop | undefined { return id ? ALL_STOPS.find((s) => s.id === id) : undefined; }

const cache = new Map<RouteMode, Stop[]>();
/** Lista ordenada del modo, con `order` renumerado 1..N para mostrar. */
export function stopsForMode(mode: RouteMode | undefined): Stop[] {
  const m: RouteMode = mode ?? 'completa';
  const hit = cache.get(m); if (hit) return hit;
  let list: Stop[];
  if (m === 'express') { const set = new Set(EXPRESS_IDS); list = ROUTE.stops.filter((s) => set.has(s.id)); }
  else if (m === 'total') list = [...ROUTE.stops, ...EXTRA_STOPS].sort((a, b) => a.order - b.order);
  else list = ROUTE.stops;
  const out = list.map((s, i) => (s.order === i + 1 ? s : { ...s, order: i + 1 }));
  cache.set(m, out);
  return out;
}
export function modeCount(mode: RouteMode): number { return stopsForMode(mode).length; }
/** Km y horas estimadas por modo (la clásica usa los datos verificados de ROUTE). */
export function modeSummary(mode: RouteMode): string {
  if (mode === 'express') return `${modeCount('express')} paradas · ~3 km · 2,5-3 h`;
  if (mode === 'total') {
    const mins = stopsForMode('total').reduce((s, x) => s + x.minutes, 0) + stopsForMode('total').length * 2;
    return `${modeCount('total')} puntos · ~8 km · ${Math.round(mins / 60)}-${Math.round(mins / 60) + 1} h (mejor en dos días)`;
  }
  return `${modeCount('completa')} paradas · ${ROUTE.distanceKm} km · ${ROUTE.totalHours}`;
}
/** Siguiente parada en el modo dado (si la parada actual no pertenece al modo, la primera posterior por `order` original). */
export function nextInMode(mode: RouteMode | undefined, stopId: string): Stop | undefined {
  const list = stopsForMode(mode);
  const i = list.findIndex((s) => s.id === stopId);
  if (i >= 0) return list[i + 1];
  const orig = findStop(stopId); if (!orig) return undefined;
  const origOrderOf = (s: Stop) => ALL_STOPS.find((x) => x.id === s.id)?.order ?? s.order;
  return list.find((s) => origOrderOf(s) > orig.order);
}
export function prevInMode(mode: RouteMode | undefined, stopId: string): Stop | undefined {
  const list = stopsForMode(mode);
  const i = list.findIndex((s) => s.id === stopId);
  if (i > 0) return list[i - 1];
  if (i === 0) return undefined;
  const orig = findStop(stopId); if (!orig) return undefined;
  const origOrderOf = (s: Stop) => ALL_STOPS.find((x) => x.id === s.id)?.order ?? s.order;
  return [...list].reverse().find((s) => origOrderOf(s) < orig.order);
}
