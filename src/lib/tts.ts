/** Narración con Web Speech API (gratuita, sin assets). Voz en español si está disponible. */
let current: SpeechSynthesisUtterance | null = null;
export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => /^es-ES/i.test(v.lang)) || voices.find(v => /^es/i.test(v.lang));
}
export function speak(text: string, onEnd?: () => void, onError?: (msg: string) => void) {
  if (!ttsSupported()) return;
  stop();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES';
  u.rate = 0.95;
  const v = pickVoice();
  if (v) u.voice = v;
  u.onend = () => { current = null; onEnd?.(); };
  u.onerror = (e) => { current = null; if (e.error === 'interrupted' || e.error === 'canceled') return; onError ? onError(e.error || 'error') : onEnd?.(); };
  current = u;
  window.speechSynthesis.speak(u);
}
export function stop() { if (ttsSupported()) { window.speechSynthesis.cancel(); current = null; } }
export function isSpeaking() { return ttsSupported() && window.speechSynthesis.speaking; }
export function pause() { if (ttsSupported()) window.speechSynthesis.pause(); }
export function resume() { if (ttsSupported()) window.speechSynthesis.resume(); }
export const hasCurrent = () => current !== null;
