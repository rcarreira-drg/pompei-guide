/** Persistencia local sencilla y segura (try/catch para modos privados). */
const KEY = 'pompei-guide:v1';
export interface Progress {
  visited: Record<string, string>; // stopId -> ISO date
  checklist: Record<string, boolean>;
  read: Record<string, boolean>;   // sectionId -> leído
  currentStop?: string;
  routeStartedAt?: string;
}
const empty = (): Progress => ({ visited: {}, checklist: {}, read: {} });
export function loadProgress(): Progress {
  try { const raw = localStorage.getItem(KEY); return raw ? { ...empty(), ...JSON.parse(raw) } : empty(); }
  catch { return empty(); }
}
export function saveProgress(p: Progress) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
}
export function resetProgress() { try { localStorage.removeItem(KEY); } catch { /* ignore */ } }
