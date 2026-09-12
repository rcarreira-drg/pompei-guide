/** Selector de modo de recorrido: exprés (13), completa (24) o total (todos los puntos del mapa oficial). */
import { useProgress } from '@/lib/useProgress';
import { modeCount, type RouteMode } from '@/lib/modes';

const OPTIONS: { mode: RouteMode; label: string; hint: string }[] = [
  { mode: 'express', label: 'EXPRÉS', hint: '2,5-3 h · lo imprescindible' },
  { mode: 'completa', label: 'COMPLETA', hint: '5-7 h · la ruta guiada' },
  { mode: 'total', label: 'TOTAL', hint: 'todos los puntos del mapa oficial' },
];

export default function ExpressToggle() {
  const { mode, setMode } = useProgress();
  const current: RouteMode = (mode as RouteMode) ?? 'completa';
  return (
    <div className="express-toggle express-toggle--3" role="group" aria-label="Elegir tipo de ruta">
      {OPTIONS.map((o) => (
        <button
          key={o.mode}
          type="button"
          className={`btn express-toggle-btn${current === o.mode ? (o.mode === 'express' ? ' btn-accent' : o.mode === 'total' ? ' btn-ochre' : ' btn-primary') : ''}`}
          aria-pressed={current === o.mode}
          onClick={() => setMode(o.mode)}
        >
          <span>{o.label} ({modeCount(o.mode)})</span>
          <small className="mono">{o.hint}</small>
        </button>
      ))}
    </div>
  );
}
