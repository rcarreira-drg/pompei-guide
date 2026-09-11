import type { ReactNode } from 'react';

export interface HeroProps {
  kicker: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function Hero({ kicker, title, subtitle, children }: HeroProps) {
  return (
    <header className="hero">
      <div className="stripes hero-stripe" aria-hidden="true" />
      <div className="container hero-inner">
        <p className="kicker">{kicker}</p>
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {children}
      </div>
    </header>
  );
}
