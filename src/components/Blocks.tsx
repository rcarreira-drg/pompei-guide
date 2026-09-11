/**
 * Renderiza un array de Block (src/content/types.ts). Parser mínimo y seguro
 * de negrita/cursiva con doble y simple asterisco (sin dangerouslySetInnerHTML).
 */
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import type { Block } from '@/content/types';
import { Illustration } from '@/illustrations';
import { img } from '@/content/images';

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter((p) => p.length > 0);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function resolveSrc(src: string): string {
  if (src.startsWith('http') || src.startsWith('/')) return src;
  return img(src);
}

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return <p key={i}>{renderInline(block.text)}</p>;

          case 'h3':
            return (
              <h3 key={i} className="block-h3">
                {block.text}
              </h3>
            );

          case 'quote':
            return (
              <blockquote key={i} className="quote">
                <p>{renderInline(block.text)}</p>
                {block.cite && <cite className="mono">{block.cite}</cite>}
              </blockquote>
            );

          case 'list':
            return (
              <ul key={i} className="brutal-list">
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item)}</li>
                ))}
              </ul>
            );

          case 'fact':
            return (
              <div key={i} className="fact-card box">
                <span className="kicker">{block.label}</span>
                <strong className="fact-value">{block.value}</strong>
              </div>
            );

          case 'img': {
            const resolved = resolveSrc(block.src);
            return (
              <figure key={i} className="block-figure">
                {resolved ? (
                  <img src={resolved} alt={block.alt} loading="lazy" className="block-img" />
                ) : (
                  <div className="stripes block-img block-img-placeholder" role="img" aria-label={block.alt}>
                    <span className="mono placeholder-label">{block.alt}</span>
                  </div>
                )}
                {(block.caption || block.credit) && (
                  <figcaption className="mono block-caption">
                    {block.caption}
                    {block.caption && block.credit ? ' — ' : ''}
                    {block.credit}
                  </figcaption>
                )}
              </figure>
            );
          }

          case 'illus':
            return (
              <figure key={i} className="block-figure">
                <div className="illus-frame">
                  <Illustration name={block.name} title={block.caption} />
                </div>
                {block.caption && <figcaption className="mono block-caption">{block.caption}</figcaption>}
              </figure>
            );

          case 'callout':
            return (
              <div key={i} className={`callout callout--${block.tone}`}>
                <p>{renderInline(block.text)}</p>
              </div>
            );

          case 'glossary':
            return (
              <dl key={i} className="glossary-block">
                <dt className="mono">{block.term}</dt>
                <dd>{block.def}</dd>
              </dl>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
