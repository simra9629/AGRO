import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ExternalLink, FileText, MapPin } from "lucide-react";
import { useLang, tr } from "@/lib/i18n";
import { SCHEMES, type Scheme } from "@/lib/agro-data";
import { readProfile } from "@/lib/profile";

export const Route = createFileRoute("/schemes")({
  component: Schemes,
  // tiny artificial loader so the route mounts with a proper loading boundary
  loader: async () => {
    // The data is static; using a loader keeps the screen consistent with the data-loading pattern.
    return { ok: true, ts: Date.now() };
  },
  pendingMs: 0,
  pendingComponent: () => (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-6 space-y-3">
      <div className="h-7 w-40 bg-muted rounded animate-pulse" />
      <div className="h-4 w-72 bg-muted rounded animate-pulse" />
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-36 rounded-3xl bg-muted/60 animate-pulse" />
        ))}
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md p-10 text-center">
      <p className="text-sm text-destructive">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center text-sm">Not found</div>,
});

const CATS: { id: Scheme["category"] | "all"; en: string; hi: string }[] = [
  { id: "all", en: "All", hi: "सभी" },
  { id: "subsidy", en: "Subsidy", hi: "सब्सिडी" },
  { id: "insurance", en: "Insurance", hi: "बीमा" },
  { id: "irrigation", en: "Irrigation", hi: "सिंचाई" },
  { id: "credit", en: "Credit", hi: "ऋण" },
  { id: "training", en: "Training", hi: "प्रशिक्षण" },
  { id: "welfare", en: "Welfare", hi: "कल्याण" },
  { id: "market", en: "Market", hi: "बाज़ार" },
];

function Schemes() {
  const { t, lang } = useLang();
  const profile = useMemo(() => readProfile(), []);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Scheme["category"] | "all">("all");
  const [nearbyOnly, setNearbyOnly] = useState<boolean>(!!profile.state);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SCHEMES.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (nearbyOnly && profile.state) {
        // include central schemes (no states field) + state-targeted matches
        if (s.states && !s.states.includes(profile.state)) return false;
      }
      if (!needle) return true;
      return (
        s.title.en.toLowerCase().includes(needle) ||
        s.title.hi.includes(needle) ||
        s.summary.en.toLowerCase().includes(needle) ||
        s.ministry.toLowerCase().includes(needle)
      );
    });
  }, [q, cat, nearbyOnly, profile.state]);

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-6 py-6 space-y-6">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-alert/20 text-amber-alert-foreground text-xs font-semibold px-3 py-1">
          <FileText className="h-3.5 w-3.5" /> {lang === "hi" ? "सरकारी" : "Government"}
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold mt-2">{t("schemesTitle")}</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-xl">
          {lang === "hi"
            ? "किसानों के लिए केंद्रीय एवं राज्य योजनाएँ — सब्सिडी, बीमा, ऋण, सिंचाई और बहुत कुछ।"
            : "Central & state programs for farmers — subsidies, insurance, credit, irrigation and more."}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2.5 shadow-soft">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchSchemes")}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        {profile.state && (
          <button
            onClick={() => setNearbyOnly((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition border ${
              nearbyOnly
                ? "agro-gradient text-white border-transparent shadow-soft"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" /> {profile.state}
          </button>
        )}
      </div>

      <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1">
        {CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              cat === c.id ? "agro-gradient text-white shadow-soft" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {tr(c, lang)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map((s) => (
          <a
            key={s.id}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-3xl bg-card border border-border p-5 md:p-6 shadow-soft hover:shadow-glow hover:border-primary/40 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-primary">{s.category}</span>
                <h3 className="font-display text-lg font-bold mt-1 group-hover:text-primary transition">{tr(s.title, lang)}</h3>
                <p className="text-xs text-muted-foreground">{s.ministry}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{tr(s.summary, lang)}</p>
            {s.states && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.states.map((st) => (
                  <span key={st} className="inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary text-[10px] font-semibold px-2 py-0.5">
                    <MapPin className="h-2.5 w-2.5" /> {st}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
        {list.length === 0 && (
          <div className="md:col-span-2 rounded-2xl bg-card border border-border p-10 text-center text-sm text-muted-foreground">
            {lang === "hi" ? "कोई परिणाम नहीं मिला।" : "No schemes match your search."}
          </div>
        )}
      </div>
    </div>
  );
}
