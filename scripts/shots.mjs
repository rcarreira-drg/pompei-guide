import { chromium, devices } from 'playwright';
const base = 'http://127.0.0.1:4173/pompei-guide/#';
const out = process.argv[2] || '/tmp/claude-1000/-home-rodri-pompei-guide/17b5432f-d492-4198-98f5-51a7bd804e66/scratchpad/shots';
import { mkdirSync } from 'node:fs'; mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'], geolocation: { latitude: 40.7484, longitude: 14.4816 }, permissions: ['geolocation'], locale: 'es-ES' });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
const routes = { home: '/', preparar: '/preparar', cap: '/preparar/erupcion', visita: '/visita', parada: '/visita/foro', practico: '/practico', ...(process.argv[3] ? JSON.parse(process.argv[3]) : {}) };
for (const [n, r] of Object.entries(routes)) {
  await page.goto(base + r, { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${n}.png`, fullPage: true });
  await page.screenshot({ path: `${out}/${n}-fold.png` });
}
console.log('errors:', errs.filter(e => !/tile|favicon|ERR_/.test(e)));
await browser.close();
