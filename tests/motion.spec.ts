import { test, expect } from '@playwright/test';

// Comprueba las transiciones discretas de la Parte B (docs/MOTION-SPEC.md):
// el contenedor de página recibe la clase "page-enter" al navegar, y con
// prefers-reduced-motion:reduce no queda ninguna animación en curso.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('pompei-guide:onboarded', '1'); } catch { /* ignore */ } });
});

test('el contenedor de página tiene la clase page-enter tras navegar', async ({ page }) => {
  await page.goto('#/');
  await page.getByRole('link', { name: /preparar/i }).first().click();
  await expect(page).toHaveURL(/#\/preparar/);
  const pageEnter = page.locator('#main > .page-enter');
  await expect(pageEnter).toHaveCount(1);
});

test('con reduced motion no hay animaciones en curso', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('#/');
  await page.getByRole('link', { name: /preparar/i }).first().click();
  await expect(page).toHaveURL(/#\/preparar/);
  const running = await page.evaluate(() => {
    const el = document.querySelector('#main > .page-enter');
    return el ? el.getAnimations().length : -1;
  });
  expect(running).toBe(0);
});
