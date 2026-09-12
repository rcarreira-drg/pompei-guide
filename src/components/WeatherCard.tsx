/** Tarjeta de tiempo: ahora + próximos 7 días (Open-Meteo). Carga y error silenciosos. */
import { useEffect, useState } from 'react';
import { fetchWeather, wmoLabel, heatAdvice, type Weather } from '@/lib/weather';

const dayLabel = (iso: string, i: number) => {
  if (i === 0) return 'HOY';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
};

const dateLabel = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
};

export default function WeatherCard() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    let alive = true;
    fetchWeather()
      .then((w) => {
        if (alive) {
          setWeather(w);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (alive) setStatus('error');
      });
    return () => {
      alive = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="weather-card box">
        <p className="empty-state">Cargando el tiempo…</p>
      </div>
    );
  }

  if (status === 'error' || !weather) {
    return (
      <div className="weather-card box">
        <p className="empty-state">Sin datos meteorológicos ahora.</p>
      </div>
    );
  }

  const day = weather.days[selected] ?? weather.days[0];
  const advice = heatAdvice(day);

  return (
    <div className="weather-card box">
      <div className="weather-now">
        <div>
          <p className="kicker">AHORA EN POMPEI</p>
          <p className="weather-now-temp">{weather.now.temp}°</p>
        </div>
        <div className="weather-now-meta mono">
          <p>{wmoLabel(weather.now.code)}</p>
          <p>Viento {weather.now.wind} km/h</p>
        </div>
      </div>

      <div className="weather-days" role="tablist" aria-label="Días de la previsión">
        {weather.days.map((d, i) => (
          <button
            key={d.date}
            type="button"
            role="tab"
            aria-selected={i === selected}
            className={`weather-day${i === selected ? ' weather-day--active' : ''}`}
            onClick={() => setSelected(i)}
          >
            <span className="mono weather-day-label">{dayLabel(d.date, i)}</span>
            <span className="mono weather-day-date">{dateLabel(d.date)}</span>
            <span className="weather-day-temps">
              {d.tmax}° <span className="weather-day-tmin">{d.tmin}°</span>
            </span>
            <span className="mono weather-day-rain">{d.precipProb}% lluvia</span>
          </button>
        ))}
      </div>

      <div className="weather-detail mono">
        <span>UV MÁX {day.uvMax}</span>
        <span>LLUVIA {day.precipProb}%</span>
        <span>AMANECE {day.sunrise}</span>
        <span>ANOCHECE {day.sunset}</span>
      </div>

      <div className={`callout weather-advice callout--${advice.tone}`}>
        <p>{advice.text}</p>
      </div>

      <p className="weather-credit mono">Datos: Open-Meteo.com (CC BY 4.0)</p>
    </div>
  );
}
