/** Alterna entre la ruta completa (24 paradas) y la ruta exprés (13 paradas, ~2,5 h). */
import { useProgress } from '@/lib/useProgress';
import { EXPRESS_IDS } from '@/lib/express';

export default function ExpressToggle() {
  const { mode, setMode } = useProgress();
  const current = mode ?? 'completa';

  return (
    <div className="express-toggle" role="group" aria-label="Elegir tipo de ruta">
      <button
        type="button"
        className={`btn express-toggle-btn${current === 'completa' ? ' btn-primary' : ''}`}
        aria-pressed={current === 'completa'}
        onClick={() => setMode('completa')}
      >
        COMPLETA (24)
      </button>
      <button
        type="button"
        className={`btn express-toggle-btn${current === 'express' ? ' btn-accent' : ''}`}
        aria-pressed={current === 'express'}
        onClick={() => setMode('express')}
      >
        EXPRÉS ({EXPRESS_IDS.length})
      </button>
    </div>
  );
}
