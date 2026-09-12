/** Diploma brutalista que se muestra al completar todas las paradas de la ruta. */

function elapsedLabel(startedAt: string): string {
  const ms = Date.now() - new Date(startedAt).getTime();
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h <= 0) return `${m} min`;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

export default function Diploma({
  visitedCount,
  total,
  startedAt,
}: {
  visitedCount: number;
  total: number;
  startedAt?: string;
}) {
  if (total <= 0 || visitedCount < total) return null;

  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const shareText = `He completado la ruta de Pompei visitando las ${total} paradas. ¡VISITADA · POMPEII · 79 D.C.!`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: 'Diploma de Pompei' });
        return;
      } catch {
        /* el usuario canceló o falló: seguimos al fallback */
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="diploma">
      <div className="diploma-seal" aria-hidden="true">
        <span>VISITADA</span>
        <span>POMPEII</span>
        <span>79 D.C.</span>
      </div>
      <p className="kicker diploma-kicker">DIPLOMA DE VISITANTE</p>
      <h3 className="diploma-title">RUTA COMPLETADA</h3>
      <p className="diploma-text">
        Has recorrido las {total} paradas de la ruta clásica de Pompei, desde la Porta Marina hasta el final del
        recorrido, siguiendo los mismos pasos que sus antiguos habitantes.
      </p>
      <p className="mono diploma-meta">FECHA: {today.toUpperCase()}</p>
      {startedAt && <p className="mono diploma-meta">TIEMPO TRANSCURRIDO: {elapsedLabel(startedAt).toUpperCase()}</p>}
      <button type="button" className="btn btn-block diploma-share" onClick={share}>
        COMPARTIR
      </button>
    </div>
  );
}
