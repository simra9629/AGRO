import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { useLang } from "@/lib/i18n";

// BeforeInstallPromptEvent is not in the standard TS lib
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // @ts-expect-error – iOS Safari specific
    window.navigator.standalone === true
  );
}

const DISMISSED_KEY = "agro_install_dismissed";

export function InstallPrompt() {
  const { lang } = useLang();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed or already dismissed this session
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    if (isIOS()) {
      // Show iOS hint after a short delay so it doesn't feel immediate
      const t = setTimeout(() => {
        setShowIOSHint(true);
        setVisible(true);
      }, 4000);
      return () => clearTimeout(t);
    }

    // Chrome / Android / Desktop
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  }

  if (!visible) return null;

  const labels = {
    title: {
      en: "Install AGRO",
      hi: "AGRO इंस्टॉल करें",
      ta: "AGRO நிறுவுக",
      te: "AGRO ఇన్‌స్టాల్ చేయండి",
      bn: "AGRO ইনস্টল করুন",
      mr: "AGRO स्थापित करा",
      gu: "AGRO ઇન્સ્ટૉલ કરો",
      pa: "AGRO ਇੰਸਟਾਲ ਕਰੋ",
      kn: "AGRO ಸ್ಥಾಪಿಸಿ",
      ml: "AGRO ഇൻസ്റ്റാൾ ചെയ്യുക",
    },
    body: {
      en: "Add to your home screen for offline access and faster loading.",
      hi: "ऑफलाइन एक्सेस के लिए होम स्क्रीन पर जोड़ें।",
      ta: "ஆஃப்லைன் அணுகலுக்கு முகப்புத் திரையில் சேர்க்கவும்.",
      te: "ఆఫ్‌లైన్ యాక్సెస్ కోసం హోమ్ స్క్రీన్‌కు జోడించండి.",
      bn: "অফলাইন অ্যাক্সেসের জন্য হোম স্ক্রিনে যোগ করুন।",
      mr: "ऑफलाइन प्रवेशासाठी होम स्क्रीनवर जोडा.",
      gu: "ઑફલાઇન ઍક્સેસ માટે હોમ સ્ક્રીન પર ઉમેરો.",
      pa: "ਆਫਲਾਈਨ ਐਕਸੈੱਸ ਲਈ ਹੋਮ ਸਕ੍ਰੀਨ 'ਤੇ ਸ਼ਾਮਲ ਕਰੋ।",
      kn: "ಆಫ್‌ಲೈನ್ ಪ್ರವೇಶಕ್ಕಾಗಿ ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ.",
      ml: "ഓഫ്‌ലൈൻ ആക്‌സസിനായി ഹോം സ്ക്രീനിൽ ചേർക്കുക.",
    },
    iosBody: {
      en: "Tap the Share button below, then choose \"Add to Home Screen\".",
      hi: "नीचे Share बटन दबाएं, फिर \"होम स्क्रीन में जोड़ें\" चुनें।",
      ta: "கீழே உள்ள Share பொத்தானை தட்டி, \"முகப்புத் திரையில் சேர்\" என்பதை தேர்வு செய்யவும்.",
      te: "దిగువ Share బటన్ నొక్కండి, తర్వాత \"హోమ్ స్క్రీన్‌కు జోడించు\" ఎంచుకోండి.",
      bn: "নিচে Share বোতামে ট্যাপ করুন, তারপর \"হোম স্ক্রিনে যোগ করুন\" বেছে নিন।",
      mr: "खाली Share बटण दाबा, नंतर \"होम स्क्रीनवर जोडा\" निवडा.",
      gu: "નીચે Share બટન ટૅપ કરો, પછી \"હોમ સ્ક્રીન પર ઉમેરો\" પસંદ કરો.",
      pa: "ਹੇਠਾਂ Share ਬਟਨ ਦਬਾਓ, ਫਿਰ \"ਹੋਮ ਸਕ੍ਰੀਨ 'ਤੇ ਜੋੜੋ\" ਚੁਣੋ।",
      kn: "ಕೆಳಗೆ Share ಬಟನ್ ಟ್ಯಾಪ್ ಮಾಡಿ, ನಂತರ \"ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ\" ಆಯ್ಕೆ ಮಾಡಿ.",
      ml: "ചുവടെ Share ബട്ടൺ ടാപ്പ് ചെയ്ത് \"ഹോം സ്ക്രീനിലേക്ക് ചേർക്കുക\" തിരഞ്ഞെടുക്കുക.",
    },
    install: {
      en: "Install",
      hi: "इंस्टॉल करें",
      ta: "நிறுவு",
      te: "ఇన్‌స్టాల్",
      bn: "ইনস্টল",
      mr: "स्थापित करा",
      gu: "ઇન્સ્ટૉલ",
      pa: "ਇੰਸਟਾਲ",
      kn: "ಸ್ಥಾಪಿಸಿ",
      ml: "ഇൻസ്റ്റാൾ",
    },
  } as const;

  type LangKey = keyof typeof labels.title;
  const l = (lang as LangKey) in labels.title ? (lang as LangKey) : "en";

  return (
    <div
      role="dialog"
      aria-label={labels.title[l]}
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50
                 bg-white border border-green-200 shadow-xl rounded-2xl p-4
                 flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300"
    >
      {/* Icon */}
      <div className="shrink-0 w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white">
        {showIOSHint ? <Share size={18} /> : <Download size={18} />}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-green-900 leading-tight">
          {labels.title[l]}
        </p>
        <p className="text-xs text-green-700 mt-0.5 leading-snug">
          {showIOSHint ? labels.iosBody[l] : labels.body[l]}
        </p>

        {/* Install button — only for non-iOS (iOS just shows the hint text) */}
        {!showIOSHint && (
          <button
            onClick={install}
            className="mt-2 px-3 py-1 text-xs font-semibold rounded-lg
                       bg-green-600 text-white hover:bg-green-700 active:scale-95 transition-all"
          >
            {labels.install[l]}
          </button>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-green-400 hover:text-green-600 transition-colors mt-0.5"
      >
        <X size={16} />
      </button>
    </div>
  );
}
