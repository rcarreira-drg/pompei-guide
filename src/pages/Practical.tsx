import Hero from '@/components/Hero';
import Blocks from '@/components/Blocks';
import Checklist from '@/components/Checklist';
import Faq from '@/components/Faq';
import { CHECKLIST, FAQS, PRACTICAL_SECTIONS } from '@/content/practical';

export default function Practical() {
  return (
    <div>
      <Hero kicker="INFO PRÁCTICA" title="PRÁCTICO" subtitle="Horarios, entradas, consejos y dudas frecuentes" />

      <div className="container">
        {PRACTICAL_SECTIONS.length === 0 ? (
          <p className="empty-state box">Contenido en preparación.</p>
        ) : (
          <div className="practical-accordion-list">
            {PRACTICAL_SECTIONS.map((section) => (
              <details key={section.id} className="practical-accordion box" open>
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
        )}

        <hr className="rule" />
        <h2 className="section-title">CHECKLIST</h2>
        <Checklist items={CHECKLIST} />

        <hr className="rule" />
        <h2 className="section-title">PREGUNTAS FRECUENTES</h2>
        <Faq items={FAQS} />
      </div>
    </div>
  );
}
