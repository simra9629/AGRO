import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { CloudSun, Droplets, Wind, Thermometer, MapPin, Loader2, Sparkles, Sun, AlertTriangle, RefreshCw } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { agroWeatherInsight } from "@/lib/ai.functions";
import { fetchWeather, type WeatherPayload } from "@/lib/weather.functions";
import { readProfile, writeProfile } from "@/lib/profile";

export const Route = createFileRoute("/weather")({ component: Weather });

function Weather() {
  const { t, lang } = useLang();
  const insight = useServerFn(agroWeatherInsight);
  const getWeather = useServerFn(fetchWeather);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [wx, setWx] = useState<WeatherPayload | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 1) Prefer profile-saved coordinates → fall back to geolocation → fall back to New Delhi
  useEffect(() => {
    const p = readProfile();
    if (typeof p.lat === "number" && typeof p.lon === "number") {
      setCoords({ lat: p.lat, lon: p.lon });
      return;
    }
    if (!navigator.geolocation) {
      setCoords({ lat: 28.6139, lon: 77.209 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setCoords(c);
        writeProfile({ lat: c.lat, lon: c.lon });
      },
      () => setCoords({ lat: 28.6139, lon: 77.209 }),
      { timeout: 6000, maximumAge: 60_000 * 30 },
    );
  }, []);

  // 2) Fetch weather + AI advisory
  async function load(c: { lat: number; lon: number }) {
    setLoading(true);
    setErr(null);
    try {
      const data = await getWeather({ data: { lat: c.lat, lon: c.lon, lang } });
      setWx(data);
      try {
        const summary = `temp ${data.current.temp_c}°C, humidity ${data.current.humidity}%, wind ${data.current.wind_kph} km/h, ${data.current.text}, precip ${data.current.precip_mm}mm`;
        const { tips } = await insight({ data: { lat: c.lat, lon: c.lon, weatherSummary: summary, lang } });
        setTips(tips);
      } catch {}
    } catch {
      setErr(lang === "hi" ? "मौसम लोड नहीं हुआ" : "Weather load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (coords) load(coords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, lang]);

  const locationLabel = useMemo(() => {
    if (!wx) return coords ? `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}` : "";
    return [wx.location.name, wx.location.region].filter(Boolean).join(", ") || `${wx.location.lat.toFixed(2)}, ${wx.location.lon.toFixed(2)}`;
  }, [wx, coords]);

  function renderIcon(icon: string, size = "text-7xl md:text-8xl") {
    if (icon.startsWith("http")) return <img src={icon} alt="" className="h-24 w-24 drop-shadow" />;
    return <div className={size}>{icon}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-6 space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-water/15 text-water text-xs font-semibold px-3 py-1">
            <CloudSun className="h-3.5 w-3.5" /> {lang === "hi" ? "लाइव मौसम" : "Live forecast"}
            {wx && <span className="text-[10px] opacity-70">· {wx.source}</span>}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold mt-2">{t("weatherTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {coords ? locationLabel : (lang === "hi" ? "स्थान लोड हो रहा है…" : "Locating…")}
          </p>
        </div>
        {coords && (
          <button
            onClick={() => load(coords)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full bg-card border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {lang === "hi" ? "रीफ्रेश" : "Refresh"}
          </button>
        )}
      </header>

      {loading && !wx && (
        <div className="rounded-3xl bg-card border border-border p-10 flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> {lang === "hi" ? "मौसम लाया जा रहा है…" : "Fetching weather…"}
        </div>
      )}

      {err && <div className="rounded-2xl bg-destructive/10 text-destructive p-4 text-sm">{err}</div>}

      {wx && (
        <>
          <section className="relative overflow-hidden rounded-3xl agro-gradient text-white p-6 md:p-10 shadow-glow">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-alert/30 blur-3xl" />
            <div className="relative flex flex-wrap items-end justify-between gap-6">
              <div>
                {renderIcon(wx.current.icon)}
                <div className="mt-2 text-white/85 text-sm">{wx.current.text}</div>
              </div>
              <div className="text-right">
                <div className="font-display text-6xl md:text-7xl font-bold leading-none">
                  {Math.round(wx.current.temp_c)}°
                </div>
                <div className="text-white/70 text-xs mt-1">
                  {lang === "hi" ? "महसूस" : "Feels"} {Math.round(wx.current.feels_like_c)}°
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                  <Stat icon={<Droplets className="h-4 w-4" />} label={lang === "hi" ? "आर्द्रता" : "Humidity"} value={`${wx.current.humidity}%`} />
                  <Stat icon={<Wind className="h-4 w-4" />} label={lang === "hi" ? "हवा" : "Wind"} value={`${Math.round(wx.current.wind_kph)} km/h`} />
                  <Stat icon={<Thermometer className="h-4 w-4" />} label={lang === "hi" ? "वर्षा" : "Rain"} value={`${wx.current.precip_mm} mm`} />
                </div>
              </div>
            </div>
          </section>

          {wx.alerts.length > 0 && (
            <section className="space-y-2">
              {wx.alerts.map((a, i) => {
                const tone =
                  a.severity === "severe"
                    ? "bg-destructive/10 border-destructive/30 text-destructive"
                    : a.severity === "warning"
                      ? "bg-amber-alert/15 border-amber-alert/30 text-amber-alert-foreground"
                      : "bg-water/10 border-water/30 text-water";
                return (
                  <div key={i} className={`rounded-2xl border p-4 flex items-start gap-3 ${tone}`}>
                    <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">{a.headline}</div>
                      <div className="text-xs opacity-90 mt-0.5">{a.desc}</div>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {tips.length > 0 && (
            <section className="rounded-3xl bg-card border border-border p-5 md:p-6 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="font-display font-semibold">{lang === "hi" ? "एआई कृषि सलाह" : "AI farming advisory"}</h2>
              </div>
              <ul className="grid md:grid-cols-3 gap-3">
                {tips.map((tip, i) => (
                  <li key={i} className="rounded-2xl bg-primary-soft/60 p-4 text-sm leading-relaxed">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Tip {i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
              {lang === "hi" ? "7-दिन का पूर्वानुमान" : "7-day forecast"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
              {wx.daily.slice(0, 7).map((d) => (
                <div key={d.date} className="rounded-2xl bg-card border border-border p-4 text-center shadow-soft">
                  <div className="text-xs font-semibold text-muted-foreground">
                    {new Date(d.date).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { weekday: "short" })}
                  </div>
                  <div className="my-2 flex justify-center">
                    {d.icon.startsWith("http") ? <img src={d.icon} className="h-10 w-10" alt="" /> : <span className="text-3xl">{d.icon}</span>}
                  </div>
                  <div className="text-sm font-semibold">{Math.round(d.max_c)}°</div>
                  <div className="text-xs text-muted-foreground">{Math.round(d.min_c)}°</div>
                  <div className="mt-2 text-[10px] text-water flex items-center justify-center gap-1">
                    <Droplets className="h-3 w-3" />
                    {d.precip_mm.toFixed(1)} mm · {d.chance_of_rain}%
                  </div>
                  {d.uv > 0 && (
                    <div className="text-[10px] text-amber-alert-foreground/80 flex items-center justify-center gap-1">
                      <Sun className="h-3 w-3" /> UV {Math.round(d.uv)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1 text-white/70">{icon} <span className="uppercase tracking-wider">{label}</span></div>
      <div className="font-semibold text-sm mt-0.5">{value}</div>
    </div>
  );
}
