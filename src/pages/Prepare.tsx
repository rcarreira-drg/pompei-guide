import Hero from '@/components/Hero';
import SectionCard from '@/components/SectionCard';
import Timeline from '@/components/Timeline';
import Glossary from '@/components/Glossary';
import { SECTIONS } from '@/content/sections';
import { TIMELINE } from '@/content/timeline';
import { GLOSSARY } from '@/content/glossary';
import { useProgress } from '@/lib/useProgress';

export default function Prepare() {
  const { isRead } = useProgress();

  return (
    <div>
      <Hero kicker="ANTES DE VIAJAR" title="PREPARAR" subtitle="Contexto histórico en capítulos breves" />

      <div className="container">
        <nav className="anchor-nav mono" aria-label="Secciones de esta página">
          <a href="#capitulos">CAPÍTULOS</a>
          <a href="#cronologia">CRONOLOGÍA</a>
          <a href="#glosario">GLOSARIO</a>
        </nav>

        <section id="capitulos" aria-labelledby="capitulos-h">
          <h2 id="capitulos-h" className="section-title">
            CAPÍTULOS
          </h2>
          {SECTIONS.length === 0 ? (
            <p className="empty-state box">Contenido en preparación.</p>
          ) : (
            <div className="section-list">
              {SECTIONS.map((s, i) => (
                <SectionCard key={s.id} section={s} index={i} total={SECTIONS.length} read={isRead(s.id)} />
              ))}
            </div>
          )}
        </section>

        <hr className="rule" />

        <section id="cronologia" aria-labelledby="cronologia-h">
          <h2 id="cronologia-h" className="section-title">
            CRONOLOGÍA
          </h2>
          <Timeline events={TIMELINE} />
        </section>

        <hr className="rule" />

        <section id="glosario" aria-labelledby="glosario-h">
          <h2 id="glosario-h" className="section-title">
            GLOSARIO
          </h2>
          <Glossary terms={GLOSSARY} />
        </section>
      </div>
    </div>
  );
}
