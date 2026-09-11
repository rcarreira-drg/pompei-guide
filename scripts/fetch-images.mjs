#!/usr/bin/env node
/**
 * Descarga las imágenes del manifiesto de contenido desde Wikimedia Commons.
 *
 * Para cada id de la lista canónica (docs/BRIEF.md) hay un título de archivo de
 * Commons ("File:...") ya investigado y verificado como dominio público o CC
 * (BY / BY-SA / CC0), horizontal cuando ha sido posible y sin restricciones NC/ND.
 *
 * Proceso por id:
 *  1. Pide metadatos + URL de miniatura a la API de Commons (action=query,
 *     prop=imageinfo, iiurlwidth=1400).
 *  2. Verifica que la licencia es libre (rechaza NC/ND).
 *  3. Descarga la miniatura de 1400px de ancho.
 *  4. La procesa con sharp: público/img/<id>.jpg (máx 1400px ancho, JPEG q78,
 *     progressive) y public/img/<id>-sm.jpg (640px ancho, misma calidad).
 *  5. Registra ancho/alto reales del archivo final y compone src/content/images.ts.
 *
 * Uso: node scripts/fetch-images.mjs
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
const JPEG_QUALITY = 70;

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
const ID_TO_FILE = {
  'vesubio-panoramica': 'Ruins of Pompeii with the Vesuvius.jpg',
  'foro-vesubio':
    'Pompeii, Forum with Temple of Jupiter and Arco onorario with Vesuvius in the background, 2016 (2).jpg',
  'foro-columnas': 'Forum in Pompeii 3.jpg',
  anfiteatro: 'Amphitheatre of Pompeii, Exterior, Noon.jpg',
  'anfiteatro-interior': 'Pompeji - Arena.jpg',
  'teatro-grande': 'Teatro Grande Pompeii.jpg',
  odeon: 'Odeon of Pompeii, side entrance.jpg',
  'via-abbondanza': "Via dell'Abbondanza (Pompeii).jpg",
  'via-stabiana-adoquines': 'Via Stabiana with Porta di Stabia in Pompeii 2006.jpg',
  'termopolio-asellina': 'Thermopolium di Asellina 1.JPG',
  'termopolio-regio-v': 'Thermopolium - Pompeii Scavi (54537716223).jpg',
  'casa-fauno': 'Colonnade house faun Pompeii.jpg',
  'mosaico-alejandro':
    'Alexander and Bucephalus - Battle of Issus mosaic - Museo Archeologico Nazionale - Naples BW.jpg',
  'casa-vettii-fresco': 'Ancient Roman frescos in the House of the Vettii (Pompeii)-6.jpg',
  'casa-vettii-priapo': 'Priapus Fresco Detail.jpg',
  'villa-misterios-fresco':
    'Pompeii Ruins Scenes of a Dionysiac Mystery Cult, Villa of the Mysteries Fresco, c. 50 BC (48445612742).jpg',
  'villa-misterios-exterior': 'Villa dei Misteri (Pompei) WLM 007.JPG',
  'lupanar-fresco': 'Pompeii - Lupanar - Couple2.jpg',
  'termas-estabianas': "Men's apodyterium (changing room) of the Stabian Baths Pompeii Prowalk.jpg",
  'termas-foro': 'Caldarium with Labrum in the Forum Baths Pompeii ProWalk Tours.jpg',
  'calcos-yeso': 'Plaster Cast Body (15910425865).jpg',
  'jardin-fugitivos': 'Orto dei Fuggiaschi 12.JPG',
  'templo-apolo': 'Temple of Apollo - Tempio di Apollo, Pompeii (5139).jpg',
  'templo-jupiter': 'Temple of Jupiter Pompeii.jpg',
  'templo-isis':
    'Pompeii, Temple of Isis, East Portico, Harpocrates Niche with a reproduction of a Fresco (48442486262).jpg',
  basilica: 'Basilica (Pompei) WLM 002.JPG',
  'panaderia-horno': 'Bakery with oven and mills Pompeii ProWalk Tours.jpg',
  // 'pan-carbonizado': sin imagen satisfactoria en Commons, omitida (ver informe).
  'porta-marina': 'I08 129 Porta Marina.jpg',
  'cave-canem':
    'Cave Cavem mosaic floor in the vestibulum of the House of the Tragic Poet, Pompeii (14402122118).jpg',
  'casa-menandro': 'Casa del Menandro, Garden, Pompeii (4970).jpg',
  'palestra-grande': 'Pompeji great palaestra.jpg',
  'fullonica-stephanus': 'Fullonica of Stephanus (Pompeii) (48443555206).jpg',
  graffiti: 'Pompeii graffiti.jpg',
  'necropolis-porta-nocera': 'Tombs and mausoleums at Necropolis of Porta Nocera. Pompeii. Italy.jpg',
  'arco-caligula': 'Arch of Caligula Pompeii ProWalk Tours 03.jpg',
  macellum: 'Macellum (Pompeii) - Courtyard with tholos (48441993746).jpg',
  'edificio-eumachia': 'Building of Eumachia, Pompeii Forum, Entrance.jpg',
  lararium: 'Lararium (household shrine) in the thermopolium of Lucius Vetutius Placidus.jpg',
  'erupcion-pintura': 'Destruction of Pompeii and Herculaneum.jpg',
  'plinio-grabado': 'Pliny the Elder.png',
  'plano-historico':
    '1832 S.D.U.K. City Plan or Map of Pompeii, Italy - Geographicus - Pompeii-SDUK-1832.jpg',
  'fiorelli-retrato': 'Bust of Giuseppe Fiorelli - DPLA - 606d51f38a4e8bbc12e817ef405f1429.jpg',
  'herculano-papiros': 'Herculaneum papyri.jpg',
  'perro-mosaico': 'Cave canem - beware of the dog.jpg',
  'cocina-romana': 'Grill with handle (for cooking meat and fish) Roman, Pompeii, House of the Vettii, AD 1-79 (51357506688).jpg',
  anfora: 'Pompeii Ruins Pottery Amphorae (48440850197).jpg',
  'escritorio-tablillas':
    'Fresco showing a woman so-called Sappho holding writing implements, from Pompeii, Naples National Archaeological Museum (14842101892).jpg',
  'calle-fuente':
    "Pompeii, Ancient Roman Fountain at the junction of Via Stabiana and Via dell'Abbondanza (48441020961).jpg",
  comitium: 'Comitium 1.JPG',
};

// Alt text descriptivo en español para cada id.
const ALT_ES = {
  'vesubio-panoramica': 'El Vesubio visto desde las ruinas de Pompeya',
  'foro-vesubio': 'El Foro de Pompeya con el Vesubio al fondo',
  'foro-columnas': 'Columnas del Foro de Pompeya',
  anfiteatro: 'Exterior del anfiteatro de Pompeya',
  'anfiteatro-interior': 'Interior de la arena del anfiteatro de Pompeya',
  'teatro-grande': 'El Teatro Grande de Pompeya',
  odeon: 'El Odeón (teatro pequeño) de Pompeya',
  'via-abbondanza': "La Via dell'Abbondanza, arteria principal de Pompeya",
  'via-stabiana-adoquines': 'La Via Stabiana con la Porta di Stabia al fondo',
  'termopolio-asellina': 'El termopolio de Asellina, con su mostrador de mármol',
  'termopolio-regio-v': 'Termopolio excavado en la Regio V de Pompeya',
  'casa-fauno': 'Columnata de la Casa del Fauno',
  'mosaico-alejandro': 'El Mosaico de Alejandro, Museo Arqueológico de Nápoles',
  'casa-vettii-fresco': 'Frescos romanos en la Casa de los Vettii',
  'casa-vettii-priapo': 'Detalle del fresco de Príapo en la Casa de los Vettii',
  'villa-misterios-fresco': 'Escena del culto dionisíaco en la Villa de los Misterios',
  'villa-misterios-exterior': 'Exterior de la Villa de los Misterios',
  'lupanar-fresco': 'Fresco erótico del Lupanar de Pompeya',
  'termas-estabianas': 'Vestuario (apodyterium) de las Termas Estabianas',
  'termas-foro': 'Caldarium de las Termas del Foro',
  'calcos-yeso': 'Calco de yeso de una víctima de la erupción',
  'jardin-fugitivos': 'El Jardín de los Fugitivos, con los calcos de las víctimas',
  'templo-apolo': 'El Templo de Apolo de Pompeya',
  'templo-jupiter': 'El Templo de Júpiter en el Foro de Pompeya',
  'templo-isis': 'El Templo de Isis de Pompeya',
  basilica: 'La Basílica de Pompeya',
  'panaderia-horno': 'Horno y molinos de una panadería de Pompeya',
  'porta-marina': 'La Porta Marina, entrada principal a Pompeya',
  'cave-canem': 'Mosaico "Cave Canem" en la Casa del Poeta Trágico',
  'casa-menandro': 'Jardín de la Casa del Menandro',
  'palestra-grande': 'La Gran Palestra de Pompeya',
  'fullonica-stephanus': 'La Fullonica de Stephanus, tintorería romana',
  graffiti: 'Grafitos antiguos conservados en los muros de Pompeya',
  'necropolis-porta-nocera': 'Tumbas de la necrópolis de Porta Nocera',
  'arco-caligula': 'El Arco de Calígula, junto al Foro',
  macellum: 'Patio del Macellum, mercado de Pompeya',
  'edificio-eumachia': 'Entrada al Edificio de Eumachia, en el Foro',
  lararium: 'Larario (altar doméstico) en un termopolio de Pompeya',
  'erupcion-pintura': 'La destrucción de Pompeya y Herculano, óleo de John Martin',
  'plinio-grabado': 'Retrato de Plinio el Viejo',
  'plano-historico': 'Plano histórico de Pompeya, 1832',
  'fiorelli-retrato': 'Busto de Giuseppe Fiorelli',
  'herculano-papiros': 'Papiros carbonizados de Herculano',
  'perro-mosaico': 'Mosaico "Cave Canem" con un perro guardián',
  'cocina-romana': 'Utensilio de cocina romano hallado en Pompeya',
  anfora: 'Ánforas romanas entre las ruinas de Pompeya',
  'escritorio-tablillas': 'Fresco de mujer con estilo y tablillas de cera (la "Safo")',
  'calle-fuente': 'Fuente pública en un cruce de calles de Pompeya',
  comitium: 'El Comitium, edificio de voto del Foro de Pompeya',
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
    // ojo: "cc by-nc" o "cc by-nd" contienen "nc"/"nd" como sub-cadena de esas siglas
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
  lines.push(' * Generado automáticamente por scripts/fetch-images.mjs — no editar a mano.');
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

async function main() {
  const entries = [];
  const skipped = [];
  const ids = Object.keys(ID_TO_FILE);
  console.log(`Procesando ${ids.length} imágenes...`);

  for (const id of ids) {
    const title = ID_TO_FILE[id];
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
      entries.push({
        id,
        file: `img/${id}.jpg`,
        alt: ALT_ES[id] || id,
        credit,
        sourceUrl: info.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(title)}`,
        width,
        height,
      });
      console.log(`OK (${width}x${height}, ${info.licenseShortName || info.license})`);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      skipped.push({ id, title, reason: err.message });
    }
    await sleep(2500);
  }

  fs.writeFileSync(CONTENT_FILE, generateImagesTs(entries));

  console.log('\n=== Resumen ===');
  console.log(`Descargadas: ${entries.length}`);
  if (skipped.length) {
    console.log(`Omitidas: ${skipped.length}`);
    for (const s of skipped) console.log(`  - ${s.id}: ${s.reason}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
