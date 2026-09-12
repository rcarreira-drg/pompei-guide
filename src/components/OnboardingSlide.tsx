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
  /**
   * Pantallas con un bloque de acción grande (mapa, voz, instalar...) usan una ilustración
   * menor para que quepa todo en 390×640: "sm" (~19% de alto) o "xs" (~14%). Por defecto
   * ("lg") la ilustración ocupa 32-40% de la altura de la ventana.
   */
  illusSize?: 'sm' | 'xs';
}

export default function OnboardingSlide({ index, total, illus, kicker, title, children, id, illusSize }: OnboardingSlideProps) {
  return (
    <section
      id={id}
      className={`onboarding-slide${illusSize ? ` onboarding-slide--${illusSize}` : ''}`}
      aria-roledescription="pantalla"
      aria-label={`${index} de ${total}`}
    >
      <div className="onboarding-slide-illus">
        <Illustration name={illus} className="onboarding-slide-svg" />
      </div>
      <div className="onboarding-slide-text">
        <span className="kicker onboarding-slide-kicker">{kicker}</span>
        <div className="stripes onboarding-slide-stripe" aria-hidden="true" />
        <h2 className="onboarding-slide-title">{title}</h2>
        {children}
      </div>
    </section>
  );
}
