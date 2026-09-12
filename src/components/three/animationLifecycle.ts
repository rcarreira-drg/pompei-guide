export interface AnimationLifecycleHandlers {
  /** Actualiza y renderiza un fotograma. Recibe segundos transcurridos desde el montaje. */
  onFrame: (elapsedSeconds: number) => void;
  /** Se llama al montar y cada vez que cambia el tamaño del contenedor (en px CSS). */
  onResize: (width: number, height: number) => void;
  /** Renderiza un único fotograma estático (usado con `prefers-reduced-motion: reduce`). */
  renderStaticFrame: () => void;
}

/**
 * Gestiona el ciclo de vida de una animación WebGL respetuosa con el rendimiento:
 * - Pausa el bucle `requestAnimationFrame` cuando el elemento no es visible
 *   (IntersectionObserver) o la pestaña está oculta (`visibilitychange`).
 * - Redimensiona con `ResizeObserver`.
 * - Con `prefers-reduced-motion: reduce`, renderiza un único fotograma estático y no
 *   arranca ningún bucle.
 * Devuelve una función de limpieza que desconecta todos los observadores.
 */
export function attachAnimationLifecycle(container: HTMLElement, handlers: AnimationLifecycleHandlers): () => void {
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = reduceMotionQuery.matches;

  let rafId: number | null = null;
  let running = false;
  let isIntersecting = false;
  let isTabVisible = document.visibilityState !== 'hidden';
  const startedAt = performance.now();

  function loop(now: number) {
    rafId = requestAnimationFrame(loop);
    handlers.onFrame((now - startedAt) / 1000);
  }

  function play() {
    if (running || prefersReducedMotion) return;
    running = true;
    rafId = requestAnimationFrame(loop);
  }

  function pause() {
    running = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function evaluate() {
    if (isIntersecting && isTabVisible && !prefersReducedMotion) play();
    else pause();
  }

  const io = new IntersectionObserver(
    (entries) => {
      isIntersecting = entries.some((e) => e.isIntersecting);
      evaluate();
    },
    { threshold: 0.01 },
  );
  io.observe(container);

  function onVisibilityChange() {
    isTabVisible = document.visibilityState !== 'hidden';
    evaluate();
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  const ro = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    if (width > 0 && height > 0) handlers.onResize(width, height);
  });
  ro.observe(container);

  const rect = container.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) handlers.onResize(rect.width, rect.height);

  if (prefersReducedMotion) {
    handlers.renderStaticFrame();
  }

  return function cleanup() {
    pause();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}
