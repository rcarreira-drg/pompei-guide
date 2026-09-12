import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Hero from '@/components/Hero';
import Blocks from '@/components/Blocks';
import Checklist from '@/components/Checklist';
import Faq from '@/components/Faq';
import WeatherCard from '@/components/WeatherCard';
import { CHECKLIST, FAQS, PRACTICAL_SECTIONS } from '@/content/practical';

export default function Practical() {
  const [searchParams] = useSearchParams();
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(PRACTICAL_SECTIONS[0] ? [PRACTICAL_SECTIONS[0].id] : []));
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  // Enlaces externos (p.ej. desde Home "Completar checklist") pueden pedir abrir y
  // desplazar hasta una sección concreta mediante ?open=<id>.
  useEffect(() => {
    const openParam = searchParams.get('open');
    if (openParam) {
      setOpenIds((prev) => {
        if (prev.has(openParam)) return prev;
        const next = new Set(prev);
        next.add(openParam);
        return next;
      });
      setScrollTarget(openParam);
    }
    // Solo al montar / si cambia el parámetro: no relanzar en cada click de acordeón.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!scrollTarget) return;
    const el = document.getElementById(scrollTarget);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setScrollTarget(null);
  }, [scrollTarget, openIds]);

  const goToSection = (id: string) => {
    setOpenIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setScrollTarget(id);
  };

  const toggleSection = (id: string, isOpen: boolean) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (isOpen) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div>
      <Hero kicker="INFO PRÁCTICA" title="PRÁCTICO" subtitle="Horarios, entradas, consejos y dudas frecuentes" />

      <div className="container">
        <Link to="/ayuda" className="tag practical-howto-chip">¿CÓMO FUNCIONA?</Link>

        {PRACTICAL_SECTIONS.length === 0 ? (
          <p className="empty-state box">Contenido en preparación.</p>
        ) : (
          <>
            <nav className="tabs-nav mono practical-chips" aria-label="Ir a una sección">
              {PRACTICAL_SECTIONS.map((section) => (
                <button key={section.id} type="button" className="tab-btn" onClick={() => goToSection(section.id)}>
                  {section.title}
                </button>
              ))}
            </nav>

            <div className="practical-accordion-list">
              {PRACTICAL_SECTIONS.map((section) => (
                <details
                  key={section.id}
                  id={section.id}
                  className="practical-accordion box"
                  open={openIds.has(section.id)}
                  onToggle={(e) => toggleSection(section.id, e.currentTarget.open)}
                >
                  <summary>
                    <span className="kicker">{section.kicker}</span>
                    <h2>{section.title}</h2>
                  </summary>
                  <div className="practical-accordion-body">
                    <Blocks blocks={section.blocks} />
                  </div>
                </details>
              ))}
            </div>
          </>
        )}

        <details id="tiempo" className="practical-accordion box" open>
          <summary>
            <span className="kicker">PREVISIÓN 7 DÍAS</span>
            <h2>EL TIEMPO EN POMPEI</h2>
          </summary>
          <div className="practical-accordion-body">
            <WeatherCard />
          </div>
        </details>

        <details id="checklist" className="practical-accordion box" open>
          <summary>
            <span className="kicker">A PUNTO</span>
            <h2>CHECKLIST</h2>
          </summary>
          <div className="practical-accordion-body">
            <Checklist items={CHECKLIST} />
          </div>
        </details>

        <details id="faq" className="practical-accordion box">
          <summary>
            <span className="kicker">DUDAS</span>
            <h2>PREGUNTAS FRECUENTES</h2>
          </summary>
          <div className="practical-accordion-body">
            <Faq items={FAQS} />
          </div>
        </details>
      </div>
    </div>
  );
}
