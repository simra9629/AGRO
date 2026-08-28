import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle2, ShieldCheck, Sparkles, History, Trash2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { agroScan } from "@/lib/ai.functions";
import { loadScans, saveScan, deleteScan, makeThumb, type ScanRecord } from "@/lib/scan-history";

export const Route = createFileRoute("/scan")({ component: Scan });

type Result = {
  crop?: string;
  condition?: string;
  confidence?: number;
  symptoms?: string[];
  causes?: string[];
  treatment?: string[];
  prevention?: string[];
};

type TfPhase = "idle" | "loading-model" | "ready" | "error";

function Scan() {
  const { t, lang } = useLang();
  const scan = useServerFn(agroScan);
  const [preview, setPreview] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const [tfGuess, setTfGuess] = useState<string | null>(null);
  const [tfPhase, setTfPhase] = useState<TfPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const modelRef = useRef<any>(null);

  useEffect(() => { setHistory(loadScans()); }, []);

  /** Lazy-load MobileNet on first scan to keep cold start fast. */
  async function ensureModel() {
    if (modelRef.current) return modelRef.current;
    setTfPhase("loading-model");
    try {
      const tf = await import("@tensorflow/tfjs");
      const mobilenet = await import("@tensorflow-models/mobilenet");
      await tf.ready();
      const m = await mobilenet.load({ version: 2, alpha: 1.0 });
      modelRef.current = m;
      setTfPhase("ready");
      return m;
    } catch (e) {
      setTfPhase("error");
      return null;
    }
  }

  async function runMobileNet(dataUrl: string): Promise<string | null> {
    try {
      const m = await ensureModel();
      if (!m) return null;
      const img = await loadImage(dataUrl);
      const preds: { className: string; probability: number }[] = await m.classify(img, 3);
      const top = preds[0];
      if (!top) return null;
      return `${top.className.split(",")[0]} (${Math.round(top.probability * 100)}%)`;
    } catch {
      return null;
    }
  }

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setTfGuess(null);
    if (file.size > 6 * 1024 * 1024) {
      setError(lang === "hi" ? "छवि बहुत बड़ी है (अधिकतम 6MB)।" : "Image too large (max 6MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setBusy(true);
      try {
        // 1) TF.js MobileNet classification (client-side, offline-capable once loaded)
        setStage(lang === "hi" ? "TensorFlow.js मॉडल चला रहे हैं…" : "Running TensorFlow.js model…");
        const guess = await runMobileNet(dataUrl);
        setTfGuess(guess);

        // 2) AI vision diagnosis (richer pathology insight)
        setStage(lang === "hi" ? "विशेषज्ञ निदान…" : "Expert diagnosis…");
        const base64 = dataUrl.split(",")[1];
        const result = await scan({
          data: {
            imageBase64: base64,
            mime: file.type || "image/jpeg",
            note,
            hint: guess ?? undefined,
            lang,
          },
        });
        const r = result as Result;
        setResult(r);

        // 3) Persist to history
        const thumb = await makeThumb(dataUrl);
        const rec: ScanRecord = {
          id: crypto.randomUUID(),
          ts: Date.now(),
          thumb,
          crop: r?.crop,
          condition: r.condition,
          confidence: r.confidence,
          mobilenetGuess: guess || undefined,
          note: note || undefined,
          symptoms: r.symptoms,
          causes: r.causes, // FIX: persist causes so they show in history
          treatment: r.treatment,
          prevention: r.prevention,
        };
        saveScan(rec);
        setHistory(loadScans());
      } catch (e: any) {
        setError(e?.message || "Scan failed");
      } finally {
        setBusy(false);
        setStage("");
      }
    };
    reader.readAsDataURL(file);
  }

  function openHistory(rec: ScanRecord) {
    setPreview(rec.thumb);
    setTfGuess(rec.mobilenetGuess ?? null);
    setResult({
      crop: rec?.crop,
      condition: rec.condition,
      confidence: rec.confidence,
      symptoms: rec.symptoms,
      causes: rec.causes, // FIX: restore causes from persisted record
      treatment: rec.treatment,
      prevention: rec.prevention,
    });
    setNote(rec.note ?? "");
    setError(null);
  }

  function removeHistory(id: string) {
    deleteScan(id);
    setHistory(loadScans());
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-6 space-y-6">
      <header className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary text-xs font-semibold px-3 py-1">
          <Camera className="h-3.5 w-3.5" /> AI VISION · TensorFlow.js
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">{t("diseaseTitle")}</h1>
        <p className="text-sm text-muted-foreground max-w-xl">{t("diseaseHint")}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl border-2 border-dashed border-border bg-surface p-6 flex flex-col items-center justify-center text-center min-h-[280px]">
          {preview ? (
            <img src={preview} alt="preview" className="max-h-64 rounded-2xl shadow-soft object-cover" />
          ) : (
            <>
              <div className="h-16 w-16 rounded-2xl agro-gradient inline-flex items-center justify-center shadow-glow mb-3">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-medium">{t("uploadImage")}</p>
              <p className="text-xs text-muted-foreground mt-1">JPEG / PNG · ≤ 6 MB</p>
            </>
          )}
          <div className="mt-4 flex gap-2">
            <button onClick={() => fileRef.current?.click()} className="rounded-full bg-card border border-border px-4 py-2 text-xs font-semibold hover:bg-muted">
              {lang === "hi" ? "गैलरी" : "Gallery"}
            </button>
            <button onClick={() => cameraRef.current?.click()} className="rounded-full agro-gradient text-white px-4 py-2 text-xs font-semibold shadow-soft">
              {lang === "hi" ? "कैमरा" : "Camera"}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
        </div>

        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "hi" ? "अतिरिक्त नोट (वैकल्पिक)" : "Note (optional)"}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder={lang === "hi" ? "जैसे — तीन दिन से पत्ते पीले हो रहे हैं…" : "e.g. Leaves yellowing for 3 days, brown spots…"}
            className="mt-2 w-full rounded-xl bg-surface border border-border p-3 text-sm outline-none focus:border-primary"
          />
          <div className="mt-4 text-xs text-muted-foreground flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p>{lang === "hi"
              ? "विश्लेषण केवल मार्गदर्शन है। पुष्टि के लिए स्थानीय कृषि विशेषज्ञ से सलाह लें।"
              : "AI analysis is guidance only. Confirm with a local agronomist before applying chemicals."}</p>
          </div>
        </div>
      </div>

      {busy && (
        <div className="rounded-2xl bg-primary-soft p-5 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <div className="text-sm">
            <div className="font-semibold text-primary">{stage || t("analyzing")}</div>
            {tfPhase === "loading-model" && (
              <div className="text-xs text-muted-foreground">
                {lang === "hi" ? "पहली बार TensorFlow.js मॉडल लोड हो रहा है (~16MB)" : "Loading TensorFlow.js model for the first time (~16MB)…"}
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-destructive/10 text-destructive p-4 flex gap-2 items-start text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" /> {error}
        </div>
      )}

      {tfGuess && !busy && (
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3 text-sm">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground mr-2">TensorFlow.js</span>
            <span className="font-semibold">{tfGuess}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden">
          <div className="agro-gradient text-white p-5 md:p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-white/80">{result.crop || (lang === "hi" ? "फसल" : "Crop")}</div>
            <h2 className="font-display text-2xl font-bold mt-1">{result.condition || "—"}</h2>
            {typeof result.confidence === "number" && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-white/80 mb-1">
                  <span>{lang === "hi" ? "विश्वास" : "Confidence"}</span>
                  <span>{result.confidence}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <div className="h-full bg-amber-alert" style={{ width: `${Math.max(0, Math.min(100, result.confidence))}%` }} />
                </div>
              </div>
            )}
          </div>
          <div className="p-5 md:p-6 grid md:grid-cols-2 gap-5">
            <Section title={lang === "hi" ? "लक्षण" : "Symptoms"} items={result.symptoms} />
            <Section title={lang === "hi" ? "कारण" : "Causes"} items={result.causes} />
            <Section title={lang === "hi" ? "उपचार" : "Treatment"} items={result.treatment} icon="treat" />
            <Section title={lang === "hi" ? "रोकथाम" : "Prevention"} items={result.prevention} icon="prev" />
          </div>
        </div>
      )}

      {history.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <History className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {lang === "hi" ? "पिछले स्कैन" : "Past scans"}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {history.map((h) => (
              <div key={h.id} className="group relative rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-glow transition">
                <button onClick={() => openHistory(h)} className="block w-full text-left">
                  <img src={h.thumb} alt="" className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {new Date(h.ts).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short" })}
                    </div>
                    <div className="font-semibold text-sm truncate">{h.condition || (lang === "hi" ? "स्कैन" : "Scan")}</div>
                    {typeof h.confidence === "number" && (
                      <div className="text-xs text-muted-foreground">{h.confidence}%</div>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => removeHistory(h.id)}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/40 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function Section({ title, items, icon }: { title: string; items?: string[]; icon?: "treat" | "prev" }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon === "treat" && <CheckCircle2 className="h-4 w-4 text-primary" />}
        {icon === "prev" && <ShieldCheck className="h-4 w-4 text-water" />}
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
