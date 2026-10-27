import type { StadiumWeather } from "../types/stadium";

const weatherDescriptions: Record<number, string> = {
  0: "Céu limpo",
  1: "Predomínio de sol",
  2: "Parcialmente nublado",
  3: "Encoberto",
  45: "Nevoeiro",
  48: "Nevoeiro com geada",
  51: "Garoa leve",
  53: "Garoa moderada",
  55: "Garoa densa",
  61: "Chuva fraca",
  63: "Chuva moderada",
  65: "Chuva forte",
  80: "Pancadas de chuva leves",
  81: "Pancadas de chuva moderadas",
  82: "Chuva torrencial",
  95: "Tempestade com trovões",
  96: "Tempestade com granizo leve",
  99: "Tempestade severa",
};

// Cache simples em memória com expiração de 15 minutos
const weatherCache = new Map<string, { data: StadiumWeather; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000;

export async function fetchStadiumWeather(
  lat: number,
  lng: number
): Promise<StadiumWeather | null> {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const cached = weatherCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,is_day`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const json = await response.json();
    const current = json.current;
    if (!current) return null;

    const code = Number(current.weather_code ?? 0);
    const data: StadiumWeather = {
      temperature: Math.round(Number(current.temperature_2m ?? 0)),
      weatherCode: code,
      windSpeed: Math.round(Number(current.wind_speed_10m ?? 0)),
      isDay: current.is_day === 1,
      description: weatherDescriptions[code] || "Tempo estável",
    };

    weatherCache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (err) {
    console.warn("Erro ao buscar clima do estádio:", err);
    return null;
  }
}
