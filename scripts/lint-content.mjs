// Comprobador de estilo de la narración: paréntesis, palabras prohibidas, markdown, recuento de palabras.
import { build } from 'esbuild';
const SCRATCH = '/tmp/claude-1000/-home-rodri-pompei-guide/17b5432f-d492-4198-98f5-51a7bd804e66/scratchpad';
await build({ entryPoints: ['src/content/route.ts', 'src/content/extra.ts', 'src/content/official-entries.ts'], bundle: true, format: 'esm', outdir: `${SCRATCH}/lint`, platform: 'node' });
const { ROUTE } = await import(`${SCRATCH}/lint/route.js`);
const { EXTRA_STOPS } = await import(`${SCRATCH}/lint/extra.js`);
const { OFFICIAL_ENTRIES } = await import(`${SCRATCH}/lint/official-entries.js`);
const BAD = /\b(impresionante|espectacular|no os podéis perder|auténtico tesoro|majestuos[oa]|imprescindible visita)\b/i;
const wc = t => t.split(/\s+/).filter(Boolean).length;
const issues = []; const rows = [];
function check(label, texts, min, max) {
  const all = texts.join(' ');
  const w = wc(all);
  if (w < min || w > max) issues.push(`${label}: ${w} palabras (esperado ${min}-${max})`);
  if (/[()]/.test(all)) issues.push(`${label}: contiene paréntesis`);
  if (/\*\*|\$\{/.test(all)) issues.push(`${label}: markdown o plantilla`);
  const m = all.match(BAD); if (m) issues.push(`${label}: palabra de folleto "${m[0]}"`);
  if (/\b(miren|paren|fíjense|observen|imaginen|sigan|salgan|vuelvan|crucen|bajen|giren)\b/i.test(all)) issues.push(`${label}: registro "ustedes"`);
  rows.push([label, w]);
}
for (const s of ROUTE.stops) { check(`route/${s.id}`, [s.intro, ...s.narration], 430, 700); if (s.whyNext) check(`route/${s.id}/whyNext`, [s.whyNext], 45, 130); if (s.whyNextExpress) check(`route/${s.id}/whyNextExpress`, [s.whyNextExpress], 40, 120); }
check('route/logic', ROUTE.logic ?? [], 300, 600); check('route/logicExpress', ROUTE.logicExpress ?? [], 180, 400);
for (const s of EXTRA_STOPS) check(`extra/${s.id}`, [s.intro, ...s.narration], 100, 260);
for (const [k, e] of Object.entries(OFFICIAL_ENTRIES)) check(`official/${k}`, [e.intro, ...e.narration], 90, 230);
console.log(`revisados ${rows.length} textos; ${issues.length} incidencias`);
for (const i of issues) console.log(' -', i);
process.exit(issues.length ? 1 : 0);
