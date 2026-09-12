/** Clima en Pompei vía Open-Meteo (gratuito, sin API key). */
export interface DayWeather {
  date: string;        // YYYY-MM-DD
  tmax: number; tmin: number;
  uvMax: number;
  precipProb: number;  // %
  code: number;        // WMO weather code
  sunrise: string; sunset: string;
}
export interface NowWeather { temp: number; code: number; wind: number; isDay: boolean }
export interface Weather { now: NowWeather; days: DayWeather[]; fetchedAt: string }

const LAT = 40.7505, LON = 14.4865;
const URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,weather_code,wind_speed_10m,is_day` +
  `&daily=temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,weather_code,sunrise,sunset` +
  `&timezone=Europe%2FRome&forecast_days=7`;
const CACHE_KEY = 'pompei-guide:weather';

export async function fetchWeather(): Promise<Weather> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const w = JSON.parse(cached) as Weather;
      if (Date.now() - new Date(w.fetchedAt).getTime() < 30 * 60 * 1000) return w;
    }
  } catch { /* ignore */ }
  const res = await fetch(URL);
  if (!res.ok) throw new Error('weather ' + res.status);
  const j = await res.json();
  const days: DayWeather[] = j.daily.time.map((d: string, i: number) => ({
    date: d,
    tmax: Math.round(j.daily.temperature_2m_max[i]),
    tmin: Math.round(j.daily.temperature_2m_min[i]),
    uvMax: Math.round(j.daily.uv_index_max[i] ?? 0),
    precipProb: j.daily.precipitation_probability_max[i] ?? 0,
    code: j.daily.weather_code[i],
    sunrise: j.daily.sunrise[i].slice(11, 16),
    sunset: j.daily.sunset[i].slice(11, 16),
  }));
  const w: Weather = {
    now: { temp: Math.round(j.current.temperature_2m), code: j.current.weather_code, wind: Math.round(j.current.wind_speed_10m), isDay: j.current.is_day === 1 },
    days, fetchedAt: new Date().toISOString(),
  };
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(w)); } catch { /* ignore */ }
  return w;
}

export function wmoLabel(code: number): string {
  if (code === 0) return 'Despejado';
  if (code <= 2) return 'Poco nuboso';
  if (code === 3) return 'Cubierto';
  if (code <= 49) return 'Niebla';
  if (code <= 59) return 'Llovizna';
  if (code <= 69) return 'Lluvia';
  if (code <= 79) return 'Nieve';
  if (code <= 84) return 'Chubascos';
  return 'Tormenta';
}
export function heatAdvice(d: DayWeather): { tone: 'tip' | 'warn' | 'info'; text: string } {
  if (d.tmax >= 33) return { tone: 'warn', text: 'Calor extremo: hay muy poca sombra en el parque. Empieza a la apertura, rellena la botella en cada fuente y descansa en las domus con peristilo a mediodía.' };
  if (d.tmax >= 28) return { tone: 'warn', text: 'Calor: gorra, protector solar y al menos litro y medio de agua por persona. Las fuentes del parque son potables.' };
  if (d.precipProb >= 60) return { tone: 'info', text: 'Probable lluvia: los adoquines de lava resbalan mucho. Suela con agarre y chubasquero (el paraguas molesta en las casas estrechas).' };
  return { tone: 'tip', text: 'Buen día para caminar. Aun así, calzado cerrado: el pavimento es irregular en todo el recorrido.' };
}
