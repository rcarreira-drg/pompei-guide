import { Link } from 'react-router-dom';
import { Illustration } from '@/illustrations';
import Hero from '@/components/Hero';
import { SECTIONS } from '@/content/sections';
import { ROUTE } from '@/content/route';
import { CHECKLIST } from '@/content/practical';
import { useProgress } from '@/lib/useProgress';

const FACTS: { label: string; value: string }[] = [
  { label: 'ERUPCIÓN', value: '79 D.C.' },
  { label: 'SUPERFICIE', value: '66 HA' },
  { label: 'POBLACIÓN', value: '~11.000 HAB.' },
  { label: 'REDESCUBIERTA', value: '1748' },
];

export default function Home() {
  const { progress, isRead } = useProgress();
  const readCount = Object.values(progress.read).filter(Boolean).length;
  const checklistDone = Object.values(progress.checklist).filter(Boolean).length;
  const firstUnreadIndex = SECTIONS.findIndex((s) => !isRead(s.id));
  const firstUnread = firstUnreadIndex >= 0 ? SECTIONS[firstUnreadIndex] : undefined;
  const checklistPending = CHECKLIST.length > 0 && checklistDone < CHECKLIST.length;

  return (
    <div>
      <Hero kicker="PARQUE ARQUEOLÓGICO" title="POMPEYA" subtitle="Guía para antes y durante la visita" />

      <div className="container">
        <div className="home-illus box">
          <Illustration name="vesuvio" title="El Vesubio sobre la bahía de Nápoles" className="home-illus-svg" />
        </div>

        <div className="cta-grid">
          <Link to="/preparar" className="cta-card box" aria-label="Preparar la visita">
            <span className="cta-card-index mono">01</span>
            <h2>PREPARAR LA VISITA</h2>
            <p className="mono cta-card-meta">{SECTIONS.length || '—'} capítulos</p>
          </Link>
          <Link to="/visita" className="cta-card box" aria-label="Empezar el recorrido">
            <span className="cta-card-index mono">02</span>
            <h2>EMPEZAR EL RECORRIDO</h2>
            <p className="mono cta-card-meta">
              {ROUTE.stops.length || '—'} paradas · {ROUTE.totalHours}
            </p>
          </Link>
          <Link to="/practico" className="cta-card box" aria-label="Información práctica">
            <span className="cta-card-index mono">03</span>
            <h2>INFO PRÁCTICA</h2>
            <p className="mono cta-card-meta">Horarios · entradas · FAQ</p>
          </Link>
        </div>

        <div className="fact-strip-wrap">
          <div className="stripes fact-strip-band" aria-hidden="true" />
          <div className="fact-strip">
            {FACTS.map((f) => (
              <div key={f.label} className="fact-strip-item">
                <span className="kicker">{f.label}</span>
                <strong>{f.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="box status-card">
          <h3>ESTADO DE TU PREPARACIÓN</h3>
          <p className="mono">
            {readCount}/{SECTIONS.length || '—'} capítulos leídos
          </p>
          <p className="mono">
            {checklistDone}/{CHECKLIST.length || '—'} de la checklist lista
          </p>
          <div className="status-card-links">
            {firstUnread && (
              <Link to={`/preparar/${firstUnread.id}`} className="btn btn-block">
                {`Seguir leyendo → capítulo ${firstUnreadIndex + 1}`}
              </Link>
            )}
            {checklistPending && (
              <Link to="/practico?open=checklist" className="btn btn-block">
                Completar checklist
              </Link>
            )}
          </div>
        </div>

        <footer className="home-footer">
          <p className="mono">Imágenes: Wikimedia Commons (dominio público / licencias CC). Mapa © OpenStreetMap contributors.</p>
          <p className="mono">Proyecto no oficial, sin afiliación con el Parco Archeologico di Pompei.</p>
        </footer>
      </div>
    </div>
  );
}
