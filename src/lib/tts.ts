/**
 * Voz del sistema (Web Speech API) como respaldo de la narración pregrabada.
 * - Trocea en frases para evitar el corte de ~15 s de Chrome.
 * - Elige la mejor voz en español disponible (neuronales de Google/Microsoft/Apple primero).
 * - "Pausa" se implementa como cancelar + recordar la frase, porque pause()/resume() falla en Android.
 */
export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

const PREFERRED = [/google español/i, /natural/i, /neural/i, /premium/i, /enhanced/i, /mónica|monica/i, /jorge/i, /paulina/i, /elvira/i, /alvaro|álvaro/i];
let voicesCache: SpeechSynthesisVoice[] = [];
function loadVoices(): SpeechSynthesisVoice[] {
  if (!ttsSupported()) return [];
  const v = window.speechSynthesis.getVoices();
  if (v.length) voicesCache = v;
  return voicesCache;
}
if (ttsSupported()) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}
export function spanishVoices(): SpeechSynthesisVoice[] {
  return loadVoices().filter(v => /^es[-_]/i.test(v.lang) || v.lang === 'es');
}
export function bestVoice(preferredURI?: string): SpeechSynthesisVoice | undefined {
  const es = spanishVoices();
  if (preferredURI) { const p = es.find(v => v.voiceURI === preferredURI); if (p) return p; }
  const esES = es.filter(v => /^es[-_]ES/i.test(v.lang));
  const pool = esES.length ? esES : es;
  for (const re of PREFERRED) { const m = pool.find(v => re.test(v.name)); if (m) return m; }
  return pool.find(v => !v.localService) ?? pool[0];
}
export function splitSentences(text: string): string[] {
  const clean = text.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  const parts = clean.match(/[^.!?…]+[.!?…]+["»)]?\s*|[^.!?…]+$/g) ?? [clean];
  // agrupa frases muy cortas para que la prosodia no se rompa
  const out: string[] = [];
  for (const p of parts) {
    const t = p.trim(); if (!t) continue;
    if (out.length && (out[out.length - 1].length + t.length) < 140) out[out.length - 1] += ' ' + t;
    else out.push(t);
  }
  return out;
}

export interface SpeakOptions { rate?: number; voiceURI?: string; onEnd?: () => void; onError?: (msg: string) => void; onSentence?: (i: number, total: number) => void }
let session = 0;
let currentSentences: string[] = [];
let currentIndex = 0;
let currentOpts: SpeakOptions = {};

function speakSentence(mySession: number) {
  if (mySession !== session) return;
  if (currentIndex >= currentSentences.length) { currentOpts.onEnd?.(); return; }
  const u = new SpeechSynthesisUtterance(currentSentences[currentIndex]);
  u.lang = 'es-ES';
  u.rate = currentOpts.rate ?? 1;
  u.pitch = 1;
  const v = bestVoice(currentOpts.voiceURI);
  if (v) { u.voice = v; u.lang = v.lang; }
  currentOpts.onSentence?.(currentIndex, currentSentences.length);
  u.onend = () => { if (mySession !== session) return; currentIndex++; speakSentence(mySession); };
  u.onerror = (e) => {
    if (mySession !== session) return;
    if (e.error === 'interrupted' || e.error === 'canceled') return;
    currentOpts.onError?.(e.error || 'error');
  };
  window.speechSynthesis.speak(u);
}
/** Lee un texto (troceado en frases). Devuelve false si no hay soporte. */
export function speak(text: string, opts: SpeakOptions = {}): boolean {
  if (!ttsSupported()) return false;
  stop();
  currentSentences = splitSentences(text);
  currentIndex = 0;
  currentOpts = opts;
  session++;
  // Chrome a veces se queda "paused" tras un cancel(); nos aseguramos de reanudar
  window.speechSynthesis.resume();
  speakSentence(session);
  return true;
}
export function stop() { if (ttsSupported()) { session++; window.speechSynthesis.cancel(); } }
/** Pausa robusta: cancela y recuerda la frase actual. */
export function pause() { if (ttsSupported()) { session++; window.speechSynthesis.cancel(); } }
export function resume() { if (!ttsSupported()) return; session++; window.speechSynthesis.resume(); speakSentence(session); }
export const isSpeaking = () => ttsSupported() && window.speechSynthesis.speaking;
