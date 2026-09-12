import { lazy, Suspense } from 'react';
import { Illustration } from '@/illustrations';

// `three` no debe entrar en el bundle inicial: se carga perezosamente y, mientras
// tanto (o si falla), se muestra la ilustración SVG `vesuvio` como fallback.
const VesuvioScene = lazy(() => import('./VesuvioScene'));

export default function LazyVesuvio({ className, title }: { className?: string; title?: string }) {
  const label = title ?? 'El Vesubio sobre la bahía de Nápoles';
  return (
    <Suspense fallback={<Illustration name="vesuvio" title={label} className="home-illus-fallback" />}>
      <VesuvioScene className={className} title={label} />
    </Suspense>
  );
}
