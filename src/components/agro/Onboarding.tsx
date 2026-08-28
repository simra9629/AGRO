import { useEffect, useMemo, useState } from "react";
import { Sprout, ArrowRight, Check, Globe2, MapPin, User } from "lucide-react";
import { LANGS, useLang, type Lang } from "@/lib/i18n";
import { STATE_NAMES, cropsForState } from "@/lib/states";

const STORAGE_KEY = "agro_onboarded_v1";

export function Onboarding() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [village, setVillage] = useState("");
  const [state, setState] = useState("");
  const [crop, setCrop] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setOpen(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  if (!open) return null;

  function complete() {
    try {
      const existing = JSON.parse(localStorage.getItem("agro_profile") || "{}");
      localStorage.setItem(
        "agro_profile",
        JSON.stringify({ ...existing, name, village, state, mainCrop: crop }),
      );
    } catch {}
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  function skip() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  const steps = 3;

  return (
    <div className="fixed inset-0 z-[90] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-0 md:p-6">
      <div className="w-full md:max-w-lg bg-card rounded-t-3xl md:rounded-3xl shadow-glow border border-border overflow-hidden animate-in slide-in-from-bottom duration-500">
        {/* Hero header */}
        <div className="relative agro-gradient text-white p-6 pb-8">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 ring-1 ring-white/30 flex items-center justify-center backdrop-blur">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/80">AGRO</div>
              <div className="font-display text-xl font-bold">{t("welcome")}</div>
            </div>
          </div>
          {/* Progress */}
          <div className="relative mt-5 flex gap-1.5">
            {Array.from({ length: steps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-white" : "bg-white/25"}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {step === 0 && (
            <StepLanguage current={lang} onPick={setLang} />
          )}
          {step === 1 && (
            <StepName name={name} setName={setName} />
          )}
          {step === 2 && (
            <StepFarm village={village} setVillage={setVillage} state={state} setState={setState} crop={crop} setCrop={setCrop} />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-4 border-t border-border bg-surface">
          <button
            onClick={step === 0 ? skip : () => setStep((s) => s - 1)}
            className="text-sm font-semibold text-muted-foreground px-3 py-2 hover:text-foreground"
          >
            {step === 0 ? t("skip") : t("back")}
          </button>
          {step < steps - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-2 rounded-full agro-gradient text-white px-5 py-2.5 text-sm font-semibold shadow-soft"
            >
              {t("continue")} <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={complete}
              className="inline-flex items-center gap-2 rounded-full agro-gradient text-white px-5 py-2.5 text-sm font-semibold shadow-soft"
            >
              <Check className="h-4 w-4" /> {t("getStarted")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepLanguage({ current, onPick }: { current: Lang; onPick: (l: Lang) => void }) {
  const { t } = useLang();
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Globe2 className="h-3.5 w-3.5" /> {t("language")}
      </div>
      <h2 className="font-display text-lg font-bold mt-1">{t("chooseLanguage")}</h2>
      <p className="text-sm text-muted-foreground mt-1">{t("onboardingIntro")}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {LANGS.map((l) => {
          const active = current === l.code;
          return (
            <button
              key={l.code}
              onClick={() => onPick(l.code)}
              className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                active
                  ? "border-primary bg-primary-soft shadow-soft"
                  : "border-border bg-surface hover:border-primary/50"
              }`}
            >
              <span className="text-xl">{l.flag}</span>
              <span className="min-w-0">
                <span className="block font-semibold text-sm truncate">{l.native}</span>
                <span className="block text-[11px] text-muted-foreground truncate">{l.label}</span>
              </span>
              {active && <Check className="ml-auto h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepName({ name, setName }: { name: string; setName: (v: string) => void }) {
  const { t } = useLang();
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <User className="h-3.5 w-3.5" /> {t("yourName")}
      </div>
      <h2 className="font-display text-lg font-bold mt-1">{t("welcome")}</h2>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("yourName")}
        className="mt-4 w-full rounded-2xl bg-surface border border-border px-4 py-3 text-base outline-none focus:border-primary"
      />
    </div>
  );
}

function StepFarm({
  village, setVillage, state, setState, crop, setCrop,
}: {
  village: string; setVillage: (v: string) => void;
  state: string; setState: (v: string) => void;
  crop: string; setCrop: (v: string) => void;
}) {
  const { t, lang } = useLang();
  const presets = useMemo(() => cropsForState(state), [state]);
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <MapPin className="h-3.5 w-3.5" /> {t("whereFarm")}
      </div>
      <h2 className="font-display text-lg font-bold mt-1">{t("tellAboutFarm")}</h2>
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            placeholder={t("village")}
            className="rounded-2xl bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <select
            value={state}
            onChange={(e) => { setState(e.target.value); setCrop(""); }}
            className="rounded-2xl bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="">{t("state")}</option>
            {STATE_NAMES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <input
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder={t("mainCrop")}
          className="w-full rounded-2xl bg-surface border border-border px-4 py-3 text-sm outline-none focus:border-primary"
        />
        {presets.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
              {lang === "hi" ? "इस राज्य की प्रमुख फसलें" : "Common crops in this state"}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCrop(c)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
                    crop === c ? "bg-primary text-primary-foreground border-primary" : "bg-surface border-border hover:border-primary/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
