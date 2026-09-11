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
import type { Block } from '@/content/types';

export default function StopPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pos } = useGeolocation();
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
    <div>
      <header className="stop-hero container">
        <p className="kicker">
          PARADA {stop.order}/{stops.length}
        </p>
        <h1 className="hero-title">{stop.name}</h1>
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
            <div className="illus-frame">
              <Illustration name={stop.illus} title={stop.name} />
            </div>
          ) : (
            <div className="stripes stop-media-img" role="img" aria-label={stop.name} />
          )}
          {stop.image?.credit && <p className="mono img-credit">{stop.image.credit}</p>}
        </div>

        <p className="stop-intro">{stop.intro}</p>

        <Narrator paragraphs={stop.narration} />

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

        {stop.directionsToNext && (
          <section className="box next-directions">
            <h2 className="section-title">CÓMO LLEGAR A LA SIGUIENTE</h2>
            <p>{stop.directionsToNext}</p>
            {stop.walkMinutesToNext != null && <p className="mono">≈ {stop.walkMinutesToNext} min a pie</p>}
            {next && <Compass target={next.coords} userPos={pos} label={next.name} compact />}
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

        <h2 className="section-title">UBICACIÓN</h2>
        <RouteMap stops={[stop]} currentId={stop.id} visited={visited} userPos={pos} height="30vh" />
      </div>
    </div>
  );
}
