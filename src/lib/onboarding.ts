/**
 * Estado del onboarding (pantallas de bienvenida) y utilidades de plataforma
 * para las instrucciones de instalación como app.
 */
const KEY = 'pompei-guide:onboarded';
const SESSION_KEY = 'pompei-guide:onboarding-redirected';

/** ¿El usuario ya ha visto (o saltado) el onboarding? */
export function isOnboarded(): boolean {
  try { return localStorage.getItem(KEY) === '1'; } catch { return true; }
}

/** Marca el onboarding como visto (SALTAR o EMPEZAR). */
export function setOnboarded() {
  try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
}

/** ¿Ya se ha forzado la redirección a "/bienvenida/1" en esta pestaña? Evita repetirla si el usuario vuelve a "/" sin completar el onboarding. */
export function hasRedirectedThisSession(): boolean {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return true; }
}

export function markRedirectedThisSession() {
  try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
}

/** ¿La app ya está instalada y ejecutándose como app (standalone)? */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const mql = typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return Boolean(mql || iosStandalone);
}

export type Platform = 'android' | 'ios' | 'other';

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  return 'other';
}

export interface InstallHint { title: string; steps: string[] }

/** Instrucciones para instalar la app como acceso directo, según la plataforma detectada. */
export function platformHint(): InstallHint {
  if (isStandalone()) {
    return { title: 'YA INSTALADA', steps: ['Ya la tienes instalada: la estás usando como app en este dispositivo.'] };
  }
  const platform = detectPlatform();
  if (platform === 'android') {
    return {
      title: 'ANDROID',
      steps: [
        'Toca el menú ⋮ del navegador (arriba a la derecha).',
        'Elige "Añadir a pantalla de inicio" o "Instalar aplicación".',
      ],
    };
  }
  if (platform === 'ios') {
    return {
      title: 'IPHONE / IPAD (SAFARI)',
      steps: [
        'Toca el icono Compartir (el cuadrado con la flecha hacia arriba).',
        'Elige "Añadir a pantalla de inicio".',
      ],
    };
  }
  return {
    title: 'ORDENADOR',
    steps: ['Busca el icono de instalar en la barra de direcciones, o el menú del navegador → "Instalar aplicación".'],
  };
}
