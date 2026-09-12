/**
 * Plano oficial: elige Regio y número como en el plano de papel del parque y escucha el relato.
 * Los puntos con parada en la ruta enlazan a su ficha; el resto tienen ficha propia (OFFICIAL_ENTRIES).
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Hero from '@/components/Hero';
import Narrator from '@/components/Narrator';
import RouteMap from '@/components/RouteMap';
import { Illustration } from '@/illustrations';
import { OFFICIAL_LEGEND, REGIO_META, legendKey, type LegendItem, type Regio } from '@/content/official';
import { OFFICIAL_ENTRIES } from '@/content/official-entries';
import { findStop } from '@/lib/modes';
import { useProgress } from '@/lib/useProgress';
import { useGeolocation } from '@/lib/useGeolocation';
import { useHeading } from '@/lib/useHeading';
import { distanceM, formatDistance } from '@/lib/geo';
import type { Stop } from '@/content/types';

const REGIOS: Regio[] = ['I', 'II', 'III', 'V', 'VI', 'VII', 'VIII', 'IX'];
const LAST_KEY = 'pompei-guide:official-regio';

export default function OfficialMap() {
  const { key } = useParams<{ key?: string }>();
  const navigate = useNavigate();
  const { visited } = useProgress();
  const { pos } = useGeolocation();
  const { heading } = useHeading();

  const selected = useMemo(() => OFFICIAL_LEGEND.find((i) => legendKey(i) === key), [key]);
  const regio: Regio = selected?.regio ?? ((() => { try { return (sessionStorage.getItem(LAST_KEY) as Regio) || 'VII'; } catch { return 'VII'; } })());
  useEffect(() => { try { sessionStorage.setItem(LAST_KEY, regio); } catch { /* ignore */ } }, [regio]);
  const items = OFFICIAL_LEGEND.filter((i) => i.regio === regio);
  const [q, setQ] = useState('');
  const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const results = useMemo(() => {
    const n = norm(q.trim());
    if (n.length < 2) return [];
    return OFFICIAL_LEGEND.filter((i) => norm(i.es).includes(n) || norm(i.it).includes(n) || `${i.regio.toLowerCase()}-${i.num}` === n || `${i.regio.toLowerCase()} ${i.num}` === n).slice(0, 12);
  }, [q]);

  // Punto más cercano a la posición actual (para orientarse con el plano en la mano)
  const nearest = useMemo(() => {
    if (!pos) return undefined;
    let best: { item: LegendItem; d: number } | undefined;
    for (const i of OFFICIAL_LEGEND) {
      const c = coordsOf(i); if (!c) continue;
      const d = distanceM(pos, c);
      if (!best || d < best.d) best = { item: i, d };
    }
    return best;
  }, [pos]);

  return (
    <div className="official">
      <Hero kicker="PIANTA DEGLI SCAVI" title="PLANO OFICIAL" subtitle="Elige la Regio y el número que ves en el plano de papel y escucha su relato" />
      <div className="container">
        {nearest && nearest.d < 120 && (
          <Link to={`/mapa/${legendKey(nearest.item)}`} className="box banner-here official-nearest">
            <span className="kicker">EL PUNTO MÁS CERCANO A TI</span>
            <strong>{nearest.item.regio}·{nearest.item.num} {nearest.item.es}</strong>
            <span className="mono">{formatDistance(nearest.d)}</span>
          </Link>
        )}

        <label className="official-search">
          <span className="kicker">BUSCAR</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre o código, p. ej. Lupanar o VII 18"
            aria-label="Buscar punto del plano por nombre o código"
            className="official-search-input"
          />
        </label>
        {results.length > 0 && (
          <ul className="official-results">
            {results.map((i) => (
              <li key={legendKey(i)}>
                <Link to={`/mapa/${legendKey(i)}`} onClick={() => setQ('')} className="official-result" style={{ ['--regio' as string]: REGIO_META[i.regio].color }}>
                  <span className="legend-num">{i.regio}·{i.num}</span>
                  <span>{i.es}<small className="mono"> {i.it}</small></span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="regio-tabs" role="tablist" aria-label="Regiones del plano">
          {REGIOS.map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={r === regio}
              className={`regio-tab ${r === regio ? 'is-on' : ''}`}
              style={{ ['--regio' as string]: REGIO_META[r].color }}
              onClick={() => navigate(`/mapa/${legendKey(OFFICIAL_LEGEND.find((i) => i.regio === r)!)}`, { replace: true })}
            >
              {r}
            </button>
          ))}
        </div>
        <p className="mono regio-area">{REGIO_META[regio].label} · {REGIO_META[regio].area}</p>

        <ol className="legend-grid" aria-label={`Puntos de la ${REGIO_META[regio].label}`}>
          {items.map((i) => {
            const k = legendKey(i);
            const stop = i.stopId ? findStop(i.stopId) : undefined;
            const done = stop ? Boolean(visited[stop.id]) : false;
            return (
              <li key={k}>
                <Link
                  to={`/mapa/${k}`}
                  className={`legend-cell ${k === key ? 'is-on' : ''} ${done ? 'is-done' : ''}`}
                  style={{ ['--regio' as string]: REGIO_META[i.regio].color }}
                  aria-current={k === key ? 'true' : undefined}
                >
                  <span className="legend-num">{i.num}</span>
                  <span className="legend-name">{i.es}</span>
                  {i.accessible && <span className="legend-acc" title="Itinerario accesible" aria-label="accesible">♿</span>}
                </Link>
              </li>
            );
          })}
        </ol>

        {selected && <EntryPanel item={selected} pos={pos} heading={heading} />}
      </div>
    </div>
  );
}

function coordsOf(i: LegendItem): [number, number] | undefined {
  const stop = i.stopId ? findStop(i.stopId) : undefined;
  return stop?.coords ?? OFFICIAL_ENTRIES[legendKey(i)]?.coords;
}

function EntryPanel({ item, pos, heading }: { item: LegendItem; pos: [number, number] | null; heading: number | null }) {
  const k = legendKey(item);
  const stop = item.stopId ? findStop(item.stopId) : undefined;
  const entry = OFFICIAL_ENTRIES[k];
  const coords = coordsOf(item);
  const texts = stop ? [stop.intro, ...stop.narration] : entry ? [entry.intro, ...entry.narration] : [];
  const illus = stop?.illus ?? entry?.illus;
  const mapStop: Stop | undefined = stop ?? (coords && entry ? {
    id: `official-${k}`, order: Number(item.num.replace(/\D/g, '')) || 0, name: item.es, category: entry.category, coords, minutes: 5, intro: entry.intro, narration: entry.narration, lookFor: entry.lookFor ?? [],
  } : undefined);

  useEffect(() => { document.getElementById('entry-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [k]);

  return (
    <section id="entry-panel" className="entry-panel box" style={{ ['--regio' as string]: REGIO_META[item.regio].color }}>
      <p className="kicker entry-kicker"><span className="entry-badge">{item.regio}·{item.num}</span> {item.it}</p>
      <h2 className="entry-title">{item.es}</h2>
      {stop && (
        <p className="entry-links">
          <Link to={`/visita/${stop.id}`} className="btn btn-primary">FICHA COMPLETA DE LA PARADA →</Link>
        </p>
      )}
      {illus && !stop?.image && (
        <div className="stop-illus-frame entry-illus"><Illustration name={illus} title={item.es} /></div>
      )}
      {texts.length > 0 ? (
        <Narrator texts={texts} title={`${item.regio}·${item.num} ${item.es}`} compactHeader />
      ) : (
        <p className="callout callout--info">Este punto del plano aún no tiene relato. Lo tendrá en una próxima actualización.</p>
      )}
      {(entry?.lookFor?.length || stop?.lookFor?.length) ? (
        <>
          <h3 className="section-title">FÍJATE EN</h3>
          <ul className="brutal-list look-for-list">{(stop?.lookFor ?? entry?.lookFor ?? []).map((t, i) => <li key={i}>{t}</li>)}</ul>
        </>
      ) : null}
      {(entry?.tips ?? stop?.tips)?.map((t, i) => <p key={i} className="callout callout--tip">{t}</p>)}
      {mapStop && <RouteMap stops={[mapStop]} currentId={mapStop.id} userPos={pos} heading={heading} height="34vh" fitExtra={pos ? [pos] : []} />}
    </section>
  );
}
