// Genera narración pregrabada con Piper TTS (voz libre es_ES) → public/audio/<stop>/<n>.mp3 + src/content/audio.ts
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { build } from 'esbuild';
const SCRATCH = '/tmp/claude-1000/-home-rodri-pompei-guide/17b5432f-d492-4198-98f5-51a7bd804e66/scratchpad';
const VOICE = process.env.VOICE || 'es_ES-davefx-medium';
const PIPER = `${SCRATCH}/piper-venv/bin/python`;
const VDIR = `${SCRATCH}/voices`;
const ONLY = process.argv[2]; // opcional: id de parada

await build({ entryPoints: ['src/content/route.ts'], bundle: true, format: 'esm', outfile: `${SCRATCH}/route.bundle.mjs`, platform: 'node' });
const { ROUTE } = await import(`${SCRATCH}/route.bundle.mjs`);
const manifest = {};
let total = 0;
for (const stop of ROUTE.stops) {
  if (ONLY && stop.id !== ONLY) continue;
  const parts = [stop.intro, ...stop.narration];
  const dir = `public/audio/${stop.id}`; mkdirSync(dir, { recursive: true });
  const files = [], durations = [];
  parts.forEach((text, i) => {
    const txt = `${SCRATCH}/tts-${stop.id}-${i}.txt`, wav = `${SCRATCH}/tts-${stop.id}-${i}.wav`, mp3 = `${dir}/${i}.mp3`;
    if (!existsSync(mp3) || process.env.FORCE) {
      writeFileSync(txt, text.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim() + '\n');
      execFileSync(PIPER, ['-m', 'piper', '-m', `${VDIR}/${VOICE}.onnx`, '-c', `${VDIR}/${VOICE}.onnx.json`, '-i', txt, '-f', wav, '--sentence-silence', '0.45', '--length-scale', '1.05'], { stdio: 'ignore' });
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav, '-af', 'loudnorm=I=-18:TP=-2', '-c:a', 'libmp3lame', '-b:a', '48k', '-ac', '1', mp3]);
      rmSync(txt); rmSync(wav);
    }
    const d = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).toString());
    files.push(`audio/${stop.id}/${i}.mp3`); durations.push(Math.round(d * 10) / 10); total += d;
  });
  manifest[stop.id] = { files, durations };
  console.log(stop.id, parts.length, 'clips', Math.round(durations.reduce((a, b) => a + b, 0)), 's');
}
if (!ONLY) {
  const ts = `/** Narración pregrabada (Piper TTS, voz libre ${VOICE}). Generado por scripts/build-audio.mjs — no editar a mano. */
export interface StopAudio { files: string[]; durations: number[] }
export const AUDIO: Record<string, StopAudio> = ${JSON.stringify(manifest, null, 1)};
export const AUDIO_VOICE = '${VOICE}';
export const audioUrl = (file: string) => import.meta.env.BASE_URL + file;
`;
  writeFileSync('src/content/audio.ts', ts);
  console.log('TOTAL', Math.round(total / 60), 'min');
}
