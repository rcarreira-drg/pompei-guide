/** Narración voz por voz: encadena speak() con onEnd para leer párrafo a párrafo. */
import { useEffect, useState } from 'react';
import { pause, resume, speak, stop, ttsSupported } from '@/lib/tts';

export default function Narrator({ paragraphs }: { paragraphs: string[] }) {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const supported = ttsSupported();

  useEffect(() => () => stop(), []);

  if (!supported) {
    return (
      <div className="callout callout--info narrator-unsupported">
        <p>La narración por voz no está disponible en este navegador. Lee el texto de la parada más abajo.</p>
      </div>
    );
  }

  if (paragraphs.length === 0) return null;

  const playFrom = (i: number) => {
    if (i >= paragraphs.length) {
      setStatus('idle');
      setActiveIndex(null);
      return;
    }
    setActiveIndex(i);
    setStatus('playing');
    speak(paragraphs[i], () => playFrom(i + 1));
  };

  const handlePlay = () => {
    if (status === 'paused') {
      resume();
      setStatus('playing');
      return;
    }
    playFrom(0);
  };

  const handlePause = () => {
    pause();
    setStatus('paused');
  };

  const handleStop = () => {
    stop();
    setStatus('idle');
    setActiveIndex(null);
  };

  return (
    <div className="narrator box">
      <div className="narrator-controls">
        {status !== 'playing' ? (
          <button type="button" className="btn btn-accent" onClick={handlePlay} aria-label="Escuchar narración de esta parada">
            ▶ ESCUCHAR
          </button>
        ) : (
          <button type="button" className="btn" onClick={handlePause} aria-label="Pausar narración">
            ❚❚ PAUSA
          </button>
        )}
        <button type="button" className="btn" onClick={handleStop} disabled={status === 'idle'} aria-label="Detener narración">
          ■ PARAR
        </button>
      </div>
      <div className="narrator-text">
        {paragraphs.map((p, i) => (
          <p key={i} className={i === activeIndex ? 'narrator-active' : ''}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
