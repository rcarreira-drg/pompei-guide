/** Conmutadores de llegada: narrar sola y/o vibrar al entrar en el radio de una parada. */
import { useState } from 'react';
import { loadNarratorSettings, saveNarratorSettings, type NarratorSettings } from '@/lib/narratorSettings';

export default function ArrivalToggle() {
  const [settings, setSettings] = useState<NarratorSettings>(() => loadNarratorSettings());

  const update = (patch: Partial<NarratorSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveNarratorSettings(next);
  };

  return (
    <div className="arrival-toggle box">
      <div className="arrival-toggle-buttons" role="group" aria-label="Opciones al llegar a una parada">
        <button
          type="button"
          className={`btn ${settings.autoplayOnArrival ? 'btn-accent' : ''}`}
          aria-pressed={Boolean(settings.autoplayOnArrival)}
          onClick={() => update({ autoplayOnArrival: !settings.autoplayOnArrival })}
        >
          NARRAR AL LLEGAR
        </button>
        <button
          type="button"
          className={`btn ${settings.vibrateOnArrival ? 'btn-accent' : ''}`}
          aria-pressed={Boolean(settings.vibrateOnArrival)}
          onClick={() => update({ vibrateOnArrival: !settings.vibrateOnArrival })}
        >
          VIBRAR AL LLEGAR
        </button>
      </div>
      <p className="mono arrival-toggle-hint">
        Con el GPS activo, al llegar a una parada el móvil vibra y, si lo activáis, empieza a narrar.
      </p>
    </div>
  );
}
