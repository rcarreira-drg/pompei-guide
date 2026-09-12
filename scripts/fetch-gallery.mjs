#!/usr/bin/env node
/**
 * Descarga las imágenes de la GALERÍA de referencia de cada parada (campo `gallery`
 * de Stop en src/content/route.ts) desde Wikimedia Commons, reutilizando la misma
 * lógica de verificación de licencia y procesado que scripts/fetch-images.mjs.
 *
 * A diferencia de fetch-images.mjs, este script es INCREMENTAL: lee el
 * src/content/images.ts existente, y solo descarga los ids de GALLERY_ID_TO_FILE
 * que todavía no estén en el manifiesto. Así se puede ejecutar por lotes (p.ej.
 * seis paradas cada vez) sin volver a descargar todo lo ya hecho.
 *
 * Uso: node scripts/fetch-gallery.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public/img');
const CONTENT_FILE = path.join(ROOT, 'src/content/images.ts');

const UA = 'pompei-guide/1.0 (educational project; contact rcarreira@drgit.io)';
const API = 'https://commons.wikimedia.org/w/api.php';

const MAIN_WIDTH = 1400;
const SM_WIDTH = 640;
const JPEG_QUALITY = Number(process.env.GALLERY_JPEG_QUALITY || 70);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, opts = {}, tries = 6) {
  let delay = 15000;
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, ...opts });
    if (res.status === 429) {
      console.warn(`  429 recibido, esperando ${delay / 1000}s...`);
      await sleep(delay);
      delay = Math.min(delay * 1.6, 180000);
      continue;
    }
    return res;
  }
  return fetch(url, { headers: { 'User-Agent': UA }, ...opts });
}

// id lógico -> título de archivo en Wikimedia Commons (sin el prefijo "File:")
// Solo ids NUEVOS de galería. Los ids reutilizados de images.ts (p.ej. 'macellum',
// 'templo-jupiter', 'arco-caligula', 'graffiti', 'calcos-yeso'...) NO van aquí:
// ya están descargados y se referencian directamente desde route.ts.
const GALLERY_ID_TO_FILE = {
  // --- Lote 1 (paradas 1-6) ---
  'porta-marina-g1': 'I08 130a Porta Marina, Durchfahröffnung.jpg',
  'porta-marina-g2': 'I08 128 Pompeii, Rampe zur Porta Marina.jpg',
  'porta-marina-g3':
    'South view near Porta Marina, Archaeological Park of Pompeii, Italy (PPL1-Corrected) julesvernex2.jpg',
  'templo-venus-g1': 'I08 131 Venustempel.jpg',
  'templo-venus-g2': 'Colonna a Pompei.JPG',
  'templo-venus-g3': 'Pompeii - Temple of Venus.jpg',
  'basilica-g1': 'Basilica, Pompeii 01.jpg',
  'basilica-g2': 'Basilica (Pompei) WLM 003.JPG',
  'templo-apolo-g1': 'Pompeii Ruins Temple of Apollo & Bronze Statue of Apollo (48440752001).jpg',
  'templo-apolo-g2': 'Altar temple of apollo 1000650.jpg',
  'templo-apolo-g3': 'Ingresso del tempio di Apollo.JPG',
  'foro-g1': 'Foro (Pompei) WLM 002.JPG',
  'edificio-eumachia-g1': 'Eumachia building (Pompeii) - columns.jpg',
  'edificio-eumachia-g2': 'Macellum (Pompeii).jpg',

  // --- Lote 2 (paradas 7-12) ---
  'termas-foro-g1': 'Pompeii forum baths changing room.jpg',
  'termas-foro-g2': 'Terme del Foro IMG 0075.JPG',
  'casa-poeta-tragico-g1':
    'Pompeii, House of the Tragic Poet (Pompeii) with Impluvium and Lararium (48443768027).jpg',
  'casa-fauno-g1': 'Modern copy of the Dancing Faun (in Pompeii).jpg',
  'casa-fauno-g2': 'Casa del fauno entrada 09.JPG',
  'casa-vettii-g1': 'Casa dei Vettii WLM24 (132).jpg',
  'casa-vettii-g2': 'Casa dei Vettii WLM24 (112).jpg',
  'lupanar-g1': 'Lupanar de Pompeya, Italia, 2016 01.jpg',
  'lupanar-g2': 'Pompeya lupanar.jpg',
  'termas-estabianas-g1': 'Estabianas patio 01.JPG',
  'termas-estabianas-g2': 'Estucos. Terme Stabiane. 02.JPG',

  // --- Lote 3 (paradas 13-18) ---
  'via-abbondanza-g1': "Fountain at Via dell'Abbondanza.jpg",
  'via-abbondanza-g2': 'Campaign inscription in Pompeii.jpg',
  'fullonica-stephanus-g1': 'Impluvia in Fullonica of Stephanus (Pompeii).jpg',
  'fullonica-stephanus-g2':
    'The atrium of the Fullonica of Stephanus, one of the most important and complete laundries found in Pompeii, with a tub for washing clothes, Pompeii (47970999208).jpg',
  'casa-menandro-g1': 'Menander fresco in the House of Menander (Pompeii) (48442910712).jpg',
  'casa-menandro-g2': 'Atrio nella Casa del Menandro.jpg',
  'teatro-grande-g1': 'I08 141 großes Theater.jpg',
  'teatro-grande-g2': 'Colonne del Quadriportico dei Teatri di Pompei.jpg',
  'templo-isis-g1': 'Isis Pompeya 17.JPG',
  'templo-isis-g2': 'Italie Pompei Temple Isis - panoramio.jpg',
  'casa-venus-concha-g1': 'Venus Anadyomenes in the House of Venus (Pompeii).jpg',
  'casa-venus-concha-g2': 'Casa Delle Venere in Conchiglia.jpg',

  // --- Lote 4 (paradas 19-24) ---
  'casa-octavio-cuartio-g1': 'Casa di Ottavio Quartione (Pompeii) - Giardino (Pompeii).jpg',
  'casa-octavio-cuartio-g2': 'Altarino nella casa di Ottavio Quartione a Pompei.jpg',
  'jardin-fugitivos-g1': 'Orto dei Fuggiaschi 02.jpg',
  'palestra-grande-g1': 'Palaestra of Pompeii (48443186896).jpg',
  'palestra-grande-g2': 'Colonnato della Palestra Grande nelle rovine di Pompei.jpg',
  'anfiteatro-g1': 'Amphitheatre (Pompeii) - Gate.jpg',
  'necropolis-porta-nocera-g1':
    'Aedicula Tomb of Publius Vesonius Phileros, Vesonia, and Marcus Orfellius Faustus, Publius Vesonius Pileros, Publius Vesonius Proculus, Vesonia Urbana, Eliodorus - Pompeii Scavi (49347302041).jpg',
  'necropolis-porta-nocera-g2': 'Necropoli Porta Nocera (3).jpg',
  'villa-misterios-g1': 'Villa dei misteri, ingresso.jpg',
};

// Alt text (para el manifiesto images.ts; el alt mostrado en cada parada se
// define aparte, en route.ts, dentro de cada objeto de `gallery`).
const GALLERY_ALT_ES = {
  'porta-marina-g1': 'Pasadizo estrecho y abovedado para peatones en la Porta Marina',
  'porta-marina-g2': 'Rampa de acceso a la Porta Marina vista desde el exterior de la muralla',
  'porta-marina-g3': 'Tramo de muralla de Pompeya visto desde fuera, cerca de la Porta Marina',
  'templo-venus-g1': 'Terraza del Templo de Venus con restos de columnas y del podio',
  'templo-venus-g2': 'Restos de una columna corintia en el Templo de Venus de Pompeya',
  'templo-venus-g3': 'Columna y restos del podio del Templo de Venus de Pompeya',
  'basilica-g1': 'Columnas de ladrillo de la Basílica de Pompeya vistas desde dentro',
  'basilica-g2': 'Doble fila de columnas de la Basílica de Pompeya',
  'templo-apolo-g1': 'Reproducción en bronce de Apolo tensando el arco en el Templo de Apolo',
  'templo-apolo-g2': 'Altar de mármol frente a la escalinata del Templo de Apolo',
  'templo-apolo-g3': 'Patio porticado del Templo de Apolo visto entre sus columnas jónicas',
  'foro-g1': 'Pórtico de columnas en uno de los lados largos del Foro de Pompeya',
  'edificio-eumachia-g1': 'Columnas de la entrada porticada del Edificio de Eumáquia',
  'edificio-eumachia-g2': 'Vista general del patio del Macellum, mercado de Pompeya',

  'termas-foro-g1': 'Vestuario masculino de las Termas del Foro con su techo abovedado',
  'termas-foro-g2': 'Hornacinas del vestuario de las Termas del Foro',
  'casa-poeta-tragico-g1': 'Atrio con impluvio y larario de la Casa del Poeta Trágico',
  'casa-fauno-g1': 'Reproducción del fauno danzante de la Casa del Fauno',
  'casa-fauno-g2': 'Entrada o fauces de la Casa del Fauno en Pompeya',
  'casa-vettii-g1': 'Peristilo con columnas de la Casa de los Vettii',
  'casa-vettii-g2': 'Sala con paneles rojos del cuarto estilo en la Casa de los Vettii',
  'lupanar-g1': 'Cartel identificativo de la entrada al Lupanar de Pompeya',
  'lupanar-g2': 'Fachada exterior del Lupanar de Pompeya con su piso superior',
  'termas-estabianas-g1': 'Pórtico columnado de la palestra de las Termas Estabianas',
  'termas-estabianas-g2': 'Relieve de estuco sobre una puerta de las Termas Estabianas',

  'via-abbondanza-g1': "Fuente pública de piedra en la Via dell'Abbondanza",
  'via-abbondanza-g2': 'Pintada electoral o programma en una fachada de Pompeya',
  'fullonica-stephanus-g1': 'Pilas escalonadas de lavado en la Fullonica de Stephanus',
  'fullonica-stephanus-g2': 'Antiguo atrio con pila de lavado en la Fullonica de Stephanus',
  'casa-menandro-g1': 'Fresco con el retrato del comediógrafo Menandro',
  'casa-menandro-g2': 'Atrio con columnas de la Casa del Menandro',
  'teatro-grande-g1': 'Gradas y orquesta del Teatro Grande de Pompeya',
  'teatro-grande-g2': 'Columnas del Cuadripórtico de los Teatros de Pompeya',
  'templo-isis-g1': 'Pequeño templete del recinto del Templo de Isis',
  'templo-isis-g2': 'Podio, columnas y escalinata del Templo de Isis',
  'casa-venus-concha-g1': 'Fresco de Venus en la concha marina, Casa de la Venus en la Concha',
  'casa-venus-concha-g2': 'Peristilo ajardinado de la Casa de la Venus en la Concha',

  'casa-octavio-cuartio-g1': 'Canal de agua o eurípo en el jardín de la Casa de Octavio Cuartio',
  'casa-octavio-cuartio-g2': 'Cenador o biclinium junto al canal de la Casa de Octavio Cuartio',
  'jardin-fugitivos-g1': 'Antiguo viñedo replantado en el Jardín de los Fugitivos, con el Vesubio al fondo',
  'palestra-grande-g1': 'Patio arbolado de la Palestra Grande de Pompeya',
  'palestra-grande-g2': 'Pórtico de columnas de la Palestra Grande de Pompeya',
  'anfiteatro-g1': 'Rampa de acceso a la arena del Anfiteatro de Pompeya',
  'necropolis-porta-nocera-g1': 'Tumba de Publio Vesonio Filerote en la Necrópolis de Porta Nocera',
  'necropolis-porta-nocera-g2': 'Fila de tumbas entre cipreses en la Necrópolis de Porta Nocera',
  'villa-misterios-g1': 'Pórtico columnado de la Villa de los Misterios',
};

function stripHtml(s) {
  if (!s) return '';
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function isFreeLicense(shortName, licenseRaw) {
  const s = `${shortName || ''} ${licenseRaw || ''}`.toLowerCase();
  if (!s.trim()) return false;
  if (s.includes('nc') || s.includes('nd') || s.includes('non-commercial') || s.includes('no derivative')) {
    return false;
  }
  return (
    s.includes('public domain') ||
    s.includes('cc0') ||
    s.includes('pdm') ||
    s.includes('cc by') ||
    s.includes('cc-by')
  );
}

async function getImageInfo(title) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    titles: `File:${title}`,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: String(MAIN_WIDTH),
    origin: '*',
  });
  const res = await fetchWithRetry(`${API}?${params}`);
  if (!res.ok) throw new Error(`API HTTP ${res.status} para ${title}`);
  const data = await res.json();
  const pages = data.query && data.query.pages;
  if (!pages) throw new Error(`Respuesta sin "pages" para ${title}`);
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined) throw new Error(`Archivo no encontrado: ${title}`);
  const info = page.imageinfo && page.imageinfo[0];
  if (!info) throw new Error(`Sin imageinfo para ${title}`);
  const em = info.extmetadata || {};
  return {
    thumburl: info.thumburl || info.url,
    descriptionurl: info.descriptionurl,
    artist: stripHtml(em.Artist && em.Artist.value),
    licenseShortName: em.LicenseShortName && em.LicenseShortName.value,
    license: em.License && em.License.value,
    licenseUrl: em.LicenseUrl && em.LicenseUrl.value,
  };
}

async function downloadBuffer(url) {
  const res = await fetchWithRetry(url);
  if (!res.ok) throw new Error(`Descarga HTTP ${res.status} desde ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function processAndSave(buffer, id) {
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const mainPath = path.join(IMG_DIR, `${id}.jpg`);
  const mainImage = sharp(buffer).rotate().resize({ width: MAIN_WIDTH, withoutEnlargement: true });
  const mainInfo = await mainImage
    .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
    .toFile(mainPath);

  const smPath = path.join(IMG_DIR, `${id}-sm.jpg`);
  await sharp(buffer)
    .rotate()
    .resize({ width: SM_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
    .toFile(smPath);

  return { width: mainInfo.width, height: mainInfo.height };
}

function buildCredit(artist, licenseShortName) {
  const license = licenseShortName || 'Licencia libre';
  if (artist) return `${artist} — ${license}, Wikimedia Commons`;
  return `${license}, Wikimedia Commons`;
}

function generateImagesTs(entries) {
  const lines = [];
  lines.push('/**');
  lines.push(' * Manifiesto de imágenes. Todas deben ser de dominio público o CC (Wikimedia Commons)');
  lines.push(' * y estar descargadas en public/img/<id>.jpg (optimizadas, ≤1400px de ancho).');
  lines.push(' * Rellenado por el agente de imágenes; las claves se usan como `src` lógico.');
  lines.push(' *');
  lines.push(' * Generado automáticamente por scripts/fetch-images.mjs y scripts/fetch-gallery.mjs');
  lines.push(' * — no editar a mano.');
  lines.push(' */');
  lines.push('export interface ImageMeta {');
  lines.push('  id: string;');
  lines.push("  file: string;        // ruta relativa a public, p.ej. 'img/foro.jpg'");
  lines.push('  alt: string;');
  lines.push('  credit: string;      // "Autor — CC BY-SA 4.0, Wikimedia Commons"');
  lines.push('  sourceUrl: string;');
  lines.push('  width: number;');
  lines.push('  height: number;');
  lines.push('}');
  lines.push('export const IMAGES: Record<string, ImageMeta> = {');
  for (const e of entries) {
    lines.push(`  ${JSON.stringify(e.id)}: {`);
    lines.push(`    id: ${JSON.stringify(e.id)},`);
    lines.push(`    file: ${JSON.stringify(e.file)},`);
    lines.push(`    alt: ${JSON.stringify(e.alt)},`);
    lines.push(`    credit: ${JSON.stringify(e.credit)},`);
    lines.push(`    sourceUrl: ${JSON.stringify(e.sourceUrl)},`);
    lines.push(`    width: ${e.width},`);
    lines.push(`    height: ${e.height},`);
    lines.push('  },');
  }
  lines.push('};');
  lines.push(
    "export const img = (id: string) => IMAGES[id]?.file ? `${import.meta.env.BASE_URL}${IMAGES[id].file}` : '';"
  );
  lines.push(
    "export const imgSm = (id: string) => {\n  const meta = IMAGES[id];\n  if (!meta?.file) return '';\n  const smFile = meta.file.replace(/\\.jpg$/, '-sm.jpg');\n  return `${import.meta.env.BASE_URL}${smFile}`;\n};"
  );
  lines.push('');
  return lines.join('\n');
}

