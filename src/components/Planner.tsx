/** Planificador horario de la visita: hora de inicio, ritmo y Villa de los Misterios opcional. */
import { useEffect, useMemo, useState } from 'react';
import type { Stop } from '@/content/types';
import { planRoute, totalMinutes } from '@/lib/planner';
import { useProgress } from '@/lib/useProgress';

const VILLA_ID = 'villa-misterios';
type Pace = 'tranquilo' | 'normal' | 'rapido';

function isSummer(month: number) {
  // meses 4 (abril) a 10 (octubre): horario de verano del parque arqueológico
  return month >= 4 && month <= 10;
}

function fmtDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

export default function Planner({ stops }: { stops: Stop[] }) {
  const { plan, setPlan } = useProgress();
  const [start, setStart] = useState(plan?.start ?? '09:00');
  const [pace, setPace] = useState<Pace>((plan?.pace as Pace) ?? 'normal');
  const [villa, setVilla] = useState(plan?.villa ?? false);

  useEffect(() => {
    setPlan({ start, pace, villa });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, pace, villa]);

  const skipIds = useMemo(() => {
    const s = new Set<string>();
    if (!villa) s.add(VILLA_ID);
    return s;
  }, [villa]);

  const planned = useMemo(() => planRoute(stops, start, pace, skipIds), [stops, start, pace, skipIds]);
  const total = totalMinutes(planned);
  const finish = planned.length ? planned[planned.length - 1].leave : start;

  const closing = isSummer(new Date().getMonth() + 1) ? '19:00' : '17:00';
  const [fh, fm] = finish.split(':').map(Number);
  const [ch, cm] = closing.split(':').map(Number);
  const overtime = fh * 60 + fm > ch * 60 + cm;

  return (
    <div className="planner box">
      <div className="planner-controls">
        <label className="planner-field">
          <span className="mono planner-label">HORA DE INICIO</span>
          <input
            type="time"
            className="planner-input"
            value={start}
            onChange={(e) => setStart(e.target.value || '09:00')}
          />
        </label>

        <div className="planner-field">
          <span className="mono planner-label">RITMO</span>
          <div className="planner-pace-group">
            {(['tranquilo', 'normal', 'rapido'] as Pace[]).map((p) => (
              <button
                key={p}
                type="button"
                className={`btn planner-pace-btn${pace === p ? ' planner-pace-btn--active' : ''}`}
                aria-pressed={pace === p}
                onClick={() => setPace(p)}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <label className="planner-checkbox">
          <input type="checkbox" checked={villa} onChange={(e) => setVilla(e.target.checked)} />
          <span className="checklist-box" aria-hidden="true" />
          <span>Incluir Villa de los Misterios</span>
        </label>
      </div>

      <div className="planner-table-wrap">
        <table className="planner-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Parada</th>
              <th>Llegada</th>
              <th>Salida</th>
            </tr>
          </thead>
          <tbody>
            {planned.map((p, i) => (
              <tr key={p.stop.id}>
                <td className="mono">{i + 1}</td>
                <td>{p.stop.name}</td>
                <td className="mono">{p.arrive}</td>
                <td className="mono">{p.leave}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="planner-finish mono">
        FIN ESTIMADO {finish} · TOTAL {fmtDuration(total)}
      </p>

      {overtime && (
        <div className="callout callout--warn planner-warning">
          <p>
            El recorrido terminaría después del cierre habitual ({closing}). Empieza antes, acelera el ritmo o deja
            alguna parada para otra visita.
          </p>
        </div>
      )}
    </div>
  );
}
