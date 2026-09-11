/** Planificador horario: a partir de una hora de inicio calcula la hora estimada de llegada a cada parada. */
import type { Stop } from '@/content/types';
export interface PlannedStop { stop: Stop; arrive: string; leave: string; cumulativeMin: number }
const fmt = (min: number) => {
  const h = Math.floor(min / 60) % 24, m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};
export function planRoute(stops: Stop[], startHHMM: string, pace: 'tranquilo' | 'normal' | 'rapido' = 'normal', skipIds: Set<string> = new Set()): PlannedStop[] {
  const [h, m] = startHHMM.split(':').map(Number);
  const factor = pace === 'tranquilo' ? 1.3 : pace === 'rapido' ? 0.7 : 1;
  let t = h * 60 + m;
  let cum = 0;
  const out: PlannedStop[] = [];
  const active = stops.filter(s => !skipIds.has(s.id));
  active.forEach((s, i) => {
    const arrive = t;
    const stay = Math.round(s.minutes * factor);
    t += stay; cum += stay;
    const walk = i < active.length - 1 ? (s.walkMinutesToNext ?? 5) : 0;
    out.push({ stop: s, arrive: fmt(arrive), leave: fmt(t), cumulativeMin: cum });
    t += walk; cum += walk;
  });
  return out;
}
export function totalMinutes(plan: PlannedStop[]): number { return plan.length ? plan[plan.length - 1].cumulativeMin : 0; }
