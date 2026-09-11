import type { ChecklistItem } from '@/content/types';
import { useProgress } from '@/lib/useProgress';

export default function Checklist({ items }: { items: ChecklistItem[] }) {
  const { checklist, toggleChecklist } = useProgress();

  if (items.length === 0) {
    return <p className="empty-state box">La checklist está en preparación.</p>;
  }

  const done = items.filter((it) => checklist[it.id]).length;

  return (
    <div className="checklist">
      <p className="mono checklist-counter">
        {done}/{items.length}
      </p>
      <ul className="checklist-list">
        {items.map((it) => (
          <li key={it.id} className="checklist-item">
            <label>
              <input
                type="checkbox"
                checked={Boolean(checklist[it.id])}
                onChange={() => toggleChecklist(it.id)}
                aria-describedby={it.why ? `${it.id}-why` : undefined}
              />
              <span className="checklist-box" aria-hidden="true" />
              <span className="checklist-text">{it.text}</span>
            </label>
            {it.why && (
              <p id={`${it.id}-why`} className="checklist-why mono">
                {it.why}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
