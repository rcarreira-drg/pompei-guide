import { Link, useNavigate, useParams } from 'react-router-dom';
import Blocks from '@/components/Blocks';
import Narrator from '@/components/Narrator';
import Compass from '@/components/Compass';
import RouteMap from '@/components/RouteMap';
import { Illustration } from '@/illustrations';
import { img } from '@/content/images';
import { ROUTE } from '@/content/route';
import { useGeolocation } from '@/lib/useGeolocation';
import { useProgress } from '@/lib/useProgress';
import { resolveCredit } from '@/lib/credit';
import StopNotes from '@/components/StopNotes';
import { useWalkRoute } from '@/lib/useWalkRoute';
import LocationToggle from '@/components/LocationToggle';
import { formatDistance, walkMinutes } from '@/lib/geo';
import type { Block } from '@/content/types';

const LONG_WORD_LENGTH = 12;
const hasLongWord = (text: string) => text.split(/\s+/).some((w) => w.length > LONG_WORD_LENGTH);

export default function StopPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pos } = useGeolocation();
  const nextForRoute = ROUTE.stops.find((x) => x.order === (ROUTE.stops.find((y) => y.id === id)?.order ?? 0) + 1) ?? null;
  const walk = useWalkRoute(pos ?? ROUTE.stops.find((y) => y.id === id)?.coords ?? null, nextForRoute?.coords ?? null);
  const { visited, markVisited, setCurrentStop } = useProgress();

  const stops = ROUTE.stops;
  const index = stops.findIndex((s) => s.id === id);
  const stop = index >= 0 ? stops[index] : undefined;

  if (!stop) {
    return (
      <div className="container">
        <p className="kicker">PARADA NO ENCONTRADA</p>
        <h1 className="hero-title">VAYA</h1>
        <p>Esta parada todavía no existe o está en preparación.</p>
        <Link to="/visita" className="btn btn-primary">{`← VOLVER AL RECORRIDO`}</Link>
      </div>
    );
  }

  const prev = index > 0 ? stops[index - 1] : undefined;
  const next = index < stops.length - 1 ? stops[index + 1] : undefined;
  const isVisited = Boolean(visited[stop.id]);
  const imgSrc = stop.image
    ? stop.image.src.startsWith('http') || stop.image.src.startsWith('/')
      ? stop.image.src
      : img(stop.image.src)
    : undefined;
  const imgCredit = stop.image ? resolveCredit(stop.image.src, stop.image.credit) : undefined;
  const longTitle = hasLongWord(stop.name);

  const tipsBlocks: Block[] = (stop.tips ?? []).map((t) => ({ type: 'callout', tone: 'tip', text: t }));

  const handleNext = () => {
    markVisited(stop.id);
    if (next) {
      setCurrentStop(next.id);
      navigate(`/visita/${next.id}`);
    } else {
      setCurrentStop(undefined);
      navigate('/visita');
    }
  };

  return (
    <div className={next ? 'has-next-sticky' : ''}>
      <header className="stop-hero container">
        <p className="kicker">
          PARADA {stop.order}/{stops.length}
        </p>
        <h1 className={`hero-title${longTitle ? ' hero-title--long' : ''}`}>{stop.name}</h1>
        {(stop.latinName || stop.regio) && (
          <p className="mono stop-subtitle">
            {stop.latinName}
            {stop.latinName && stop.regio ? ' · ' : ''}
            {stop.regio}
          </p>
        )}
      </header>

      <div className="container">
        <div className="stop-media">
          {imgSrc ? (
            <img src={imgSrc} alt={stop.image?.alt ?? stop.name} loading="lazy" className="stop-media-img" />
          ) : stop.illus ? (
            <div className="illus-frame stop-illus-frame">
              <Illustration name={stop.illus} title={stop.name} />
            </div>
          ) : (
            <div className="stripes stop-media-img" role="img" aria-label={stop.name} />
          )}
          {imgCredit && (
            <p className="mono img-credit">
              {imgCredit.url ? (
                <a href={imgCredit.url} target="_blank" rel="noopener noreferrer">
                  {imgCredit.text}
                </a>
              ) : (
                imgCredit.text
              )}
            </p>
          )}
        </div>


        <Narrator stopId={stop.id} intro={stop.intro} paragraphs={stop.narration} title={stop.name} />

        {stop.lookFor.length > 0 && (
          <section>
            <h2 className="section-title">FÍJATE EN</h2>
            <ul className="brutal-list look-for-list">
              {stop.lookFor.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {stop.anecdote && <Blocks blocks={[{ type: 'quote', text: stop.anecdote }]} />}

        {tipsBlocks.length > 0 && <Blocks blocks={tipsBlocks} />}

        {next && (
          <section className="box next-directions" id="siguiente">
            <h2 className="section-title">CÓMO LLEGAR A LA SIGUIENTE</h2>
            <p className="next-directions-target">
              <span className="kicker">PARADA {next.order}</span>
              <strong>{next.name}</strong>
            </p>
            <RouteMap
              stops={[stop, next]}
              currentId={next.id}
              visited={visited}
              userPos={pos}
              walk={walk?.path ?? null}
              follow
              height="38vh"
            />
            {walk && (
              <p className="mono walk-summary">
                {pos ? 'DESDE TU POSICIÓN' : 'DESDE ESTA PARADA'} · {formatDistance(walk.distance)} · ≈ {walkMinutes(walk.distance)} min a pie
                {walk.offNetwork ? ' · en línea recta' : ' · por las calles del parque'}
              </p>
            )}
            {stop.directionsToNext && <p>{stop.directionsToNext}</p>}
            <LocationToggle label="ACTIVAR UBICACIÓN PARA SEGUIR EL CAMINO" />
            <Compass target={next.coords} userPos={pos} label={next.name} compact />
          </section>
        )}

        <div className="stop-actions">
          <button
            type="button"
            className="btn btn-accent btn-block"
            onClick={handleNext}
            aria-label="Marcar esta parada como visitada e ir a la siguiente"
          >
            {isVisited ? 'SIGUIENTE PARADA →' : 'MARCAR VISITADA Y SIGUIENTE'}
          </button>
          <nav className="section-pager" aria-label="Navegación entre paradas">
            {prev ? (
              <Link to={`/visita/${prev.id}`} className="btn">{`← ${prev.name}`}</Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={`/visita/${next.id}`} className="btn">{`${next.name} →`}</Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        <StopNotes stopId={stop.id} />

        {!next && (
          <>
            <h2 className="section-title">UBICACIÓN</h2>
            <RouteMap stops={[stop]} currentId={stop.id} visited={visited} userPos={pos} height="30vh" />
          </>
        )}
      </div>
      {next && (
        <a href="#siguiente" className="next-sticky" onClick={(e) => { e.preventDefault(); document.getElementById('siguiente')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} aria-label={`Ir a las indicaciones hacia ${next.name}`}>
          <span className="kicker">SIGUIENTE →</span>
          <strong>{next.name}</strong>
          {walk && <span className="mono next-sticky-dist">{formatDistance(walk.distance)} · {walkMinutes(walk.distance)} min</span>}
        </a>
      )}
    </div>
  );
}
