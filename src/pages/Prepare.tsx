import { useSearchParams } from 'react-router-dom';
import Hero from '@/components/Hero';
import SectionCard from '@/components/SectionCard';
import Timeline from '@/components/Timeline';
import Glossary from '@/components/Glossary';
import Quiz from '@/components/Quiz';
import { SECTIONS } from '@/content/sections';
import { TIMELINE } from '@/content/timeline';
import { GLOSSARY } from '@/content/glossary';
import { useProgress } from '@/lib/useProgress';

type TabId = 'capitulos' | 'cronologia' | 'glosario' | 'quiz';

const TABS: { id: TabId; label: string }[] = [
  { id: 'capitulos', label: 'CAPÍTULOS' },
  { id: 'cronologia', label: 'CRONOLOGÍA' },
  { id: 'glosario', label: 'GLOSARIO' },
  { id: 'quiz', label: 'QUIZ' },
];

export default function Prepare() {
  const { isRead } = useProgress();
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const tab: TabId = TABS.some((t) => t.id === rawTab) ? (rawTab as TabId) : 'capitulos';

  const goToTab = (id: TabId) => {
    setSearchParams(id === 'capitulos' ? {} : { tab: id });
  };

  return (
    <div>
      <Hero
        kicker="ANTES DE VIAJAR"
        title="PREPARAR"
        subtitle="Ocho capítulos de historia y contexto, cronología, glosario y quiz"
      />

      <div className="container">
        <div className="tabs-nav mono" role="tablist" aria-label="Secciones de esta página">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              className={`tab-btn ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => goToTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'capitulos' && (
          <section id="panel-capitulos" role="tabpanel" aria-labelledby="tab-capitulos">
            <h2 className="section-title">CAPÍTULOS</h2>
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
        )}

        {tab === 'cronologia' && (
          <section id="panel-cronologia" role="tabpanel" aria-labelledby="tab-cronologia">
            <h2 className="section-title">CRONOLOGÍA</h2>
            <Timeline events={TIMELINE} />
          </section>
        )}

        {tab === 'glosario' && (
          <section id="panel-glosario" role="tabpanel" aria-labelledby="tab-glosario">
            <h2 className="section-title">GLOSARIO</h2>
            <Glossary terms={GLOSSARY} />
          </section>
        )}

        {tab === 'quiz' && (
          <section id="panel-quiz" role="tabpanel" aria-labelledby="tab-quiz">
            <h2 className="section-title">QUIZ</h2>
            <Quiz />
          </section>
        )}
      </div>
    </div>
  );
}
