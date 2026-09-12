/**
 * Reproductor de narración.
 * Motor principal: UNA pista mp3 continua por parada (sigue sonando con la pantalla bloqueada) con
 * tiempos de inicio por párrafo para resaltar y saltar. Controles en pantalla de bloqueo (Media Session).
 * Respaldo: voz del sistema (Web Speech) troceada en frases.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AUDIO, audioUrl } from '@/content/audio';
import { bestVoice, pause as ttsPause, resume as ttsResume, speak, spanishVoices, stop as ttsStop, ttsSupported } from '@/lib/tts';
import { loadNarratorSettings, saveNarratorSettings, type NarratorSettings } from '@/lib/narratorSettings';

type Status = 'idle' | 'loading' | 'playing' | 'paused';
const RATES = [0.9, 1, 1.15, 1.3];

export interface NarratorProps {
  /** Clave de pista en el manifiesto de audio (p.ej. 'foro' o 'foro:express' o 'route:completa'). */
  audioKey: string;
  /** Textos de cada párrafo, en el mismo orden que la pista. */
  texts: string[];
  title?: string;
  /** Índices de párrafos con estilo especial: 0 = introducción; el último puede ser "por qué seguimos hacia…". */
  introIndex?: number;
  outroIndex?: number;
  compactHeader?: boolean;
}

