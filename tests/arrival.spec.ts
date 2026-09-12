import { test, expect } from '@playwright/test';

// Igual que en app.spec.ts: marcamos el onboarding como visto y vigilamos errores de consola.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('pompei-guide:onboarded', '1'); } catch { /* ignore */ } });
});

const errors: string[] = [];
test.beforeEach(({ page }) => {
  errors.length = 0;
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
});
test.afterEach(() => {
  const real = errors.filter(e => !/favicon|tiles\.openfreemap|net::ERR|Failed to load resource|AJAXError/i.test(e));
  expect(real, 'sin errores de consola').toEqual([]);
});

test('visita: el conmutador de llegada persiste tras recargar', async ({ page }) => {
  await page.goto('#/visita');
  const narrar = page.getByRole('button', { name: /narrar al llegar/i });
  await expect(narrar).toHaveAttribute('aria-pressed', 'false');
  await narrar.click();
  await expect(narrar).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.getByRole('button', { name: /narrar al llegar/i })).toHaveAttribute('aria-pressed', 'true');
});

test('visita: al llegar junto al Foro el banner "ESTÁS EN" lo muestra', async ({ page }) => {
  // Coordenadas de la parada "Foro" (src/content/route.ts).
  await page.context().setGeolocation({ latitude: 40.749447, longitude: 14.484825 });
  await page.goto('#/visita');
  await page.getByRole('button', { name: /activar ubicaci/i }).click();
  const banner = page.locator('.banner-here');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText(/foro/i);
});

test('visita: desambiguación por orden de ruta entre dos paradas cercanas', async ({ page }) => {
  // "Teatro Grande" (orden 16, ruta clásica) y "Templo de Júpiter Meilichio" (orden 16.1, solo en
  // el modo total) están a menos de 40 m entre sí (ver script de comprobación en el scratchpad de
  // la sesión). Con la posición en su punto medio y ambas sin visitar, debe elegirse la de menor
  // orden: Teatro Grande.
  await page.context().setGeolocation({ latitude: 40.7488475, longitude: 14.488458 });
  await page.goto('#/visita');
  await page.getByRole('button', { name: /^total/i }).click();
  await page.getByRole('button', { name: /activar ubicaci/i }).click();
  const banner = page.locator('.banner-here');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText(/teatro grande/i);
});

test('visita: con narración automática activada, llegar a una parada navega a su ficha', async ({ page }) => {
  await page.goto('#/visita');
  await page.getByRole('button', { name: /narrar al llegar/i }).click();
  await expect(page.getByRole('button', { name: /narrar al llegar/i })).toHaveAttribute('aria-pressed', 'true');

  await page.context().setGeolocation({ latitude: 40.749447, longitude: 14.484825 });
  await page.getByRole('button', { name: /activar ubicaci/i }).click();

  await expect(page).toHaveURL(/#\/visita\/foro/);
  // No comprobamos audio real (headless no tiene voces instaladas): solo que el Narrator se
  // renderiza sin error de consola (verificado por el afterEach global).
  await expect(page.getByRole('button', { name: /escuchar narración|pausar narración/i })).toBeVisible();
});
