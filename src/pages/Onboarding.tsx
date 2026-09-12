/**
 * Onboarding: 7 pantallas de bienvenida, saltables y repetibles.
 * - `/bienvenida/:n` (n = 1..7): pantalla completa, deslizable, con SALTAR / ANTERIOR / SIGUIENTE / EMPEZAR.
 * - `/ayuda`: las mismas 7 pantallas apiladas en vertical, con anclas, para consultar más tarde.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Hero from '@/components/Hero';
import OnboardingSlide from '@/components/OnboardingSlide';
import ExpressToggle from '@/components/ExpressToggle';
import MapDownload from '@/components/MapDownload';
import { setOnboarded, platformHint } from '@/lib/onboarding';
import { speak, spanishVoices, ttsSupported } from '@/lib/tts';
import type { IllustrationName } from '@/content/types';

/** Bloque "PRUÉBALO": instrucciones de instalación como app según la plataforma detectada. */
function InstallHintBlock() {
  const hint = platformHint();
  return (
    <div className="box onboarding-install">
      <span className="kicker">INSTALAR COMO APP · {hint.title}</span>
      <p>{hint.steps.join(' ')}</p>
    </div>
  );
}

/** Bloque "PRUÉBALO": lee dos frases de prueba con la voz del móvil y lista las voces en español disponibles. */
function VoiceTest() {
  const [playing, setPlaying] = useState(false);
  const supported = ttsSupported();
  const voices = supported ? spanishVoices() : [];

  const handle = () => {
    setPlaying(true);
    const ok = speak('Hola, soy tu guía en Pompeya. Te acompañaré parada a parada durante la visita, con la voz de este móvil.', {
      onEnd: () => setPlaying(false),
      onError: () => setPlaying(false),
    });
    if (!ok) setPlaying(false);
  };

  return (
    <div className="box onboarding-voice-test">
      <span className="kicker">PRUÉBALO</span>
      <button type="button" className="btn btn-accent btn-block" onClick={handle} disabled={playing}>
        {playing ? '▶ REPRODUCIENDO…' : '▶ PROBAR LA VOZ'}
      </button>
      {!supported && <p className="callout callout--warn">Este navegador no tiene síntesis de voz.</p>}
      {supported && voices.length === 0 && (
        <p className="callout callout--warn">No hay voz en español instalada. Añádela en Ajustes y vuelve a intentarlo.</p>
      )}
      {supported && voices.length > 0 && (
        <p className="mono onboarding-voice-list">
          {voices.length} {voices.length === 1 ? 'voz en español' : 'voces en español'}: {voices.slice(0, 2).map((v) => v.name).join(', ')}{voices.length > 2 ? '…' : ''}
        </p>
      )}
      <p className="onboarding-note">Se detiene si bloqueas la pantalla: activa PANTALLA SIEMPRE ENCENDIDA.</p>
    </div>
  );
}

interface SlideDef { id: string; illus: IllustrationName; kicker: string; title: string; body: () => ReactNode; illusSize?: 'sm' | 'xs' }

const SLIDES: SlideDef[] = [
  {
    id: 'bienvenida',
    illus: 'vesuvio',
    kicker: 'POMPEYA · GUÍA DE BOLSILLO',
    title: 'POMPEYA EN EL BOLSILLO',
    body: () => (
      <>
        <p>Tres cosas que puedes hacer: prepararte antes del viaje, recorrer el parque como con un guía, y buscar cualquier punto del plano oficial.</p>
        <p className="mono onboarding-note">Proyecto no oficial y gratuito.</p>
      </>
    ),
  },
  {
    id: 'antes-del-viaje',
    illus: 'plinio',
    kicker: 'ANTES DEL VIAJE',
    title: 'PREPARA LA VISITA',
    illusSize: 'sm',
    body: () => (
      <>
        <p>Historia, cronología, glosario y quiz. Checklist, tiempo, entradas y cómo llegar.</p>
        <Link to="/preparar" className="btn btn-primary btn-block">IR A PREPARAR</Link>
        <InstallHintBlock />
      </>
    ),
  },
  {
    id: 'elige-tu-ruta',
    illus: 'brujula',
    kicker: 'ELIGE TU RUTA',
    title: 'A TU RITMO',
    body: () => (
      <>
        <p>Exprés: 13 paradas, 2,5-3 h. Completa: 24 paradas, 5-7 h. Total: todos los puntos del plano.</p>
        <ExpressToggle />
      </>
    ),
  },
  {
    id: 'el-dia-de-la-visita',
    illus: 'calle',
    kicker: 'EL DÍA DE LA VISITA',
    title: 'UN GUÍA EN EL BOLSILLO',
    illusSize: 'xs',
    body: () => (
      <>
        <p>Tu posición y el camino, con un aviso al llegar a cada parada.</p>
        <MapDownload />
      </>
    ),
  },
  {
    id: 'escuchar-al-guia',
    illus: 'teatro',
    kicker: 'ESCUCHAR AL GUÍA',
    title: 'LA VOZ DE TU MÓVIL',
    illusSize: 'xs',
    body: () => (
      <>
        <p>Elige voz y velocidad; toca un párrafo para saltar a él.</p>
        <VoiceTest />
      </>
    ),
  },
  {
    id: 'el-plano-oficial',
    illus: 'foro',
    kicker: 'EL PLANO OFICIAL',
    title: 'BUSCA CUALQUIER PUNTO',
    illusSize: 'sm',
    body: () => (
      <>
        <p>Ocho regiones numeradas: elige Regio y número, o busca por nombre, y escucha el relato.</p>
        <Link to="/mapa" className="btn btn-primary btn-block">ABRIR EL PLANO</Link>
      </>
    ),
  },
  {
    id: 'consejos-y-fin',
    illus: 'pan',
    kicker: 'CONSEJOS Y FIN',
    title: 'ANTES DE SALIR',
    body: () => (
      <ul className="brutal-list">
        <li>Lleva agua: hay fuentes por el recinto, pero hay poca sombra.</li>
        <li>Calzado cómodo: el empedrado original es muy irregular.</li>
        <li>Los baños están señalados en el plano oficial.</li>
        <li>Si es tu primera vez, ve a la apertura: hay menos gente y menos calor.</li>
        <li>Algunas casas tienen horario rotativo y pueden estar cerradas ese día.</li>
      </ul>
    ),
  },
];

