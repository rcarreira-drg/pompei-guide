/** Descarga la narración pregrabada del modo elegido para escucharla sin conexión. */
import { useEffect, useRef, useState } from 'react';
import { audioFilesForMode, audioMegabytesForMode, cachedAudioCount, clearAudioCache, downloadAllAudio, type AudioMode } from '@/lib/audioCache';
import { useProgress } from '@/lib/useProgress';

export default function AudioDownload() {
  const { mode } = useProgress();
  const m: AudioMode = mode === 'express' ? 'express' : mode === 'total' ? 'total' : 'completa';
  const files = audioFilesForMode(m);
  const total = files.length;
  const mb = audioMegabytesForMode(m);
  const [cached, setCached] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => { cachedAudioCount(files).then(setCached).catch(() => setCached(0)); }, [busy, m]); // eslint-disable-line react-hooks/exhaustive-deps
  if (total === 0) return null;
  const complete = cached >= total;

  const start = async () => {
    setBusy(true); setErr(null); setDone(0);
    abort.current = new AbortController();
    try { await downloadAllAudio((d) => setDone(d), abort.current.signal, files); }
    catch (e) { if (!(e instanceof DOMException && e.name === 'AbortError')) setErr('La descarga se ha interrumpido. Vuelve a intentarlo con buena conexión.'); }
    finally { setBusy(false); }
  };
  const cancel = () => abort.current?.abort();
  const clear = async () => { await clearAudioCache(); setCached(0); };

  return (
    <div className="box audio-download">
      <span className="kicker">AUDIO SIN CONEXIÓN · RUTA {m === 'express' ? 'EXPRÉS' : m === 'total' ? 'TOTAL' : 'COMPLETA'}</span>
      <p>
        {complete
          ? `La narración de la ruta ${m === 'express' ? 'exprés' : m === 'total' ? 'total' : 'completa'} está guardada en este dispositivo (unos ${mb} MB). Podrás escucharla sin datos dentro del parque.`
          : `Descarga ahora con wifi la narración de la ruta ${m === 'express' ? 'exprés' : m === 'total' ? 'total' : 'completa'} (${total} pistas, unos ${mb} MB) y escúchala sin gastar datos ni depender de la cobertura del yacimiento. Cada pista es un único archivo: sigue sonando con la pantalla bloqueada.`}
      </p>
      {busy ? (
        <>
          <div className="progress-blocks audio-progress" aria-hidden="true">
            <span className="progress-block is-filled" style={{ flex: `${Math.max(done, 1)} 1 0` }} />
            <span className="progress-block" style={{ flex: `${Math.max(total - done, 0)} 1 0` }} />
          </div>
          <p className="mono">{done}/{total} pistas</p>
          <button type="button" className="btn" onClick={cancel}>CANCELAR</button>
        </>
      ) : complete ? (
        <button type="button" className="btn" onClick={clear}>BORRAR AUDIO DESCARGADO</button>
      ) : (
        <button type="button" className="btn btn-primary btn-block" onClick={start}>⤓ DESCARGAR NARRACIÓN ({total} pistas)</button>
      )}
      {err && <p className="callout callout--warn" role="alert">{err}</p>}
    </div>
  );
}
