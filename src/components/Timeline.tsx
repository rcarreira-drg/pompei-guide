import type { TimelineEvent } from '@/content/types';

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="empty-state box">La cronología está en preparación.</p>;
  }
  return (
    <ol className="timeline">
      {events.map((e, i) => (
        <li key={i} className="timeline-item">
          <span className="timeline-year mono">{e.year}</span>
          <div className="timeline-body">
            <h4>{e.title}</h4>
            <p>{e.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
