import { Link } from 'react-router-dom';
import type { Section } from '@/content/types';
import { Illustration } from '@/illustrations';
import { img } from '@/content/images';
import { resolveCredit } from '@/lib/credit';

export interface SectionCardProps {
  section: Section;
  index: number;
  total: number;
  read?: boolean;
}

export default function SectionCard({ section, index, read }: SectionCardProps) {
  const cover = section.cover;
  const coverSrc =
    cover && 'src' in cover ? (cover.src.startsWith('http') || cover.src.startsWith('/') ? cover.src : img(cover.src)) : undefined;
  const credit = cover && 'src' in cover ? resolveCredit(cover.src, cover.credit) : undefined;

  return (
    <Link to={`/preparar/${section.id}`} className="section-card box">
      <span className="section-card-num mono" aria-hidden="true">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="section-card-media">
        {cover && 'illus' in cover ? (
          <Illustration name={cover.illus} title={section.title} />
        ) : coverSrc ? (
          <img src={coverSrc} alt={'alt' in (cover ?? {}) ? (cover as { alt: string }).alt : section.title} loading="lazy" />
        ) : (
          <div className="stripes section-card-placeholder" role="img" aria-label={section.title} />
        )}
        {/* Texto plano (no enlace): la tarjeta entera ya es un <Link>; anidar un <a> sería HTML inválido. */}
        {credit && <span className="mono section-card-credit">{credit.text}</span>}
      </div>
      <div className="section-card-body">
        <p className="kicker">{section.kicker}</p>
        <h3>{section.title}</h3>
        <p className="section-card-summary">{section.summary}</p>
        <p className="mono section-card-meta">
          {section.readingMinutes} min {read && <span className="section-card-read">· LEÍDO ✓</span>}
        </p>
      </div>
    </Link>
  );
}