/** Lee el images.ts actual y extrae el objeto IMAGES como datos JS (no como TS). */
function readExistingImages() {
  const src = fs.readFileSync(CONTENT_FILE, 'utf8');
  const start = src.indexOf('export const IMAGES');
  const braceStart = src.indexOf('{', start);
  // Buscar el cierre de llave que empareja, contando anidamiento.
  let depth = 0;
  let end = -1;
  for (let i = braceStart; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const objLiteral = src.slice(braceStart, end + 1);
  // eslint-disable-next-line no-new-func
  const obj = Function(`"use strict"; return (${objLiteral});`)();
  return obj; // { id: {id,file,alt,credit,sourceUrl,width,height}, ... }
}

function writeImages(entriesById) {
  const list = Object.values(entriesById);
  fs.writeFileSync(CONTENT_FILE, generateImagesTs(list));
}

async function main() {
  const existing = readExistingImages();
  const existingIds = new Set(Object.keys(existing));
  const pending = Object.keys(GALLERY_ID_TO_FILE).filter((id) => !existingIds.has(id));

  console.log(`Imágenes ya presentes en images.ts: ${Object.keys(existing).length}`);
  console.log(`Ids de galería pendientes de descargar: ${pending.length}`);
  if (pending.length === 0) {
    console.log('Nada que hacer.');
    return;
  }

  const entriesById = { ...existing };
  let ok = 0;
  const skipped = [];

  for (const id of pending) {
    const title = GALLERY_ID_TO_FILE[id];
    process.stdout.write(`- ${id} (${title})... `);
    try {
      const info = await getImageInfo(title);
      if (!isFreeLicense(info.licenseShortName, info.license)) {
        console.log(`RECHAZADA (licencia: ${info.licenseShortName || info.license || 'desconocida'})`);
        skipped.push({ id, title, reason: `licencia no libre: ${info.licenseShortName || info.license}` });
        continue;
      }
      if (!info.thumburl) {
        console.log('RECHAZADA (sin URL de descarga)');
        skipped.push({ id, title, reason: 'sin thumburl' });
        continue;
      }
      const buffer = await downloadBuffer(info.thumburl);
      const { width, height } = await processAndSave(buffer, id);
      const credit = buildCredit(info.artist, info.licenseShortName || info.license);
      entriesById[id] = {
        id,
        file: `img/${id}.jpg`,
        alt: GALLERY_ALT_ES[id] || id,
        credit,
        sourceUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title)}`,
        width,
        height,
      };
      ok++;
      console.log(`OK (${width}x${height}, ${info.licenseShortName || info.license})`);
      // Guardado incremental: si el proceso se corta, no se pierde lo ya hecho.
      writeImages(entriesById);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      skipped.push({ id, title, reason: err.message });
    }
    await sleep(2500);
  }

  console.log('\n=== Resumen fetch-gallery ===');
  console.log(`Descargadas: ${ok}`);
  if (skipped.length) {
    console.log(`Omitidas: ${skipped.length}`);
    for (const s of skipped) console.log(`  - ${s.id}: ${s.reason}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
