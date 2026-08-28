// Lightweight client helpers for low-network conditions.

export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine !== false;
}

type NetInfo = { saveData?: boolean; effectiveType?: string; downlink?: number };

export function getNetInfo(): NetInfo {
  if (typeof navigator === "undefined") return {};
  const c = (navigator as unknown as { connection?: NetInfo }).connection;
  return c ?? {};
}

/** True when the user is on a slow connection or has data-saver enabled. */
export function isLowNetwork(): boolean {
  const c = getNetInfo();
  if (c.saveData) return true;
  if (c.effectiveType && /(^|-)(2g|slow-2g)$/.test(c.effectiveType)) return true;
  if (typeof c.downlink === "number" && c.downlink > 0 && c.downlink < 0.5) return true;
  return false;
}

/** Speak text via the Web Speech API in the user's chosen language. */
export function speak(text: string, lang: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const map: Record<string, string> = {
      en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", bn: "bn-IN",
      mr: "mr-IN", gu: "gu-IN", pa: "pa-IN", kn: "kn-IN", ml: "ml-IN",
    };
    u.lang = map[lang] ?? "en-IN";
    u.rate = 0.98;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}
