// Descarga los elementos con nombre dentro del parque (OSM/Overpass) para buscar coordenadas por nombre.
import { writeFileSync } from 'node:fs';
const q = `[out:json][timeout:60];(node["name"](40.7440,14.4740,40.7570,14.5000);way["name"](40.7440,14.4740,40.7570,14.5000);relation["name"](40.7440,14.4740,40.7570,14.5000););out center tags;`;
const r = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(q), headers: { 'User-Agent': 'pompei-guide/1.0 (educational)' } });
const j = await r.json();
const out = j.elements.map(e => ({ name: e.tags.name, alt: e.tags['name:it'] || e.tags.alt_name || e.tags.official_name || '', type: e.tags.historic || e.tags.tourism || e.tags.amenity || e.tags.building || '', lat: e.lat ?? e.center?.lat, lng: e.lon ?? e.center?.lon })).filter(e => e.lat && /casa|domus|villa|terme|tempio|porta|necropoli|thermopol|fullonica|caupona|officina|osteria|bottega|panificio|conceria|schola|caserma|palestra|foro|teatro|odeion|comitium|granai|mensa|castellum|torre|santuario|insula|antiquarium|orto|praedia|arco|macellum|basilica|lupanar/i.test(e.name));
writeFileSync('scripts/osm-names.json', JSON.stringify(out, null, 1));
console.log(out.length, 'elementos con nombre');
