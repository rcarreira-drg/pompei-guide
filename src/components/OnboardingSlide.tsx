/** Una pantalla del onboarding: ilustración grande, kicker, título display y cuerpo. */
import type { ReactNode } from 'react';
import { Illustration } from '@/illustrations';
import type { IllustrationName } from '@/content/types';

export interface OnboardingSlideProps {
  /** Posición 1-based dentro de la secuencia (para aria-label "N de 7"). */
  index: number;
  total: number;
  illus: IllustrationName;
  kicker: string;
  title: string;
  children: ReactNode;
  /** Ancla para /ayuda. */
  id?: string;
}

export default function OnboardingSlide({ index, total, illus, kicker, title, children, id }: OnboardingSlideProps) {
  return (
    <section id={id} className="onboarding-slide" aria-roledescription="pantalla" aria-label={`${index} de ${total}`}>
      <div className="onboarding-slide-illus">
        <Illustration name={illus} className="onboarding-slide-svg" />
      </div>
      <span className="kicker onboarding-slide-kicker">{kicker}</span>
      <h2 className="onboarding-slide-title">{title}</h2>
      <div className="onboarding-slide-body">{children}</div>
    </section>
  );
}
