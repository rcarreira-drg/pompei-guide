/** Galería de imágenes de referencia: qué mirar para ubicarse. Tira horizontal; toque para ampliar. */
import { useEffect, useState } from 'react';
import { IMAGES, img, imgSm } from '@/content/images';

export interface GalleryItem { src: string; alt: string; caption: string }

export default function Gallery({ items, title = 'PARA UBICARTE' }: { items: GalleryItem[]; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const valid = items.filter((it) => IMAGES[it.src]);
  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); if (e.key === 'ArrowRight') setOpen((o) => (o == null ? o : Math.min(valid.length - 1, o + 1))); if (e.key === 'ArrowLeft') setOpen((o) => (o == null ? o : Math.max(0, o - 1))); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, valid.length]);
  if (valid.length === 0) return null;
  return (
    <section className="gallery" aria-label="Imágenes de referencia">
      <h2 className="section-title">{title}</h2>
      <p className="mono gallery-hint">Fotos de lo que tenéis delante. Tocad una para ampliarla.</p>
      <ul className="gallery-strip">
        {valid.map((it, i) => {
          const meta = IMAGES[it.src];
          return (
            <li key={it.src} className="gallery-item">
              <button type="button" className="gallery-thumb" onClick={() => setOpen(i)} aria-label={`Ampliar: ${it.caption}`}>
                <img src={imgSm(it.src)} alt={it.alt} loading="lazy" width={meta.width} height={meta.height} />
              </button>
              <p className="gallery-caption"><span className="gallery-num mono">{i + 1}</span>{it.caption}</p>
            </li>
          );
        })}
      </ul>
      {open != null && (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={valid[open].caption} onClick={() => setOpen(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={img(valid[open].src)} alt={valid[open].alt} />
            <figcaption>
              <strong>{valid[open].caption}</strong>
              <span className="mono gallery-credit">{IMAGES[valid[open].src].credit}</span>
            </figcaption>
            <div className="gallery-modal-nav">
              <button type="button" className="btn" disabled={open === 0} onClick={() => setOpen(open - 1)} aria-label="Imagen anterior">←</button>
              <span className="mono">{open + 1}/{valid.length}</span>
              <button type="button" className="btn" disabled={open === valid.length - 1} onClick={() => setOpen(open + 1)} aria-label="Imagen siguiente">→</button>
              <button type="button" className="btn btn-primary" onClick={() => setOpen(null)} aria-label="Cerrar">✕</button>
            </div>
          </figure>
        </div>
      )}
    </section>
  );
}