export default function Narrator({ audioKey, texts, title, introIndex = 0, outroIndex, compactHeader }: NarratorProps) {
  const track = AUDIO[audioKey];
  const speechOk = ttsSupported();
  const [settings, setSettings] = useState<NarratorSettings>(() => loadNarratorSettings());
  const engine: 'audio' | 'speech' = settings.engine === 'audio' && track ? 'audio' : speechOk ? 'speech' : 'audio';
  const [status, setStatus] = useState<Status>('idle');
  const [index, setIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 de la pista completa
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState(() => spanishVoices());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);
  const speechSentence = useRef(0);

  const updateSettings = (patch: Partial<NarratorSettings>) => { const next = { ...settings, ...patch }; setSettings(next); saveNarratorSettings(next); };

  useEffect(() => () => { ttsStop(); audioRef.current?.pause(); audioRef.current = null; }, [audioKey]);
  useEffect(() => {
    if (!speechOk) return;
    const upd = () => setVoices(spanishVoices());
    window.speechSynthesis.addEventListener?.('voiceschanged', upd);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', upd);
  }, [speechOk]);

  const finish = useCallback(() => { setStatus('idle'); setIndex(null); setProgress(0); indexRef.current = 0; }, []);

  // ---------- motor AUDIO (una pista) ----------
  const paragraphAt = useCallback((t: number) => {
    if (!track) return 0;
    let i = 0; for (let k = 0; k < track.starts.length; k++) if (t + 0.05 >= track.starts[k]) i = k;
    return i;
  }, [track]);

  // ---------- motor VOZ DEL SISTEMA ----------
  const speakFrom = useCallback((i: number, fromSentence = 0) => {
    if (i >= texts.length) { finish(); return; }
    indexRef.current = i; setIndex(i); setStatus('playing');
    speechSentence.current = fromSentence;
    const ok = speak(texts[i], {
      rate: settings.rate, voiceURI: settings.voiceURI,
      onSentence: (s, total) => { speechSentence.current = s; setProgress((i + (total ? s / total : 0)) / texts.length); },
      onEnd: () => speakFrom(i + 1),
      onError: () => { setError('No se ha podido reproducir la voz en este dispositivo. Prueba con el audio pregrabado o lee el texto.'); finish(); },
    });
    if (!ok) { setError('Este navegador no tiene síntesis de voz.'); finish(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts, settings.rate, settings.voiceURI, finish]);

  const getAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const a = new Audio();
    a.preload = 'auto';
    a.src = audioUrl(track!.file);
    a.playbackRate = settings.rate;
    a.addEventListener('timeupdate', () => {
      if (!a.duration) return;
      setProgress(a.currentTime / a.duration);
      const i = paragraphAt(a.currentTime);
      if (i !== indexRef.current) { indexRef.current = i; setIndex(i); }
    });
    a.addEventListener('playing', () => setStatus('playing'));
    a.addEventListener('waiting', () => setStatus('loading'));
    a.addEventListener('pause', () => { if (!a.ended) setStatus((s) => (s === 'idle' ? s : 'paused')); });
    a.addEventListener('ended', () => finish());
    a.addEventListener('error', () => {
      if (speechOk) { setError('Audio no disponible sin conexión; se usa la voz del sistema.'); updateSettings({ engine: 'speech' }); speakFrom(indexRef.current); }
      else { setError('No se ha podido cargar el audio. Comprueba la conexión o descarga la narración desde la pantalla Visita.'); finish(); }
    });
    audioRef.current = a;
    return a;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, paragraphAt, finish, speechOk, speakFrom]);

  const playAudioFrom = useCallback((i: number) => {
    if (!track) return;
    const a = getAudio();
    setError(null); setStatus('loading');
    indexRef.current = i; setIndex(i);
    const seek = () => { a.currentTime = track.starts[i] ?? 0; a.play().catch(() => setStatus('idle')); };
    if (a.readyState >= 1) seek(); else { a.addEventListener('loadedmetadata', seek, { once: true }); a.load(); }
  }, [track, getAudio]);

  // ---------- Media Session (pantalla de bloqueo) ----------
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    const ms = navigator.mediaSession;
    try { ms.metadata = new MediaMetadata({ title: title ?? 'Narración', artist: 'Guía de Pompeya', album: 'Recorrido' }); } catch { /* ignore */ }
    const set = (action: MediaSessionAction, fn: MediaSessionActionHandler | null) => { try { ms.setActionHandler(action, fn); } catch { /* no soportado */ } };
    set('play', () => { audioRef.current?.play(); });
    set('pause', () => { audioRef.current?.pause(); });
    set('stop', () => { audioRef.current?.pause(); if (audioRef.current) audioRef.current.currentTime = 0; finish(); });
    set('seekbackward', () => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10); });
    set('seekforward', () => { if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + 10); });
    set('previoustrack', () => playAudioFrom(Math.max(0, indexRef.current - 1)));
    set('nexttrack', () => { if (track && indexRef.current + 1 < track.starts.length) playAudioFrom(indexRef.current + 1); });
    return () => { for (const a of ['play', 'pause', 'stop', 'seekbackward', 'seekforward', 'previoustrack', 'nexttrack'] as MediaSessionAction[]) set(a, null); };
  }, [title, track, playAudioFrom, finish]);

  // ---------- controles ----------
  const startAt = (i: number) => { setError(null); if (engine === 'audio') playAudioFrom(i); else speakFrom(i); };
  const handleMain = () => {
    if (status === 'idle') { startAt(0); return; }
    if (status === 'playing' || status === 'loading') {
      if (engine === 'audio') audioRef.current?.pause(); else ttsPause();
      setStatus('paused'); return;
    }
    if (engine === 'audio') { audioRef.current?.play().catch(() => startAt(indexRef.current)); } else { ttsResume(); setStatus('playing'); }
  };
  const handleStop = () => { if (engine === 'audio') { audioRef.current?.pause(); if (audioRef.current) audioRef.current.currentTime = 0; } else ttsStop(); finish(); };
  const handleRate = (r: number) => {
    updateSettings({ rate: r });
    if (audioRef.current) audioRef.current.playbackRate = r;
    if (engine === 'speech' && status === 'playing') { ttsStop(); setTimeout(() => speakFrom(indexRef.current, speechSentence.current), 50); }
  };
  const switchEngine = (e: 'audio' | 'speech') => { handleStop(); updateSettings({ engine: e }); };

  const mainLabel = status === 'idle' ? '▶ ESCUCHAR' : status === 'loading' ? '… CARGANDO' : status === 'playing' ? '❚❚ PAUSA' : '▶ REANUDAR';
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

  if (texts.length === 0) return null;

  return (
    <div className="narrator box" data-engine={engine}>
      <div className="narrator-head">
        <span className="kicker">{compactHeader ? 'ESCUCHAR' : 'NARRACIÓN'}</span>
        <span className="mono narrator-meta">
          {engine === 'audio' && track ? `${fmt(track.total)} · voz pregrabada · sigue con la pantalla bloqueada` : 'voz del sistema'}
        </span>
      </div>

      <div className="narrator-controls">
        <button type="button" className={`btn btn-block ${status === 'playing' ? '' : 'btn-accent'}`} onClick={handleMain} aria-label={status === 'playing' ? 'Pausar narración' : 'Escuchar narración de esta parada'}>
          {mainLabel}
        </button>
        <button type="button" className="btn" onClick={handleStop} disabled={status === 'idle'} aria-label="Detener narración">■ PARAR</button>
      </div>

      <div className="narrator-progress" aria-hidden="true">
        {texts.map((_, i) => {
          const segStart = track ? (track.starts[i] ?? 0) / Math.max(track.total, 1) : i / texts.length;
          const segEnd = track ? (i + 1 < track.starts.length ? track.starts[i + 1] / Math.max(track.total, 1) : 1) : (i + 1) / texts.length;
          const fill = Math.max(0, Math.min(1, (progress - segStart) / Math.max(segEnd - segStart, 0.0001)));
          return (
            <span key={i} className={`narrator-seg ${index != null && i < index ? 'is-done' : ''} ${i === index ? 'is-active' : ''}`} style={{ flexGrow: Math.max(segEnd - segStart, 0.02) * 100 }}>
              {i === index && <span className="narrator-seg-fill" style={{ width: `${Math.round(fill * 100)}%` }} />}
            </span>
          );
        })}
      </div>

      <div className="narrator-options">
        <div className="narrator-rates" role="group" aria-label="Velocidad">
          {RATES.map(r => (
            <button key={r} type="button" className={`tag narrator-rate ${settings.rate === r ? 'is-on' : ''}`} onClick={() => handleRate(r)} aria-pressed={settings.rate === r}>
              {r === 1 ? '1×' : `${r}×`}
            </button>
          ))}
        </div>
        {track && speechOk && (
          <div className="narrator-engine" role="group" aria-label="Tipo de voz">
            <button type="button" className={`tag ${engine === 'audio' ? 'is-on' : ''}`} onClick={() => switchEngine('audio')} aria-pressed={engine === 'audio'}>PREGRABADA</button>
            <button type="button" className={`tag ${engine === 'speech' ? 'is-on' : ''}`} onClick={() => switchEngine('speech')} aria-pressed={engine === 'speech'}>DEL MÓVIL</button>
          </div>
        )}
      </div>
      {engine === 'speech' && voices.length > 1 && (
        <label className="narrator-voice mono">
          VOZ
          <select value={settings.voiceURI ?? bestVoice()?.voiceURI ?? ''} onChange={e => { updateSettings({ voiceURI: e.target.value }); if (status !== 'idle') handleStop(); }}>
            {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
      )}
      {!track && !speechOk && <p className="callout callout--info">La narración por voz no está disponible en este navegador. Lee el texto a continuación.</p>}
      {error && <p className="callout callout--warn" role="alert">{error}</p>}

      <div className="narrator-text">
        {texts.map((p, i) => (
          <p
            key={i}
            className={`${i === index ? 'narrator-active' : ''} ${i === introIndex ? 'narrator-intro' : ''} ${outroIndex != null && i === outroIndex ? 'narrator-outro' : ''}`}
            onClick={() => startAt(i)}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startAt(i); } }}
            aria-label={`Ir al párrafo ${i + 1}`}
          >
            {outroIndex != null && i === outroIndex && <span className="kicker narrator-outro-kicker">POR QUÉ SEGUIMOS POR AQUÍ</span>}
            {p}
          </p>
        ))}
        <p className="mono narrator-hint">Toca un párrafo para escuchar desde ahí. El audio sigue aunque bloquees la pantalla.</p>
      </div>
    </div>
  );
}
