import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Send, Mic, MicOff, Sparkles, Loader2, Volume2, VolumeX } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { agroChat } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";
import { speak, stopSpeaking, isOnline } from "@/lib/network";
import { offlineReply } from "@/lib/offline-chat";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/chat")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : undefined }),
  component: Chat,
});

const QUICK_EN = [
  "Why are my tomato leaves curling?",
  "Best crop for low rainfall?",
  "How often should I water wheat?",
  "Natural pesticide for aphids?",
];
const QUICK_HI = [
  "मेरी फसल पीली क्यों हो रही है?",
  "धान की सिंचाई कब करनी चाहिए?",
  "कम पानी में कौन सी फसल बेहतर है?",
  "जैविक कीटनाशक कैसे बनाएँ?",
];

function Chat() {
  const { t, lang } = useLang();
  const { q } = Route.useSearch();
  const chat = useServerFn(agroChat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quick = lang === "hi" ? QUICK_HI : QUICK_EN;

  useEffect(() => {
    if (q && messages.length === 0) {
      send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);
    if (!isOnline()) {
      const reply = offlineReply(trimmed, lang);
      setMessages([...next, { role: "assistant", content: `📴 ${reply}` }]);
      setBusy(false);
      return;
    }
    try {
      const { reply } = await chat({ data: { messages: next, lang } });
      setMessages([...next, { role: "assistant", content: reply || "…" }]);
    } catch (e: any) {
      const fallback = offlineReply(trimmed, lang);
      setMessages([...next, { role: "assistant", content: `⚠️ ${fallback}` }]);
    } finally {
      setBusy(false);
    }
  }

  function toggleMic() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert(lang === "hi" ? "इस ब्राउज़र में वॉयस समर्थित नहीं है।" : "Voice not supported in this browser.");
      return;
    }
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const r = new SR();
    r.lang = lang === "hi" ? "hi-IN" : "en-IN";
    r.interimResults = false;
    r.continuous = false;
    r.onresult = (ev: any) => {
      const text = ev.results[0][0].transcript;
      setInput(text);
      send(text);
    };
    r.onend = () => setListening(false);
    recRef.current = r;
    r.start();
    setListening(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-6 flex flex-col h-[calc(100vh-9rem)] md:h-[calc(100vh-7rem)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl agro-gradient inline-flex items-center justify-center shadow-soft">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg">{t("chat")}</h1>
          <p className="text-xs text-muted-foreground">
            {lang === "hi" ? "एआई से कृषि सलाह — हमेशा डबल-चेक करें।" : "AI agricultural guidance — always cross-verify."}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-3xl bg-surface border border-border p-4 md:p-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="h-16 w-16 rounded-2xl agro-gradient flex items-center justify-center shadow-glow mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-display text-xl font-bold">
              {lang === "hi" ? "नमस्ते किसान जी 🙏" : "Hello, farmer 🌱"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              {lang === "hi" ? "फसल, सिंचाई, रोग या मौसम — कुछ भी पूछें।" : "Ask anything about crops, irrigation, diseases or weather."}
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-2 w-full max-w-lg">
              {quick.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-left text-sm rounded-xl bg-card border border-border px-4 py-3 hover:border-primary/60 hover:bg-primary-soft/40 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <Bubble key={i} m={m} lang={lang} />
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {lang === "hi" ? "सोच रहा हूँ…" : "Thinking…"}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-3 flex items-center gap-2 rounded-full glass border border-border p-1.5 pl-4 shadow-soft"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("askAnything")}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={toggleMic}
          className={cn(
            "h-10 w-10 rounded-full inline-flex items-center justify-center transition",
            listening ? "bg-destructive text-destructive-foreground animate-pulse-soft" : "bg-muted text-foreground hover:bg-accent",
          )}
          aria-label="Voice input"
        >
          {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="h-10 px-4 rounded-full agro-gradient text-white text-sm font-semibold inline-flex items-center gap-1.5 shadow-soft disabled:opacity-50"
        >
          <Send className="h-4 w-4" /> {t("send")}
        </button>
      </form>
    </div>
  );
}

function Bubble({ m, lang }: { m: Msg; lang: string }) {
  const isUser = m.role === "user";
  const [playing, setPlaying] = useState(false);
  function toggleSpeak() {
    if (playing) { stopSpeaking(); setPlaying(false); return; }
    // FIX: use onend event on the utterance so the button resets reliably
    const SR = typeof window !== "undefined" ? window.SpeechSynthesisUtterance : null;
    if (!SR) return;
    const u = new SR(m.content);
    const map: Record<string, string> = {
      en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", bn: "bn-IN",
      mr: "mr-IN", gu: "gu-IN", pa: "pa-IN", kn: "kn-IN", ml: "ml-IN",
    };
    u.lang = map[lang] ?? "en-IN";
    u.rate = 0.98;
    u.pitch = 1;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setPlaying(true);
  }
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-soft",
          isUser
            ? "agro-gradient text-white rounded-br-md"
            : "bg-card border border-border rounded-bl-md",
        )}
      >
        {m.content}
        {!isUser && (
          <button
            onClick={toggleSpeak}
            className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80"
            aria-label="Speak"
          >
            {playing ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            {playing ? "Stop" : "Listen"}
          </button>
        )}
      </div>
    </div>
  );
}
