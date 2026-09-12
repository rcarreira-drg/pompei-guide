// Narración pregrabada con Piper TTS (voz libre es_ES).
// Cada "pista" (parada en ruta completa / exprés, presentación de ruta) es UN archivo mp3 continuo
// para que siga sonando con la pantalla bloqueada. Los clips se cachean por hash en el scratch.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
const SCRATCH = '/tmp/claude-1000/-home-rodri-pompei-guide/17b5432f-d492-4198-98f5-51a7bd804e66/scratchpad';
const VOICE = process.env.VOICE || 'es_ES-davefx-medium';
const PIPER = `${SCRATCH}/piper-venv/bin/python`;
const VDIR = `${SCRATCH}/voices`;
const CLIPS = `${SCRATCH}/clips-${VOICE}`; mkdirSync(CLIPS, { recursive: true });

await build({ entryPoints: ['src/content/route.ts', 'src/lib/express.ts'], bundle: true, format: 'esm', outdir: `${SCRATCH}/bundle`, platform: 'node' });
const { ROUTE } = await import(`${SCRATCH}/bundle/content/route.js`);
const { EXPRESS_IDS } = await import(`${SCRATCH}/bundle/lib/express.js`);
const express = new Set(EXPRESS_IDS);
const clean = t => t.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const dur = f => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

function clipWav(text) {
  const c = clean(text);
  const h = createHash('sha1').update(VOICE + '|' + c).digest('hex').slice(0, 12);
  const wav = `${CLIPS}/${h}.wav`;
  if (!existsSync(wav)) {
    const txt = `${CLIPS}/${h}.txt`; writeFileSync(txt, c + '\n');
    execFileSync(PIPER, ['-m', 'piper', '-m', `${VDIR}/${VOICE}.onnx`, '-c', `${VDIR}/${VOICE}.onnx.json`, '-i', txt, '-f', wav, '--sentence-silence', '0.45', '--length-scale', '1.05'], { stdio: 'ignore' });
    rmSync(txt);
  }
  return { wav, h, d: dur(wav) };
}
/** Une clips (con 0,8 s de silencio entre párrafos) en un mp3 y devuelve tiempos de inicio. */
function track(key, texts) {
  const clips = texts.map(clipWav);
  const id = createHash('sha1').update(clips.map(c => c.h).join('+')).digest('hex').slice(0, 10);
  const dir = `public/audio/${key.replace(':', '-')}`; mkdirSync(dir, { recursive: true });
  const mp3 = `${dir}/${id}.mp3`;
  if (!existsSync(mp3)) {
    const list = `${SCRATCH}/concat-${id}.txt`;
    const gap = `${CLIPS}/gap.wav`;
    if (!existsSync(gap)) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=22050:cl=mono', '-t', '0.8', gap]);
    writeFileSync(list, clips.flatMap((c, i) => (i ? [`file '${gap}'`] : []).concat([`file '${c.wav}'`])).join('\n') + '\n');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-af', 'loudnorm=I=-18:TP=-2', '-c:a', 'libmp3lame', '-b:a', '48k', '-ac', '1', mp3]);
    rmSync(list);
  }
  for (const f of readdirSync(dir)) if (f !== `${id}.mp3`) rmSync(`${dir}/${f}`);
  const starts = []; let t = 0;
  clips.forEach((c, i) => { if (i) t += 0.8; starts.push(Math.round(t * 10) / 10); t += c.d; });
  return { file: `audio/${key.replace(':', '-')}/${id}.mp3`, starts, durations: clips.map(c => Math.round(c.d * 10) / 10), total: Math.round(dur(mp3)) };
}

const manifest = {}; let total = 0;
const add = (key, texts) => { if (!texts.length) return; const tr = track(key, texts); manifest[key] = tr; total += tr.total; console.log(key, texts.length, 'párrafos', tr.total, 's'); };
if (ROUTE.logic?.length) add('route:completa', ROUTE.logic);
if (ROUTE.logicExpress?.length) add('route:express', ROUTE.logicExpress);
for (const s of ROUTE.stops) {
  add(s.id, [s.intro, ...s.narration, ...(s.whyNext ? [s.whyNext] : [])]);
  if (express.has(s.id) && s.whyNextExpress) add(`${s.id}:express`, [s.intro, ...s.narration, s.whyNextExpress]);
}
// carpetas huérfanas
const keep = new Set(Object.keys(manifest).map(k => k.replace(':', '-')));
for (const d of readdirSync('public/audio')) if (!keep.has(d)) rmSync(`public/audio/${d}`, { recursive: true });

writeFileSync('src/content/audio.ts', `/** Narración pregrabada (Piper TTS, voz libre ${VOICE}). Generado por scripts/build-audio.mjs — no editar a mano. */
export interface AudioTrack { file: string; starts: number[]; durations: number[]; total: number }
/** Claves: '<stopId>' (ruta completa), '<stopId>:express', 'route:completa', 'route:express'. */
export const AUDIO: Record<string, AudioTrack> = ${JSON.stringify(manifest, null, 1)};
export const AUDIO_VOICE = '${VOICE}';
export const audioUrl = (file: string) => import.meta.env.BASE_URL + file;
`);
console.log('TOTAL', Math.round(total / 60), 'min');
