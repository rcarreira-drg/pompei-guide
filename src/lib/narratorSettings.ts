/** Preferencias del reproductor de narración (persistidas). */
export interface NarratorSettings {
  rate: number;
  voiceURI?: string;
  /** Narrar automáticamente al llegar a una parada. Opt-in: nunca activo por defecto. */
  autoplayOnArrival?: boolean;
  /** Vibrar al llegar a una parada no visitada. */
  vibrateOnArrival?: boolean;
}
const KEY = 'pompei-guide:narrator';
const DEFAULT: NarratorSettings = { rate: 1, autoplayOnArrival: false, vibrateOnArrival: true };
export function loadNarratorSettings(): NarratorSettings {
  try { const raw = localStorage.getItem(KEY); return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT; } catch { return DEFAULT; }
}
export function saveNarratorSettings(s: NarratorSettings) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } }
