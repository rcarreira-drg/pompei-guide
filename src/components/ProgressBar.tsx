export default function ProgressBar({ visited, total }: { visited: number; total: number }) {
  const blocks = Array.from({ length: Math.max(total, 1) });
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={visited}
      aria-valuemin={0}
      aria-valuemax={Math.max(total, 1)}
      aria-label={`Progreso del recorrido: ${visited} de ${total} paradas visitadas`}
    >
      <div className="progress-blocks">
        {blocks.map((_, i) => (
          <span key={i} className={`progress-block ${i < visited ? 'is-filled' : ''}`} />
        ))}
      </div>
      <p className="mono progress-label">
        {visited}/{total} PARADAS
      </p>
    </div>
  );
}
