/** Descarga el mapa del parque (teselas OSM) para verlo sin conexión. */
import { useEffect, useRef, useState } from 'react';
import { cachedTileCount, clearTileCache, downloadParkTiles, parkTileUrls } from '@/lib/mapCache';

export default function MapDownload() {
  const urls = parkTileUrls();
  const total = urls.length;
  const [cached, setCached] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => { cachedTileCount(urls).then(setCached).catch(() => setCached(0)); }, [busy]); // eslint-disable-line react-hooks/exhaustive-deps
  const complete = cached >= total * 0.95;
  const start = async () => {
    setBusy(true); setDone(0); abort.current = new AbortController();
    try { await downloadParkTiles(setDone, abort.current.signal); } finally { setBusy(false); }
  };
  return (
    <div className="box audio-download">
      <span className="kicker">MAPA SIN CONEXIÓN</span>
      <p>
        {complete
          ? `El mapa del parque está guardado en este dispositivo (${cached} teselas, unos ${Math.round(total * 18 / 1024)} MB). Se verá aunque no haya cobertura.`
          : `El mapa se guarda solo a medida que lo ves, pero puedes descargar ahora toda la zona del yacimiento en cuatro niveles de zoom (${total} teselas, unos ${Math.round(total * 18 / 1024)} MB). Mapa © OpenStreetMap contributors.`}
      </p>
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
        <button type="button" className="btn btn-primary btn-block" onClick={start}>⤓ DESCARGAR MAPA DEL PARQUE</button>
      )}
    </div>
  );
}
