import { Link, useParams } from 'react-router-dom';
import Hero from '@/components/Hero';
import Blocks from '@/components/Blocks';
import { Illustration } from '@/illustrations';
import { img } from '@/content/images';
import { SECTIONS } from '@/content/sections';
import { useProgress } from '@/lib/useProgress';

export default function SectionPage() {
  const { id } = useParams<{ id: string }>();
  const { isRead, markRead } = useProgress();
  const index = SECTIONS.findIndex((s) => s.id === id);
  const section = index >= 0 ? SECTIONS[index] : undefined;

  if (!section) {
    return (
      <div>
        <Hero kicker="CAPÍTULO NO ENCONTRADO" title="VAYA" subtitle="Este capítulo todavía no existe o está en preparación." />
        <div className="container">
          <Link to="/preparar" className="btn btn-primary">
            ← VOLVER A CAPÍTULOS
          </Link>
        </div>
      </div>
    );
  }

  const prev = index > 0 ? SECTIONS[index - 1] : undefined;
  const next = index < SECTIONS.length - 1 ? SECTIONS[index + 1] : undefined;
  const read = isRead(section.id);
  const cover = section.cover;
  const coverSrc =
    cover && 'src' in cover ? (cover.src.startsWith('http') || cover.src.startsWith('/') ? cover.src : img(cover.src)) : undefined;

  return (
    <div>
      <header className="section-hero">
        <div className="section-hero-media">
          {cover && 'illus' in cover ? (
            <div className="illus-frame section-hero-illus">
              <Illustration name={cover.illus} title={section.title} />
            </div>
          ) : coverSrc ? (
            <img
              src={coverSrc}
              alt={'alt' in (cover ?? {}) ? (cover as { alt: string }).alt : section.title}
              loading="lazy"
              className="section-hero-img"
            />
          ) : (
            <div className="stripes section-hero-illus" role="img" aria-label={section.title} />
          )}
        </div>
        <div className="container">
          <p className="kicker">{section.kicker}</p>
          <h1 className="hero-title">{section.title}</h1>
          <p className="mono section-meta">
            {section.readingMinutes} min de lectura {read && '· LEÍDO ✓'}
          </p>
        </div>
      </header>

      <div className="container">
        <Blocks blocks={section.blocks} />

        <button
          type="button"
          className={`btn btn-block ${read ? '' : 'btn-accent'}`}
          onClick={() => markRead(section.id)}
          disabled={read}
          aria-label="Marcar este capítulo como leído"
        >
          {read ? 'CAPÍTULO LEÍDO ✓' : 'MARCAR COMO LEÍDO'}
        </button>

        <nav className="section-pager" aria-label="Navegación entre capítulos">
          {prev ? (
            <Link to={`/preparar/${prev.id}`} className="btn">{`← ${prev.title}`}</Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/preparar/${next.id}`} className="btn">{`${next.title} →`}</Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}
