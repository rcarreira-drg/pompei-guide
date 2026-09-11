/** Descarga la narración pregrabada completa para escucharla sin conexión. */
import { useEffect, useRef, useState } from 'react';
import { allAudioFiles, cachedAudioCount, clearAudioCache, downloadAllAudio } from '@/lib/audioCache';

export default function AudioDownload() {
  const total = allAudioFiles().length;
  const [cached, setCached] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => { cachedAudioCount().then(setCached).catch(() => setCached(0)); }, [busy]);
  if (total === 0) return null;
  const complete = cached >= total;

  const start = async () => {
    setBusy(true); setErr(null); setDone(0);
    abort.current = new AbortController();
    try { await downloadAllAudio((d) => setDone(d), abort.current.signal); }
    catch (e) { if (!(e instanceof DOMException && e.name === 'AbortError')) setErr('La descarga se ha interrumpido. Vuelve a intentarlo con buena conexión.'); }
    finally { setBusy(false); }
  };
  const cancel = () => abort.current?.abort();
  const clear = async () => { await clearAudioCache(); setCached(0); };

  return (
    <div className="box audio-download">
      <span className="kicker">AUDIO SIN CONEXIÓN</span>
      <p>
        {complete
          ? 'La narración completa está guardada en este dispositivo (unos 16 MB). Podrás escucharla sin datos dentro del parque.'
          : 'Descarga ahora la narración de las 24 paradas (unos 16 MB) con wifi y escúchala sin gastar datos ni depender de la cobertura del yacimiento.'}
      </p>
      {busy ? (
        <>
          <div className="progress-blocks audio-progress" aria-hidden="true">
            <span className="progress-block is-filled" style={{ flex: `${Math.max(done, 1)} 1 0` }} />
            <span className="progress-block" style={{ flex: `${Math.max(total - done, 0)} 1 0` }} />
          </div>
          <p className="mono">{done}/{total} clips</p>
          <button type="button" className="btn" onClick={cancel}>CANCELAR</button>
        </>
      ) : complete ? (
        <button type="button" className="btn" onClick={clear}>BORRAR AUDIO DESCARGADO</button>
      ) : (
        <button type="button" className="btn btn-primary btn-block" onClick={start}>⤓ DESCARGAR NARRACIÓN ({total} clips)</button>
      )}
      {err && <p className="callout callout--warn" role="alert">{err}</p>}
    </div>
  );
}
