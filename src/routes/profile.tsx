import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Globe2, MapPin, Trash2, Sprout, ShieldCheck, ExternalLink } from "lucide-react";
import { useLang, LANGS } from "@/lib/i18n";
import { readProfile, writeProfile, type FarmProfile } from "@/lib/profile";

export const Route = createFileRoute("/profile")({ component: Profile });

const EMPTY: FarmProfile = { name: "", village: "", state: "", landAcres: "", mainCrop: "" };

function Profile() {
  const { t, lang, setLang } = useLang();
  const [profile, setProfile] = useState<FarmProfile>(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(readProfile());
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    writeProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function clearAll() {
    if (!confirm(lang === "hi" ? "सभी डेटा साफ़ करें?" : "Clear all saved data?")) return;
    localStorage.removeItem("agro_profile");
    localStorage.removeItem("agro_lang");
    localStorage.removeItem("agro_scan_history_v1");
    sessionStorage.removeItem("agro_splash_shown");
    localStorage.removeItem("agro_onboarded_v1");
    setProfile(EMPTY);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-6 space-y-6">
      <header className="space-y-1">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary text-xs font-semibold px-3 py-1">
          <User className="h-3.5 w-3.5" /> {lang === "hi" ? "प्रोफ़ाइल" : "PROFILE"}
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          {lang === "hi" ? "मेरा खेत" : "My Farm"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {lang === "hi"
            ? "अपनी जानकारी सहेजें — AGRO अधिक प्रासंगिक सलाह देगा।"
            : "Save details so AGRO can give you more relevant guidance."}
        </p>
      </header>

      {/* Identity */}
      <div className="rounded-3xl agro-gradient text-white p-6 shadow-glow flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/30 flex items-center justify-center">
          <Sprout className="h-8 w-8" />
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.18em] text-white/80">{lang === "hi" ? "नमस्ते" : "Welcome"}</div>
          <div className="font-display text-xl font-bold truncate">
            {profile.name || (lang === "hi" ? "किसान जी" : "Farmer")}
          </div>
          <div className="text-xs text-white/80 truncate">
            {[profile.village, profile.state].filter(Boolean).join(", ") || (lang === "hi" ? "स्थान नहीं जोड़ा गया" : "No location yet")}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={save} className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
        <h2 className="font-display font-semibold">{lang === "hi" ? "खेत की जानकारी" : "Farm details"}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={lang === "hi" ? "नाम" : "Name"} value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
          <Field label={lang === "hi" ? "गाँव" : "Village"} value={profile.village} onChange={(v) => setProfile({ ...profile, village: v })} />
          <Field label={lang === "hi" ? "राज्य" : "State"} value={profile.state} onChange={(v) => setProfile({ ...profile, state: v })} />
          <Field label={lang === "hi" ? "ज़मीन (एकड़)" : "Land (acres)"} value={profile.landAcres} onChange={(v) => setProfile({ ...profile, landAcres: v })} />
          <Field label={lang === "hi" ? "मुख्य फसल" : "Main crop"} value={profile.mainCrop} onChange={(v) => setProfile({ ...profile, mainCrop: v })} className="sm:col-span-2" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="rounded-full agro-gradient text-white px-5 py-2.5 text-sm font-semibold shadow-soft">
            {lang === "hi" ? "सहेजें" : "Save"}
          </button>
          {saved && (
            <span className="text-xs text-primary font-semibold inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> {lang === "hi" ? "सहेजा गया" : "Saved"}
            </span>
          )}
        </div>
      </form>

      {/* Settings */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft space-y-4">
        <h2 className="font-display font-semibold">{lang === "hi" ? "सेटिंग्स" : "Settings"}</h2>
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-sm">{t("language")}</div>
              <div className="text-xs text-muted-foreground">{LANGS.find((l) => l.code === lang)?.native}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition ${
                  lang === l.code
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface hover:border-primary/50"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span className="min-w-0">
                  <span className="block font-semibold text-xs truncate">{l.native}</span>
                  <span className="block text-[10px] text-muted-foreground truncate">{l.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <Link to="/weather" className="flex items-center justify-between rounded-2xl bg-surface border border-border px-4 py-3 hover:border-primary/50 transition">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-water/15 text-water flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-sm">{lang === "hi" ? "स्थान अपडेट करें" : "Update location"}</div>
              <div className="text-xs text-muted-foreground">{lang === "hi" ? "मौसम स्क्रीन से" : "From the Weather screen"}</div>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </Link>

        <button
          onClick={clearAll}
          className="w-full flex items-center justify-between rounded-2xl bg-destructive/5 border border-destructive/20 px-4 py-3 hover:bg-destructive/10 transition text-left"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/15 text-destructive flex items-center justify-center">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-sm text-destructive">{lang === "hi" ? "डेटा साफ़ करें" : "Clear all data"}</div>
              <div className="text-xs text-muted-foreground">{lang === "hi" ? "स्थानीय रूप से सहेजा गया" : "Locally saved only"}</div>
            </div>
          </div>
        </button>
      </div>

      <p className="text-[11px] text-muted-foreground text-center pb-4">
        {lang === "hi" ? "AGRO · किसानों के लिए एआई बुद्धिमत्ता" : "AGRO · AI intelligence for farmers"}
      </p>
    </div>
  );
}

function Field({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl bg-surface border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
