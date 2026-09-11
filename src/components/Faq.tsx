import type { Faq as FaqItem } from '@/content/types';

export default function Faq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) {
    return <p className="empty-state box">Las preguntas frecuentes están en preparación.</p>;
  }
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={i} className="faq-item box">
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
