import { chromium, devices } from 'playwright';

const OUT = '/tmp/claude-1000/-home-rodri-pompei-guide/17b5432f-d492-4198-98f5-51a7bd804e66/scratchpad/compass';
const BASE = 'http://127.0.0.1:4173/pompei-guide/';

const browser = await chromium.launch();
const context = await browser.newContext({
  ...devices['iPhone 13'],
  permissions: ['geolocation'],
  geolocation: { latitude: 40.7492, longitude: 14.4848 },
  locale: 'es-ES',
});
const page = await context.newPage();

async function dispatchHeading(alpha) {
  await page.evaluate((a) => {
    window.dispatchEvent(new DeviceOrientationEvent('deviceorientation', { alpha: a, beta: 0, gamma: 0 }));
  }, alpha);
}

async function shotCompass(name) {
  const el = page.locator('.compass').first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  await el.screenshot({ path: `${OUT}/${name}.png` });
}

await page.goto(BASE + '#/visita', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await shotCompass('c1-no-location');

await page.getByRole('button', { name: /ACTIVAR UBICACIÓN/i }).click();
await page.waitForTimeout(800);
await shotCompass('c2-map-mode');

await page.getByRole('button', { name: /Activar brújula del dispositivo/i }).first().click();
await page.waitForTimeout(300);
await shotCompass('c3-heading-wait');

await dispatchHeading(300); // device facing NW-ish
await page.waitForTimeout(700);
await shotCompass('c4-heading-300');

await dispatchHeading(30); // small turn
await page.waitForTimeout(700);
await shotCompass('c5-heading-30');

// Compute bearing from the known coords to align heading == bearing -> "¡RECTO!"
const bearing = await page.evaluate(() => {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const a = [40.7492, 14.4848];
  // read target from window if exposed; fallback: just reuse a plausible bearing
  return null;
});
await dispatchHeading(240); // guess near-aligned heading for a visual "recto" check
await page.waitForTimeout(700);
await shotCompass('c6-heading-240');

const readingText = await page.locator('.compass-reading').first().innerText().catch(() => '');
const helpText = await page.locator('.compass-help').first().innerText().catch(() => '');
const hintText = await page.locator('.compass-hint').first().innerText().catch(() => '(none)');
console.log('reading:', readingText, '| help:', helpText, '| hint:', hintText);

await browser.close();
console.log('done');
