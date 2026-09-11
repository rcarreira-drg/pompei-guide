import { useMemo, useState } from 'react';

export interface GlossaryTerm {
  term: string;
  def: string;
}

export default function Glossary({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter((t) => t.term.toLowerCase().includes(q) || t.def.toLowerCase().includes(q));
  }, [terms, query]);

  if (terms.length === 0) {
    return <p className="empty-state box">El glosario está en preparación.</p>;
  }

  return (
    <div className="glossary">
      <input
        type="search"
        className="glossary-input mono"
        placeholder="BUSCAR TÉRMINO…"
        aria-label="Buscar en el glosario"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {filtered.length === 0 ? (
        <p className="empty-state box">Sin resultados para "{query}".</p>
      ) : (
        <dl className="glossary-list">
          {filtered.map((t) => (
            <div key={t.term} className="glossary-item">
              <dt className="mono">{t.term}</dt>
              <dd>{t.def}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
