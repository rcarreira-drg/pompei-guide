import { test, expect, type Page } from '@playwright/test';

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
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/POMPEYA/i);
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
  await expect(page.getByRole('button', { name: /escuchar/i })).toBeVisible();
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
