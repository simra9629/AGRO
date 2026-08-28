import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, CloudSun, FileText, Mic, MessageCircle, Sprout, ArrowRight, Leaf, Droplets, Sun, IndianRupee, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang, tr } from "@/lib/i18n";
import { CROPS } from "@/lib/agro-data";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t, lang } = useLang();
  const [greetKey, setGreetKey] = useState<"goodMorning" | "goodAfternoon" | "goodEvening">("goodMorning");
  useEffect(() => {
    const h = new Date().getHours();
    setGreetKey(h < 12 ? "goodMorning" : h < 17 ? "goodAfternoon" : "goodEvening");
  }, []);

  const quickActions = [
    { to: "/chat", icon: MessageCircle, label: t("chat"), tone: "from-primary to-leaf" },
    { to: "/scan", icon: Camera, label: t("scanCrop"), tone: "from-water to-primary" },
    { to: "/weather", icon: CloudSun, label: t("weather"), tone: "from-amber-alert to-soil" },
    { to: "/market", icon: IndianRupee, label: t("market"), tone: "from-soil to-amber-alert" },
    { to: "/schemes", icon: FileText, label: t("schemes"), tone: "from-leaf to-primary" },
    { to: "/profile", icon: User, label: t("profile"), tone: "from-primary to-water" },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-10 space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl agro-gradient text-white shadow-glow">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-amber-alert/30 blur-3xl" />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/80">
            <Sprout className="h-4 w-4" /> {t("appName")} · {t("tagline")}
          </div>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            {t(greetKey)}, <span className="text-amber-alert">{lang === "hi" ? "किसान" : "farmer"}</span>.
            <br />
            <span className="text-white/90 text-2xl md:text-4xl font-display">
              {lang === "hi" ? "आज की फसल कैसी है?" : "How are your crops today?"}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-white/85 text-sm md:text-base">
            {lang === "hi"
              ? "एआई के साथ बातचीत करें, बीमारी स्कैन करें, मौसम बुद्धिमत्ता पाएँ और सरकारी योजनाएँ खोजें।"
              : "Chat with AI, scan diseases, get weather intelligence and discover government schemes — all in your language."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-white text-primary px-5 py-3 font-semibold text-sm shadow-soft hover:shadow-glow transition"
            >
              <Mic className="h-4 w-4" /> {t("speak")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur text-white px-5 py-3 font-semibold text-sm ring-1 ring-white/30 hover:bg-white/25 transition"
            >
              <Camera className="h-4 w-4" /> {t("scanCrop")}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
          {t("quickActions")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {quickActions.map(({ to, icon: Icon, label, tone }) => (
            <Link
              key={to}
              to={to}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-glow transition"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tone} text-white shadow-soft`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-4 font-display font-semibold">{label}</div>
              <ArrowRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition" />
            </Link>
          ))}
        </div>
      </section>

      {/* Today's tiles */}
      <section className="grid md:grid-cols-3 gap-4">
        <TileWeather />
        <TileTip
          icon={Leaf}
          tint="bg-primary-soft text-primary"
          title={lang === "hi" ? "स्थायी सलाह" : "Sustainability"}
          body={lang === "hi"
            ? "बारी-बारी फसल चक्र अपनाएँ — मिट्टी की उर्वरता बनी रहेगी।"
            : "Rotate legumes with cereals to naturally restore nitrogen."}
        />
        <TileTip
          icon={Droplets}
          tint="bg-water/15 text-water"
          title={lang === "hi" ? "सिंचाई" : "Irrigation"}
          body={lang === "hi"
            ? "सुबह जल्दी या शाम को पानी दें — वाष्पीकरण कम होगा।"
            : "Irrigate at dawn or dusk to cut evaporation losses by up to 30%."}
        />
      </section>

      {/* Crops shortcut */}
      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t("cropHelp")}
          </h2>
          <Link to="/chat" className="text-xs font-semibold text-primary hover:underline">
            {lang === "hi" ? "और पूछें →" : "Ask more →"}
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
          {CROPS.map((c) => (
            <Link
              key={c.id}
              to="/chat"
              search={{ q: `Best practices for ${c.name.en}` } as never}
              className="snap-start shrink-0 w-32 rounded-2xl bg-card border border-border p-4 text-center hover:border-primary/50 hover:shadow-soft transition"
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-2 font-semibold text-sm">{tr(c.name, lang)}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{c.season}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function TileTip({ icon: Icon, tint, title, body }: { icon: typeof Leaf; tint: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 font-display font-semibold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function TileWeather() {
  const { lang } = useLang();
  return (
    <Link to="/weather" className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-glow transition block">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-alert/20 text-amber-alert-foreground">
        <Sun className="h-5 w-5" />
      </div>
      <div className="mt-3 font-display font-semibold">
        {lang === "hi" ? "मौसम अलर्ट" : "Weather alert"}
      </div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        {lang === "hi"
          ? "अपना स्थान साझा करें और 7-दिन का कृषि पूर्वानुमान पाएँ।"
          : "Share your location for a 7-day agricultural forecast with AI advice."}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
        {lang === "hi" ? "देखें" : "Open"} <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}