const TOTAL = SLIDES.length;
const SWIPE_THRESHOLD = 40;

/** Pantalla completa /bienvenida/:n, saltable y deslizable. */
export default function Onboarding() {
  const { n } = useParams<{ n: string }>();
  const navigate = useNavigate();
  const parsed = Number.parseInt(n ?? '1', 10);
  const index = Math.min(Math.max(Number.isFinite(parsed) ? parsed : 1, 1), TOTAL);
  const touchStartX = useRef<number | null>(null);

  // Normaliza índices fuera de rango o no numéricos en la URL.
  useEffect(() => {
    if (String(index) !== n) navigate(`/bienvenida/${index}`, { replace: true });
  }, [n, index, navigate]);

  // Oculta la barra inferior y evita el scroll de fondo mientras dura el onboarding a pantalla completa.
  useEffect(() => {
    document.body.classList.add('onboarding-active');
    return () => { document.body.classList.remove('onboarding-active'); };
  }, []);

  const goTo = useCallback((i: number) => {
    const clamped = Math.min(Math.max(i, 1), TOTAL);
    navigate(`/bienvenida/${clamped}`);
  }, [navigate]);

  const finish = useCallback(() => { setOnboarded(); navigate('/', { replace: true }); }, [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(index + 1);
      else if (e.key === 'ArrowLeft') goTo(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, goTo]);

  const slide = SLIDES[index - 1];
  const isLast = index === TOTAL;

  return (
    <div
      className="onboarding-screen"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) < SWIPE_THRESHOLD) return;
        if (dx < 0) goTo(index + 1); else goTo(index - 1);
      }}
    >
      <button type="button" className="btn onboarding-skip" onClick={finish}>SALTAR</button>

      <OnboardingSlide index={index} total={TOTAL} illus={slide.illus} kicker={slide.kicker} title={slide.title} illusSize={slide.illusSize}>
        {slide.body()}
        {isLast && <p className="mono onboarding-again-hint">Puedes volver a ver esto en Práctico → ¿Cómo funciona?</p>}
      </OnboardingSlide>

      <div className="onboarding-dots" role="tablist" aria-label="Progreso del onboarding">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`onboarding-dot ${i === index - 1 ? 'is-active' : ''}`}
            role="tab"
            aria-selected={i === index - 1}
            aria-label={`Ir a la pantalla ${i + 1} de ${TOTAL}`}
            onClick={() => goTo(i + 1)}
          />
        ))}
      </div>

      <div className="onboarding-nav">
        <button type="button" className="btn" onClick={() => goTo(index - 1)} disabled={index === 1}>← ANTERIOR</button>
        {isLast ? (
          <button type="button" className="btn btn-accent btn-block onboarding-finish" onClick={finish}>EMPEZAR</button>
        ) : (
          <button type="button" className="btn btn-primary btn-block" onClick={() => goTo(index + 1)}>SIGUIENTE →</button>
        )}
      </div>
    </div>
  );
}

/** Página /ayuda: las 7 pantallas apiladas en vertical, con anclas, para consultar después. La barra inferior sigue visible. */
export function OnboardingHelp() {
  return (
    <div>
      <Hero kicker="AYUDA" title="¿CÓMO FUNCIONA?" subtitle="Repasa aquí las pantallas de bienvenida cuando quieras." />
      <div className="container onboarding-help-list">
        {SLIDES.map((s, i) => (
          <OnboardingSlide key={s.id} id={s.id} index={i + 1} total={TOTAL} illus={s.illus} kicker={s.kicker} title={s.title} illusSize={s.illusSize}>
            {s.body()}
          </OnboardingSlide>
        ))}
        <Link to="/" className="btn btn-primary btn-block onboarding-help-home">VOLVER A INICIO</Link>
      </div>
    </div>
  );
}
