import { test, expect, type Page } from '@playwright/test';

// A diferencia de tests/app.spec.ts, aquí NO marcamos "pompei-guide:onboarded" de
// antemano: estas pruebas son precisamente las que verifican el propio onboarding
// (primera visita, saltar, recorrerlo, /ayuda...).

const errors: string[] = [];
test.beforeEach(({ page }) => {
  errors.length = 0;
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
});
test.afterEach(() => {
  const real = errors.filter((e) => !/favicon|tile\.openstreetmap|net::ERR|Failed to load resource/i.test(e));
  expect(real, 'sin errores de consola').toEqual([]);
});

async function noHorizontalScroll(page: Page) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(sw, 'sin scroll horizontal').toBeLessThanOrEqual(cw + 1);
}

test('primera visita a "/" redirige a la bienvenida', async ({ page }) => {
  await page.goto('#/');
  await expect(page).toHaveURL(/#\/bienvenida\/1$/);
  await expect(page.locator('section[aria-roledescription="pantalla"]')).toHaveAttribute('aria-label', '1 de 7');
});

test('SALTAR lleva a Inicio y marca el onboarding como visto', async ({ page }) => {
  await page.goto('#/');
  await expect(page).toHaveURL(/#\/bienvenida\/1$/);
  await page.getByRole('button', { name: /saltar/i }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/POMPEYA/i);

  const flag = await page.evaluate(() => localStorage.getItem('pompei-guide:onboarded'));
  expect(flag).toBe('1');

  // Al recargar (o volver a "/"), ya no debe reaparecer el onboarding.
  await page.reload();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.locator('.onboarding-screen')).toHaveCount(0);
});

test('recorre las 7 pantallas con SIGUIENTE y termina con EMPEZAR', async ({ page }) => {
  await page.goto('#/bienvenida/1');
  for (let n = 1; n <= 6; n++) {
    await expect(page.locator('section[aria-roledescription="pantalla"]')).toHaveAttribute('aria-label', `${n} de 7`);
    await page.getByRole('button', { name: /^siguiente/i }).click();
    await expect(page).toHaveURL(new RegExp(`#/bienvenida/${n + 1}$`));
  }
  await expect(page.locator('section[aria-roledescription="pantalla"]')).toHaveAttribute('aria-label', '7 de 7');
  await expect(page.getByRole('button', { name: /^siguiente/i })).toHaveCount(0);
  await page.getByRole('button', { name: /^empezar$/i }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/POMPEYA/i);
});

test('ANTERIOR retrocede y los puntos de progreso permiten saltar de pantalla', async ({ page }) => {
  await page.goto('#/bienvenida/3');
  await expect(page.locator('section[aria-roledescription="pantalla"]')).toHaveAttribute('aria-label', '3 de 7');
  await page.getByRole('button', { name: /anterior/i }).click();
  await expect(page).toHaveURL(/#\/bienvenida\/2$/);

  await page.getByRole('tab', { name: /ir a la pantalla 5 de 7/i }).click();
  await expect(page).toHaveURL(/#\/bienvenida\/5$/);
});

test('"/ayuda" muestra las 7 secciones y no oculta la barra inferior', async ({ page }) => {
  await page.goto('#/ayuda');
  await expect(page.getByRole('heading', { name: /cómo funciona/i })).toBeVisible();
  const sections = page.locator('section[aria-roledescription="pantalla"]');
  await expect(sections).toHaveCount(7);
  for (let n = 1; n <= 7; n++) {
    await expect(sections.nth(n - 1)).toHaveAttribute('aria-label', `${n} de 7`);
  }
  await expect(page.locator('.bottom-nav')).toBeVisible();
});

test('la barra inferior no es visible durante el onboarding', async ({ page }) => {
  await page.goto('#/bienvenida/1');
  await expect(page.locator('.bottom-nav')).toHaveCount(0);
});

test('sin scroll horizontal a 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  for (const n of [1, 2, 4, 5, 7]) {
    await page.goto(`#/bienvenida/${n}`);
    await noHorizontalScroll(page);
  }
  await page.goto('#/ayuda');
  await noHorizontalScroll(page);
});

test('enlaces "¿Cómo funciona?" desde Inicio y Práctico', async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('pompei-guide:onboarded', '1'); } catch { /* ignore */ } });
  await page.goto('#/');
  await page.getByRole('link', { name: /cómo funciona/i }).click();
  await expect(page).toHaveURL(/#\/ayuda$/);

  await page.goto('#/practico');
  await page.getByRole('link', { name: /cómo funciona/i }).click();
  await expect(page).toHaveURL(/#\/ayuda$/);
});
