/**
 * Resuelve el crédito real de una imagen a partir del manifiesto IMAGES
 * (src/content/images.ts) cuando `src` es un id lógico conocido. Si no hay
 * entrada en el manifiesto, cae al crédito de contenido (texto plano, sin
 * enlace) como respaldo.
 */
import { IMAGES } from '@/content/images';

export interface ResolvedCredit {
  text: string;
  url?: string;
}

export function resolveCredit(src: string | undefined, fallbackCredit?: string): ResolvedCredit | undefined {
  if (src && !src.startsWith('http') && !src.startsWith('/')) {
    const meta = IMAGES[src];
    if (meta) return { text: meta.credit, url: meta.sourceUrl };
  }
  if (fallbackCredit) return { text: fallbackCredit };
  return undefined;
}
