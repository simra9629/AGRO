import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  lang: z.string().min(2).max(5).default("en"),
});

export type WeatherPayload = {
  source: "weatherapi" | "open-meteo";
  location: { name: string; region: string; country: string; lat: number; lon: number };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
    precip_mm: number;
    code: number;
    text: string;
    icon: string;
    uv: number;
    feels_like_c: number;
  };
  daily: Array<{
    date: string;
    max_c: number;
    min_c: number;
    precip_mm: number;
    code: number;
    text: string;
    icon: string;
    uv: number;
    chance_of_rain: number;
  }>;
  alerts: Array<{ headline: string; severity: "info" | "warning" | "severe"; desc: string }>;
};

const OPEN_METEO_CODES: Record<number, { text: string; icon: string }> = {
  0: { text: "Clear", icon: "☀️" },
  1: { text: "Mostly clear", icon: "🌤️" },
  2: { text: "Partly cloudy", icon: "⛅" },
  3: { text: "Overcast", icon: "☁️" },
  45: { text: "Fog", icon: "🌫️" },
  48: { text: "Rime fog", icon: "🌫️" },
  51: { text: "Drizzle", icon: "🌦️" },
  53: { text: "Drizzle", icon: "🌦️" },
  55: { text: "Drizzle", icon: "🌦️" },
  61: { text: "Light rain", icon: "🌧️" },
  63: { text: "Rain", icon: "🌧️" },
  65: { text: "Heavy rain", icon: "⛈️" },
  71: { text: "Snow", icon: "🌨️" },
  73: { text: "Snow", icon: "🌨️" },
  75: { text: "Heavy snow", icon: "❄️" },
  80: { text: "Showers", icon: "🌦️" },
  81: { text: "Showers", icon: "🌧️" },
  82: { text: "Violent showers", icon: "⛈️" },
  95: { text: "Thunderstorm", icon: "⛈️" },
  96: { text: "Thunderstorm + hail", icon: "⛈️" },
  99: { text: "Severe storm", icon: "⛈️" },
};

function deriveAlerts(daily: WeatherPayload["daily"]): WeatherPayload["alerts"] {
  const out: WeatherPayload["alerts"] = [];
  for (let i = 0; i < daily.length; i++) {
    const d = daily[i];
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : new Date(d.date).toLocaleDateString("en-IN", { weekday: "long" });
    if (d.precip_mm >= 40 || [65, 82, 95, 96, 99].includes(d.code)) {
      out.push({
        severity: d.precip_mm >= 75 ? "severe" : "warning",
        headline: `Heavy rainfall expected ${when}`,
        desc: `Forecast ${d.precip_mm.toFixed(0)}mm — delay spraying, secure stored grain, check drainage.`,
      });
    } else if (d.max_c >= 40) {
      out.push({
        severity: d.max_c >= 44 ? "severe" : "warning",
        headline: `Heat wave ${when} — ${Math.round(d.max_c)}°C`,
        desc: "Irrigate at dawn/dusk, mulch beds, provide shade for livestock.",
      });
    } else if (d.uv >= 10) {
      out.push({
        severity: "info",
        headline: `Very high UV ${when}`,
        desc: "Avoid mid-day field work; cover sensitive seedlings.",
      });
    }
    if (out.length >= 3) break;
  }
  return out;
}

async function fetchWeatherApi(lat: number, lon: number, lang: string, apiKey: string): Promise<WeatherPayload | null> {
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7&aqi=no&alerts=yes&lang=${lang}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const j: any = await res.json();
    const cur = j.current;
    const cond = cur.condition ?? {};
    const daily = (j.forecast?.forecastday ?? []).map((d: any) => ({
      date: d.date,
      max_c: d.day.maxtemp_c,
      min_c: d.day.mintemp_c,
      precip_mm: d.day.totalprecip_mm ?? 0,
      code: d.day.condition?.code ?? 0,
      text: d.day.condition?.text ?? "",
      icon: `https:${d.day.condition?.icon ?? ""}`,
      uv: d.day.uv ?? 0,
      chance_of_rain: d.day.daily_chance_of_rain ?? 0,
    }));
    const apiAlerts = (j.alerts?.alert ?? []).slice(0, 3).map((a: any) => ({
      severity: ((a.severity || "").toLowerCase().includes("severe") ? "severe" : "warning") as "warning" | "severe",
      headline: a.headline || a.event || "Weather alert",
      desc: (a.desc || "").slice(0, 240),
    }));
    return {
      source: "weatherapi",
      location: {
        name: j.location?.name ?? "",
        region: j.location?.region ?? "",
        country: j.location?.country ?? "",
        lat: j.location?.lat ?? lat,
        lon: j.location?.lon ?? lon,
      },
      current: {
        temp_c: cur.temp_c,
        humidity: cur.humidity,
        wind_kph: cur.wind_kph,
        precip_mm: cur.precip_mm ?? 0,
        code: cond.code ?? 0,
        text: cond.text ?? "",
        icon: `https:${cond.icon ?? ""}`,
        uv: cur.uv ?? 0,
        feels_like_c: cur.feelslike_c ?? cur.temp_c,
      },
      daily,
      alerts: apiAlerts.length ? apiAlerts : deriveAlerts(daily),
    };
  } catch (e) {
    console.error("[weather] weatherapi failed", e);
    return null;
  }
}

async function fetchOpenMeteo(lat: number, lon: number): Promise<WeatherPayload> {
  const wx = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,uv_index_max,precipitation_probability_max&timezone=auto`;
  // Reverse geocode best-effort
  const geo = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en`;
  const [w, g] = await Promise.all([
    fetch(wx, { signal: AbortSignal.timeout(8000) }).then((r) => r.json()),
    fetch(geo, { signal: AbortSignal.timeout(5000) }).then((r) => r.json()).catch(() => null),
  ]);
  const c = w.current;
  const codeMeta = (code: number) => OPEN_METEO_CODES[code] ?? { text: "—", icon: "🌡️" };
  const cur = codeMeta(c.weather_code);
  const daily: WeatherPayload["daily"] = w.daily.time.map((date: string, i: number) => {
    const m = codeMeta(w.daily.weather_code[i]);
    return {
      date,
      max_c: w.daily.temperature_2m_max[i],
      min_c: w.daily.temperature_2m_min[i],
      precip_mm: w.daily.precipitation_sum[i] ?? 0,
      code: w.daily.weather_code[i],
      text: m.text,
      icon: m.icon,
      uv: w.daily.uv_index_max[i] ?? 0,
      chance_of_rain: w.daily.precipitation_probability_max?.[i] ?? 0,
    };
  });
  const place = g?.results?.[0];
  return {
    source: "open-meteo",
    location: {
      name: place?.name ?? "—",
      region: place?.admin1 ?? "",
      country: place?.country ?? "",
      lat,
      lon,
    },
    current: {
      temp_c: c.temperature_2m,
      humidity: c.relative_humidity_2m,
      wind_kph: c.wind_speed_10m,
      precip_mm: c.precipitation,
      code: c.weather_code,
      text: cur.text,
      icon: cur.icon,
      uv: 0,
      feels_like_c: c.apparent_temperature ?? c.temperature_2m,
    },
    daily,
    alerts: deriveAlerts(daily),
  };
}

export const fetchWeather = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.WEATHERAPI_KEY;
    if (key) {
      const wa = await fetchWeatherApi(data.lat, data.lon, data.lang, key);
      if (wa) return wa;
    }
    return fetchOpenMeteo(data.lat, data.lon);
  });
