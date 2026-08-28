import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Search, MapPin, IndianRupee, Loader2, RefreshCw, MinusIcon, WifiOff } from "lucide-react";
import { useLang, tr } from "@/lib/i18n";
import { fetchMandiPrices, type MandiRow } from "@/lib/market.functions";
import { readProfile } from "@/lib/profile";
import { CropIcon } from "@/lib/crop-icon";
import { isLowNetwork, isOnline } from "@/lib/network";
import { STATE_NAMES } from "@/lib/states";

export const Route = createFileRoute("/market")({ component: Market });

function Market() {
  const { lang } = useLang();
  const getPrices = useServerFn(fetchMandiPrices);
  const [q, setQ] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [rows, setRows] = useState<MandiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"data.gov.in" | "curated">("curated");
  const [err, setErr] = useState<string | null>(null);

  // Seed state filter from profile on mount
  useEffect(() => {
    const p = readProfile();
    if (p.state) setStateFilter(p.state);
  }, []);

  async function load() {
    setLoading(true);
    setErr(null);
    if (!isOnline()) {
      setErr(lang === "hi" ? "ऑफ़लाइन — कैश्ड डेटा दिखाया जा रहा है।" : "Offline — showing cached snapshot.");
    }
    try {
      const r = await getPrices({
        data: {
          state: stateFilter || undefined,
          limit: isLowNetwork() ? 60 : 200,
        },
      });
      setRows(r.rows);
      setSource(r.source);
      try { sessionStorage.setItem("agro_mandi_cache", JSON.stringify(r)); } catch {}
    } catch (e: any) {
      try {
        const cached = sessionStorage.getItem("agro_mandi_cache");
        if (cached) {
          const r = JSON.parse(cached);
          setRows(r.rows);
          setSource(r.source);
        }
      } catch {}
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [stateFilter, lang]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) =>
      r.commodity.en.toLowerCase().includes(term) ||
      r.commodity.hi.includes(term) ||
      r.market.toLowerCase().includes(term) ||
      r.state.toLowerCase().includes(term),
    );
  }, [q, rows]);



  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-6 space-y-6">
      <header className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary text-xs font-semibold px-3 py-1">
          <IndianRupee className="h-3.5 w-3.5" /> MANDI · {source}
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          {lang === "hi" ? "मंडी भाव" : "Mandi Prices"}
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          {lang === "hi"
            ? "प्रमुख मंडियों के दैनिक भाव। आज के अनुमान — व्यापार से पहले स्थानीय मंडी से पुष्टि करें।"
            : "Daily wholesale prices across major mandis. Today's indicative snapshot — verify locally before trading."}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={lang === "hi" ? "फसल या मंडी खोजें…" : "Search crop or mandi…"}
            className="w-full rounded-full bg-card border border-border pl-11 pr-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="rounded-full bg-card border border-border px-4 py-3 text-sm outline-none focus:border-primary min-w-[200px]"
        >
          <option value="">{lang === "hi" ? "सभी राज्य व UT" : "All states & UTs"}</option>
          {STATE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-card border border-border px-4 py-3 text-sm font-semibold hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {lang === "hi" ? "रीफ्रेश" : "Refresh"}
        </button>
      </div>

      {err && (
        <div className="rounded-2xl bg-destructive/10 text-destructive p-4 text-sm flex items-center gap-2">
          {!isOnline() && <WifiOff className="h-4 w-4" />} {err}
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border bg-surface">
          <div className="col-span-5 md:col-span-4">{lang === "hi" ? "फसल" : "Commodity"}</div>
          <div className="col-span-4 md:col-span-4 hidden md:block">{lang === "hi" ? "मंडी" : "Market"}</div>
          <div className="col-span-4 md:col-span-2 text-right">{lang === "hi" ? "भाव" : "Price"}</div>
          <div className="col-span-3 md:col-span-2 text-right">{lang === "hi" ? "बदलाव" : "Change"}</div>
        </div>

        {loading && rows.length === 0 ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-muted rounded" />
                  <div className="h-2.5 w-20 bg-muted rounded" />
                </div>
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {filtered.map((r, i) => (
              <div key={i} className="grid grid-cols-12 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-primary-soft/30 transition">
                <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                  <CropIcon name={r.commodity.en} size="sm" />
                  <div>
                    <div className="font-semibold text-sm">{tr(r.commodity, lang)}</div>
                    <div className="text-[11px] text-muted-foreground md:hidden flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {r.market}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block col-span-4 text-sm">
                  <div className="font-medium">{r.market}</div>
                  <div className="text-xs text-muted-foreground">{r.state}</div>
                </div>
                <div className="col-span-4 md:col-span-2 text-right">
                  <div className="font-display font-bold text-base">₹{r.price.toLocaleString("en-IN")}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">/{r.unit}</div>
                </div>
                <div className="col-span-3 md:col-span-2 flex justify-end">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    r.delta > 0 ? "bg-primary-soft text-primary" : r.delta < 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                  }`}>
                    {r.delta > 0 ? <TrendingUp className="h-3 w-3" /> : r.delta < 0 ? <TrendingDown className="h-3 w-3" /> : <MinusIcon className="h-3 w-3" />}
                    {r.delta > 0 ? "+" : ""}{r.delta.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="p-10 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
                <Loader2 className="h-4 w-4 opacity-50" />
                {lang === "hi" ? "कोई परिणाम नहीं" : "No results"}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
