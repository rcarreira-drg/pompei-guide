/** Descarga el mapa del parque (teselas vectoriales de OpenFreeMap) para verlo sin conexión. */
import { useEffect, useRef, useState } from 'react';
import { allMapUrls, cachedTileCount, clearTileCache, downloadParkTiles } from '@/lib/mapCache';

export default function MapDownload() {
  const [urls, setUrls] = useState<string[] | null>(null);
  const [error, setError] = useState(false);
  const [cached, setCached] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    let alive = true;
    allMapUrls()
      .then((u) => { if (alive) setUrls(u); })
      .catch(() => { if (alive) setError(true); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!urls) return;
    cachedTileCount(urls).then(setCached).catch(() => setCached(0));
  }, [urls, busy]);

  const total = urls?.length ?? 0;
  const complete = total > 0 && cached >= total * 0.95;
  const sizeMB = Math.max(1, Math.round((total * 40) / 1024));

  const start = async () => {
    setBusy(true);
    setDone(0);
    abort.current = new AbortController();
    try {
      await downloadParkTiles(setDone, abort.current.signal);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="box audio-download">
      <span className="kicker">MAPA SIN CONEXIÓN</span>
      {error ? (
        <p>No se ha podido preparar la descarga: hace falta conexión al menos una vez para conocer las teselas del parque.</p>
      ) : (
        <p>
          {complete
            ? `El mapa vectorial del parque está guardado en este dispositivo (${total} teselas, unos ${sizeMB} MB). Se verá aunque no haya cobertura.`
            : `El mapa se guarda solo a medida que lo ves, pero puedes descargar ahora las teselas vectoriales de toda la zona del yacimiento (${total || '…'} teselas, unos ${sizeMB} MB). Mapa © OpenFreeMap © OpenMapTiles Data from OpenStreetMap.`}
        </p>
      )}
      {busy ? (
        <>
          <div className="progress-blocks audio-progress" aria-hidden="true">
            <span className="progress-block is-filled" style={{ flex: `${Math.max(done, 1)} 1 0` }} />
            <span className="progress-block" style={{ flex: `${Math.max(total - done, 0)} 1 0` }} />
          </div>
          <p className="mono">{done}/{total} teselas</p>
          <button type="button" className="btn" onClick={() => abort.current?.abort()}>CANCELAR</button>
        </>
      ) : complete ? (
        <button type="button" className="btn" onClick={async () => { await clearTileCache(); setCached(0); }}>BORRAR MAPA DESCARGADO</button>
      ) : (
        <button type="button" className="btn btn-primary btn-block" onClick={start} disabled={!urls}>⤓ DESCARGAR MAPA DEL PARQUE</button>
      )}
    </div>
  );
}
