/**
 * Reproductor de narración con la voz del móvil (Web Speech API).
 * Un botón ESCUCHAR / PAUSA / REANUDAR, PARAR, velocidad, selector de voz, resaltado por frase
 * y toque en un párrafo para saltar a él. La lectura se trocea en frases para evitar cortes.
 * Limitación conocida: la síntesis de voz del sistema se detiene al bloquear la pantalla o cambiar de app.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { bestVoice, pause as ttsPause, resume as ttsResume, speak, spanishVoices, splitSentences, stop as ttsStop, ttsSupported } from '@/lib/tts';
import { loadNarratorSettings, saveNarratorSettings, type NarratorSettings } from '@/lib/narratorSettings';

type Status = 'idle' | 'playing' | 'paused';
const RATES = [0.9, 1, 1.15, 1.3];

export interface NarratorProps {
  /** Textos de cada párrafo, en orden. */
  texts: string[];
  title?: string;
  introIndex?: number;
  outroIndex?: number;
  compactHeader?: boolean;
}

/** Duración estimada de lectura a 1×: ~150 palabras por minuto. */
function estimateMinutes(texts: string[], rate: number): number {
  const words = texts.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / (150 * rate)));
}

export default function Narrator({ texts, introIndex = 0, outroIndex, compactHeader }: NarratorProps) {
  const speechOk = ttsSupported();
  const [settings, setSettings] = useState<NarratorSettings>(() => loadNarratorSettings());
  const [status, setStatus] = useState<Status>('idle');
  const [index, setIndex] = useState<number | null>(null);
  const [sentence, setSentence] = useState<{ i: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState(() => spanishVoices());
  const indexRef = useRef(0);
  const sentenceRef = useRef(0);

  const updateSettings = (patch: Partial<NarratorSettings>) => { const next = { ...settings, ...patch }; setSettings(next); saveNarratorSettings(next); };

  useEffect(() => () => ttsStop(), [texts]);
  useEffect(() => {
    if (!speechOk) return;
    const upd = () => setVoices(spanishVoices());
    upd();
    window.speechSynthesis.addEventListener?.('voiceschanged', upd);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', upd);
  }, [speechOk]);
  // Si el usuario vuelve a la app tras un bloqueo, la síntesis puede haberse quedado colgada: lo reflejamos
  useEffect(() => {
    if (!speechOk) return;
    const onVis = () => { if (document.visibilityState === 'visible' && status === 'playing' && !window.speechSynthesis.speaking) setStatus('paused'); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [status, speechOk]);

  const finish = useCallback(() => { setStatus('idle'); setIndex(null); setSentence(null); indexRef.current = 0; sentenceRef.current = 0; }, []);

  const speakFrom = useCallback((i: number, fromSentence = 0) => {
    if (i >= texts.length) { finish(); return; }
    indexRef.current = i; setIndex(i); setStatus('playing'); setError(null);
    const sentences = splitSentences(texts[i]).slice(fromSentence);
    const ok = speak(sentences.join(' '), {
      rate: settings.rate, voiceURI: settings.voiceURI,
      onSentence: (s, total) => { sentenceRef.current = fromSentence + s; setSentence({ i: fromSentence + s, total: fromSentence + total }); },
      onEnd: () => speakFrom(i + 1),
      onError: () => { setError('No se ha podido reproducir la voz. Comprueba que el móvil tiene instalada una voz en español (Ajustes → Texto a voz) y el volumen.'); finish(); },
    });
    if (!ok) { setError('Este navegador no tiene síntesis de voz.'); finish(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts, settings.rate, settings.voiceURI, finish]);

  const handleMain = () => {
    if (status === 'idle') { speakFrom(0); return; }
    if (status === 'playing') { ttsPause(); setStatus('paused'); return; }
    // reanudar: releemos desde la frase en curso (pause() en Android no reanuda bien)
    ttsResume();
    if (!window.speechSynthesis.speaking) speakFrom(indexRef.current, sentenceRef.current);
    setStatus('playing');
  };
  const handleStop = () => { ttsStop(); finish(); };
  const handleRate = (r: number) => {
    updateSettings({ rate: r });
    if (status === 'playing') { ttsStop(); setTimeout(() => speakFrom(indexRef.current, sentenceRef.current), 60); }
  };
  const handleVoice = (uri: string) => {
    updateSettings({ voiceURI: uri });
    if (status !== 'idle') { ttsStop(); setTimeout(() => speakFrom(indexRef.current, sentenceRef.current), 60); }
  };

  const mainLabel = status === 'idle' ? '▶ ESCUCHAR' : status === 'playing' ? '❚❚ PAUSA' : '▶ REANUDAR';
  const minutes = estimateMinutes(texts, settings.rate);
  const currentVoice = speechOk ? bestVoice(settings.voiceURI) : undefined;

  if (texts.length === 0) return null;

  return (
    <div className="narrator box">
      <div className="narrator-head">
        <span className="kicker">{compactHeader ? 'ESCUCHAR' : 'NARRACIÓN'}</span>
        <span className="mono narrator-meta">
          {speechOk ? `≈ ${minutes} min · voz del móvil${currentVoice ? ` · ${currentVoice.name.replace(/^Microsoft |^Google /, '')}` : ''}` : 'sin voz disponible'}
        </span>
      </div>

      {speechOk && (
        <div className="narrator-controls">
          <button type="button" className={`btn btn-block ${status === 'playing' ? '' : 'btn-accent'}`} onClick={handleMain} aria-label={status === 'playing' ? 'Pausar narración' : 'Escuchar narración de esta parada'}>
            {mainLabel}
          </button>
          <button type="button" className="btn" onClick={handleStop} disabled={status === 'idle'} aria-label="Detener narración">■ PARAR</button>
        </div>
      )}

      <div className="narrator-progress" aria-hidden="true">
        {texts.map((t, i) => {
          const fill = i === index && sentence ? (sentence.i + 1) / Math.max(sentence.total, 1) : 0;
          return (
            <span key={i} className={`narrator-seg ${index != null && i < index ? 'is-done' : ''} ${i === index ? 'is-active' : ''}`} style={{ flexGrow: Math.max(t.length, 40) }}>
              {i === index && <span className="narrator-seg-fill" style={{ width: `${Math.round(fill * 100)}%` }} />}
            </span>
          );
        })}
      </div>

      {speechOk && (
        <div className="narrator-options">
          <div className="narrator-rates" role="group" aria-label="Velocidad">
            {RATES.map(r => (
              <button key={r} type="button" className={`tag narrator-rate ${settings.rate === r ? 'is-on' : ''}`} onClick={() => handleRate(r)} aria-pressed={settings.rate === r}>
                {r === 1 ? '1×' : `${r}×`}
              </button>
            ))}
          </div>
          {voices.length > 1 && (
            <label className="narrator-voice mono">
              VOZ
              <select value={currentVoice?.voiceURI ?? ''} onChange={e => handleVoice(e.target.value)} aria-label="Elegir voz">
                {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
              </select>
            </label>
          )}
        </div>
      )}
      {!speechOk && <p className="callout callout--info">La narración por voz no está disponible en este navegador. Lee el texto a continuación.</p>}
      {error && <p className="callout callout--warn" role="alert">{error}</p>}

      <div className="narrator-text">
        {texts.map((p, i) => (
          <p
            key={i}
            className={`${i === index ? 'narrator-active' : ''} ${i === introIndex ? 'narrator-intro' : ''} ${outroIndex != null && i === outroIndex ? 'narrator-outro' : ''}`}
            onClick={() => speakFrom(i)}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); speakFrom(i); } }}
            aria-label={`Ir al párrafo ${i + 1}`}
          >
            {outroIndex != null && i === outroIndex && <span className="kicker narrator-outro-kicker">POR QUÉ SEGUIMOS POR AQUÍ</span>}
            {p}
          </p>
        ))}
        <p className="mono narrator-hint">Toca un párrafo para escuchar desde ahí. La voz del móvil se detiene si bloqueas la pantalla: activa PANTALLA SIEMPRE ENCENDIDA en Visita.</p>
      </div>
    </div>
  );
}
