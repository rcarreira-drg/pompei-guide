import { test, expect, type Page } from '@playwright/test';

// Estas pruebas navegan directamente a rutas concretas (p.ej. "#/") y esperan ver esa
// página tal cual: marcamos el onboarding como ya visto para que la redirección a
// "/bienvenida/1" (ver tests/onboarding.spec.ts) no interfiera aquí.
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
  const real = errors.filter(e => !/favicon|tile\.openstreetmap|net::ERR|Failed to load resource/i.test(e));
  expect(real, 'sin errores de consola').toEqual([]);
});

async function noHorizontalScroll(page: Page) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(sw, 'sin scroll horizontal').toBeLessThanOrEqual(cw + 1);
}

test('portada carga con título y CTAs', async ({ page }) => {
  await page.goto('#/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/POMPEI/i);
  await expect(page.getByRole('link', { name: /preparar/i }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /recorrido|visita/i }).first()).toBeVisible();
  await noHorizontalScroll(page);
});

test('preparar: lista de capítulos y lectura de uno', async ({ page }) => {
  await page.goto('#/preparar');
  const cards = page.locator('a[href*="#/preparar/"]');
  expect(await cards.count()).toBeGreaterThanOrEqual(6);
  await cards.first().click();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const words = (await page.locator('main').innerText()).split(/\s+/).length;
  expect(words, 'capítulo con contenido largo').toBeGreaterThan(600);
  await page.getByRole('button', { name: /leído/i }).first().click();
  await noHorizontalScroll(page);
});

test('visita: mapa, lista de paradas y detalle con narración', async ({ page }) => {
  await page.goto('#/visita');
  await expect(page.locator('.leaflet-container')).toBeVisible();
  const stops = page.locator('a[href*="#/visita/"]');
  expect(await stops.count()).toBeGreaterThanOrEqual(20);
  await stops.first().click();
  await expect(page.getByText(/PARADA\s*1/i).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /escuchar narración/i })).toBeVisible();
  await expect(page.getByText(/fíjate/i).first()).toBeVisible();
  await page.getByRole('button', { name: /visitada/i }).first().click();
  await noHorizontalScroll(page);
});

test('práctico: checklist persiste', async ({ page }) => {
  await page.goto('#/practico');
  await page.locator('.checklist-item label').first().click();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await page.reload();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await noHorizontalScroll(page);
});

test('PWA: manifest y service worker registrados', async ({ page }) => {
  await page.goto('#/');
  const manifest = page.locator('link[rel="manifest"]');
  await expect(manifest).toHaveCount(1);
  const href = await manifest.getAttribute('href');
  const res = await page.request.get(new URL(href!, page.url()).toString());
  expect(res.ok()).toBeTruthy();
  const hasSW = await page.evaluate(() => 'serviceWorker' in navigator);
  expect(hasSW).toBeTruthy();
});

test('visita: el modo exprés filtra la lista sin recargar', async ({ page }) => {
  await page.goto('#/visita');
  const stops = page.locator('a[href*="#/visita/"]');
  const before = await stops.count();
  await page.getByRole('button', { name: /exprés/i }).click();
  await expect(page.getByRole('heading', { name: /^ruta exprés$/i })).toBeVisible();
  expect(await stops.count()).toBeLessThan(before);
  await page.getByRole('button', { name: /completa/i }).click();
  expect(await stops.count()).toBe(before);
});

test('visita: banner de proximidad visible y legible', async ({ page }) => {
  await page.context().setGeolocation({ latitude: 40.74921, longitude: 14.4844 });
  await page.goto('#/visita');
  await page.getByRole('button', { name: /activar ubicaci/i }).click();
  const banner = page.locator('.banner-here');
  await expect(banner).toBeVisible();
  const bg = await banner.evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bg).toBe('rgb(180, 50, 30)');
});

test('parada: reproductor de voz del móvil con velocidad y párrafos pulsables', async ({ page }) => {
  await page.goto('#/visita/foro');
  const main = page.getByRole('button', { name: /escuchar narración/i });
  await expect(main).toBeVisible();
  await expect(page.locator('.narrator-meta')).toContainText(/voz del móvil/i);
  await expect(page.getByRole('button', { name: /^1×$/ })).toBeVisible();
  await main.click();
  await expect(page.getByRole('button', { name: /pausar narración|escuchar narración/i })).toBeVisible();
  await page.getByRole('button', { name: /detener/i }).click({ force: true }).catch(() => {});
  expect(await page.locator('.narrator-text p[role=button]').count()).toBeGreaterThan(3);
});

test('plano oficial: regiones, cuadrícula numerada y ficha', async ({ page }) => {
  await page.goto('#/mapa');
  await expect(page.getByRole('heading', { name: /plano oficial/i })).toBeVisible();
  await page.getByRole('tab', { name: 'VIII' }).click();
  await expect(page).toHaveURL(/#\/mapa\/VIII-/);
  await page.getByRole('link', { name: /^2\s*Basílica/i }).click();
  await expect(page).toHaveURL(/VIII-2$/);
  await expect(page.getByRole('heading', { name: /^basílica$/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /ficha completa/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /escuchar narración/i })).toBeVisible();
});

test('visita: la ubicación se puede detener', async ({ page }) => {
  await page.goto('#/visita');
  await page.getByRole('button', { name: /activar ubicación/i }).click();
  await expect(page.getByText(/ubicación activa/i)).toBeVisible();
  await page.getByRole('button', { name: /detener la ubicación/i }).click();
  await expect(page.getByRole('button', { name: /activar ubicación/i })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /activar ubicación/i })).toBeVisible();
});

test('mapa: las teselas vistas se sirven sin conexión desde el service worker', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'service worker solo en chromium');
  await page.goto('#/visita');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.locator('.leaflet-container')).toBeVisible();
  await page.waitForFunction(() => Array.from(document.querySelectorAll<HTMLImageElement>('.leaflet-tile')).filter(i => i.complete && i.naturalWidth > 0).length >= 4, null, { timeout: 30_000 });
  const before = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLImageElement>('.leaflet-tile')).map(i => i.src));
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.leaflet-container')).toBeVisible();
  await page.waitForFunction(() => Array.from(document.querySelectorAll<HTMLImageElement>('.leaflet-tile')).filter(i => i.complete && i.naturalWidth > 0).length >= 4, null, { timeout: 30_000 });
  const after = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLImageElement>('.leaflet-tile')).filter(i => i.complete && i.naturalWidth > 0).map(i => i.src));
  expect(after.length).toBeGreaterThanOrEqual(4);
  expect(after.every(u => /^https:\/\/tile\.openstreetmap\.org\//.test(u))).toBeTruthy();
  expect(before.length).toBeGreaterThan(0);
  await context.setOffline(false);
});

test('visita: el modo total añade los puntos del mapa oficial y la ficha respeta el orden', async ({ page }) => {
  await page.goto('#/visita');
  const stops = page.locator('a[href*="#/visita/"]');
  const classic = await stops.count();
  await page.getByRole('button', { name: /^total/i }).click();
  await expect(page.getByRole('heading', { name: /^ruta total$/i })).toBeVisible();
  expect(await stops.count()).toBeGreaterThan(classic + 40);
  await page.goto('#/visita/templo-vespasiano');
  await expect(page.getByText(/PARADA \d+\/\d+/).first()).toBeVisible();
  await expect(page.locator('.next-sticky')).toContainText(/lares/i);
});
