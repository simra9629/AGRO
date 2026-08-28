import { Link, useLocation } from "@tanstack/react-router";
import { Home, MessageCircle, CloudSun, Camera, FileText, Globe2, IndianRupee, User, Check } from "lucide-react";
import { useLang, LANGS } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";
import { Splash } from "./Splash";
import { InstallPrompt } from "./InstallPrompt";
import { Onboarding } from "./Onboarding";

const navDesktop = [
  { to: "/", key: "home", icon: Home },
  { to: "/chat", key: "chat", icon: MessageCircle },
  { to: "/scan", key: "scan", icon: Camera },
  { to: "/weather", key: "weather", icon: CloudSun },
  { to: "/market", key: "market", icon: IndianRupee },
  { to: "/schemes", key: "schemes", icon: FileText },
  { to: "/profile", key: "profile", icon: User },
] as const;

const navMobile = [
  { to: "/", key: "home", icon: Home },
  { to: "/chat", key: "chat", icon: MessageCircle },
  { to: "/scan", key: "scan", icon: Camera },
  { to: "/market", key: "market", icon: IndianRupee },
  { to: "/profile", key: "profile", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { t, lang, setLang } = useLang();
  const loc = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Splash />
      <Onboarding />
      <InstallPrompt />
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl agro-gradient shadow-glow">
              <span className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
              <span className="text-white text-lg font-bold tracking-tight">A</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display font-bold text-base tracking-tight">{t("appName")}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Intelligence</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navDesktop.map(({ to, key, icon: Icon }) => {
              const active = loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                    active
                      ? "bg-primary-soft text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(key as never)}
                </Link>
              );
            })}
          </nav>

          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-semibold hover:bg-muted transition"
              aria-label="Switch language"
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>{currentLang.native}</span>
            </button>
            {langOpen && (
              <>
                <button
                  className="fixed inset-0 z-30 cursor-default"
                  onClick={() => setLangOpen(false)}
                  aria-label="Close"
                />
                <div className="absolute right-0 mt-2 z-40 w-56 rounded-2xl border border-border bg-card shadow-glow p-1.5 max-h-80 overflow-y-auto">
                  {LANGS.map((l) => {
                    const active = l.code === lang;
                    return (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-left transition",
                          active ? "bg-primary-soft text-primary" : "hover:bg-muted",
                        )}
                      >
                        <span className="text-base">{l.flag}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-semibold truncate">{l.native}</span>
                          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">{l.label}</span>
                        </span>
                        {active && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-10">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border/60">
        <div className="mx-auto max-w-6xl px-2 grid grid-cols-5">
          {navMobile.map(({ to, key, icon: Icon }) => {
            const active = loc.pathname === to || (to !== "/" && loc.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "scale-110")} />
                {t(key as never)}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
