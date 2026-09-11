/**
 * Reproductor de narración de una parada.
 * Motor principal: audio pregrabado (Piper TTS, voz libre) por clips = [intro, ...párrafos].
 * Respaldo: voz del sistema (Web Speech) troceada en frases.
 * Un solo botón grande ESCUCHAR / PAUSA, PARAR, velocidad y toque en un párrafo para saltar a él.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AUDIO, audioUrl } from '@/content/audio';
import { bestVoice, pause as ttsPause, resume as ttsResume, speak, spanishVoices, stop as ttsStop, ttsSupported } from '@/lib/tts';
import { loadNarratorSettings, saveNarratorSettings, type NarratorSettings } from '@/lib/narratorSettings';

type Status = 'idle' | 'loading' | 'playing' | 'paused';
const RATES = [0.9, 1, 1.15, 1.3];

export default function Narrator({ stopId, intro, paragraphs, title }: { stopId: string; intro: string; paragraphs: string[]; title?: string }) {
  const clipsText = useMemo(() => [intro, ...paragraphs], [intro, paragraphs]);
  const audio = AUDIO[stopId];
  const speechOk = ttsSupported();
  const [settings, setSettings] = useState<NarratorSettings>(() => loadNarratorSettings());
  const engine: 'audio' | 'speech' = settings.engine === 'audio' && audio ? 'audio' : speechOk ? 'speech' : 'audio';
  const [status, setStatus] = useState<Status>('idle');
  const [index, setIndex] = useState<number | null>(null);
  const [clipProgress, setClipProgress] = useState(0); // 0..1 del clip actual
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState(() => spanishVoices());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef<number>(0);
  const speechSentence = useRef(0);

  const updateSettings = (patch: Partial<NarratorSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next); saveNarratorSettings(next);
  };

  // --- limpieza al desmontar / cambiar de parada
  useEffect(() => {
    return () => { ttsStop(); audioRef.current?.pause(); audioRef.current = null; };
  }, [stopId]);

  useEffect(() => {
    if (!speechOk) return;
    const upd = () => setVoices(spanishVoices());
    window.speechSynthesis.addEventListener?.('voiceschanged', upd);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', upd);
  }, [speechOk]);

  // --- Media Session (controles en pantalla de bloqueo)
  useEffect(() => {
    if (!('mediaSession' in navigator) || !title) return;
    try { navigator.mediaSession.metadata = new MediaMetadata({ title, artist: 'Guía de Pompeya', album: 'Recorrido' }); } catch { /* ignore */ }
  }, [title]);

  const finish = useCallback(() => { setStatus('idle'); setIndex(null); setClipProgress(0); indexRef.current = 0; }, []);

  // ---------- motor AUDIO ----------
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.preload = 'auto';
      a.addEventListener('timeupdate', () => { if (a.duration) setClipProgress(a.currentTime / a.duration); });
      audioRef.current = a;
    }
    return audioRef.current;
  }, []);

  const playClip = useCallback((i: number) => {
    if (!audio) return;
    if (i >= audio.files.length) { finish(); return; }
    const a = getAudio();
    indexRef.current = i; setIndex(i); setClipProgress(0); setError(null);
    setStatus('loading');
    a.src = audioUrl(audio.files[i]);
    a.playbackRate = settings.rate;
    a.onended = () => playClip(i + 1);
    a.onplaying = () => setStatus('playing');
    a.onerror = () => {
      // sin red y sin caché: cae a la voz del sistema para lo que queda
      if (speechOk) { setError('Audio no disponible sin conexión; se usa la voz del sistema.'); speakClip(i); }
      else { setError('No se ha podido cargar el audio. Comprueba la conexión o descarga la narración desde la pantalla Visita.'); finish(); }
    };
    a.play().catch(() => { setStatus('idle'); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, settings.rate, speechOk]);

  // ---------- motor VOZ DEL SISTEMA ----------
  const speakClip = useCallback((i: number, fromSentence = 0) => {
    if (i >= clipsText.length) { finish(); return; }
    indexRef.current = i; setIndex(i); setStatus('playing');
    speechSentence.current = fromSentence;
    const text = clipsText[i];
    const ok = speak(text, {
      rate: settings.rate,
      voiceURI: settings.voiceURI,
      onSentence: (s, total) => { speechSentence.current = s; setClipProgress(total ? s / total : 0); },
      onEnd: () => speakClip(i + 1),
      onError: () => { setError('No se ha podido reproducir la voz en este dispositivo. Prueba con el audio pregrabado o lee el texto.'); finish(); },
    });
    if (!ok) { setError('Este navegador no tiene síntesis de voz.'); finish(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipsText, settings.rate, settings.voiceURI]);

  // ---------- controles ----------
  const startAt = (i: number) => { setError(null); if (engine === 'audio') playClip(i); else speakClip(i); };

  const handleMain = () => {
    if (status === 'idle') { startAt(0); return; }
    if (status === 'playing' || status === 'loading') {
      if (engine === 'audio') audioRef.current?.pause(); else ttsPause();
      setStatus('paused'); return;
    }
    // paused → reanudar
    if (engine === 'audio') { audioRef.current?.play().catch(() => startAt(indexRef.current)); setStatus('playing'); }
    else { ttsResume(); setStatus('playing'); }
  };
  const handleStop = () => { if (engine === 'audio') { audioRef.current?.pause(); if (audioRef.current) audioRef.current.currentTime = 0; } else ttsStop(); finish(); };
  const handleRate = (r: number) => {
    updateSettings({ rate: r });
    if (audioRef.current) audioRef.current.playbackRate = r;
    if (engine === 'speech' && status === 'playing') { ttsStop(); setTimeout(() => speakClip(indexRef.current, speechSentence.current), 50); }
  };
  const switchEngine = (e: 'audio' | 'speech') => { handleStop(); updateSettings({ engine: e }); };

  const total = audio ? audio.durations.reduce((a, b) => a + b, 0) : null;
  const mainLabel = status === 'idle' ? '▶ ESCUCHAR' : status === 'loading' ? '… CARGANDO' : status === 'playing' ? '❚❚ PAUSA' : '▶ REANUDAR';

  return (
    <div className="narrator box" data-engine={engine}>
      <div className="narrator-head">
        <span className="kicker">NARRACIÓN</span>
        <span className="mono narrator-meta">
          {engine === 'audio' && total != null ? `${Math.round(total / 60)} min · voz pregrabada` : 'voz del sistema'}
        </span>
      </div>

      <div className="narrator-controls">
        <button type="button" className={`btn btn-block ${status === 'playing' ? '' : 'btn-accent'}`} onClick={handleMain} aria-label={status === 'playing' ? 'Pausar narración' : 'Escuchar narración de esta parada'}>
          {mainLabel}
        </button>
        <button type="button" className="btn" onClick={handleStop} disabled={status === 'idle'} aria-label="Detener narración">■ PARAR</button>
      </div>

      <div className="narrator-progress" aria-hidden="true">
        {clipsText.map((_, i) => (
          <span key={i} className={`narrator-seg ${index != null && i < index ? 'is-done' : ''} ${i === index ? 'is-active' : ''}`}>
            {i === index && <span className="narrator-seg-fill" style={{ width: `${Math.round(clipProgress * 100)}%` }} />}
          </span>
        ))}
      </div>

      <div className="narrator-options">
        <div className="narrator-rates" role="group" aria-label="Velocidad">
          {RATES.map(r => (
            <button key={r} type="button" className={`tag narrator-rate ${settings.rate === r ? 'is-on' : ''}`} onClick={() => handleRate(r)} aria-pressed={settings.rate === r}>
              {r === 1 ? '1×' : `${r}×`}
            </button>
          ))}
        </div>
        {audio && speechOk && (
          <div className="narrator-engine" role="group" aria-label="Tipo de voz">
            <button type="button" className={`tag ${engine === 'audio' ? 'is-on' : ''}`} onClick={() => switchEngine('audio')} aria-pressed={engine === 'audio'}>PREGRABADA</button>
            <button type="button" className={`tag ${engine === 'speech' ? 'is-on' : ''}`} onClick={() => switchEngine('speech')} aria-pressed={engine === 'speech'}>DEL MÓVIL</button>
          </div>
        )}
      </div>
      {engine === 'speech' && voices.length > 1 && (
        <label className="narrator-voice mono">
          VOZ
          <select value={settings.voiceURI ?? bestVoice()?.voiceURI ?? ''} onChange={e => { updateSettings({ voiceURI: e.target.value }); if (status !== 'idle') { handleStop(); } }}>
            {voices.map(v => <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
          </select>
        </label>
      )}
      {!audio && !speechOk && (
        <p className="callout callout--info">La narración por voz no está disponible en este navegador. Lee el texto a continuación.</p>
      )}
      {error && <p className="callout callout--warn" role="alert">{error}</p>}

      <div className="narrator-text">
        {clipsText.map((p, i) => (
          <p
            key={i}
            className={`${i === index ? 'narrator-active' : ''} ${i === 0 ? 'narrator-intro' : ''}`}
            onClick={() => startAt(i)}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startAt(i); } }}
            aria-label={`Ir al párrafo ${i + 1}`}
          >
            {p}
          </p>
        ))}
        <p className="mono narrator-hint">Toca un párrafo para escuchar desde ahí.</p>
      </div>
    </div>
  );
}
