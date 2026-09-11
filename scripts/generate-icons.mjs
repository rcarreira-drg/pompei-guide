// Genera los iconos PWA (192x192 y 512x512) a partir de public/icons/favicon.svg
// Fondo sólido #111111 (sin transparencia), estilo brutalista.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const svgPath = path.join(root, 'public/icons/favicon.svg');
const svg = fs.readFileSync(svgPath);

async function renderIcon(size, outName) {
  const outPath = path.join(root, 'public/icons', outName);
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .flatten({ background: '#111111' })
    .png()
    .toFile(outPath);
  console.log('wrote', outPath);
}

await renderIcon(192, 'icon-192.png');
await renderIcon(512, 'icon-512.png');
