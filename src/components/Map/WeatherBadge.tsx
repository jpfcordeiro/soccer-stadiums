import React, { useEffect, useState } from "react";
import type { StadiumWeather } from "../../types/stadium";
import { fetchStadiumWeather } from "../../services/weather";

interface WeatherBadgeProps {
  lat: number;
  lng: number;
}

export const WeatherBadge: React.FC<WeatherBadgeProps> = ({ lat, lng }) => {
  const [weather, setWeather] = useState<StadiumWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchStadiumWeather(lat, lng).then((data) => {
      if (isMounted) {
        setWeather(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-[11px] text-slate-500 animate-pulse">
        <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
        <span>Carregando clima...</span>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg text-xs">
      <div className="flex items-center gap-1.5">
        <span className="text-base" role="img" aria-label="clima">
          {weather.weatherCode === 0
            ? weather.isDay
              ? "☀️"
              : "🌙"
            : weather.weatherCode <= 3
            ? "⛅"
            : weather.weatherCode >= 51 && weather.weatherCode <= 82
            ? "🌧️"
            : weather.weatherCode >= 95
            ? "⛈️"
            : "🌤️"}
        </span>
        <div>
          <span className="font-semibold text-slate-800 block leading-tight">
            {weather.temperature}°C &bull; {weather.description}
          </span>
          <span className="text-[10px] text-slate-500">
            Vento: {weather.windSpeed} km/h &bull; Tempo agora
          </span>
        </div>
      </div>
    </div>
  );
};
