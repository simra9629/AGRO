import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGS = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", flag: "🇮🇳" },
] as const;

export type Lang = (typeof LANGS)[number]["code"];

type Entry = { en: string } & Partial<Record<Lang, string>>;
type Dict = Record<string, Entry>;

export const T = {
  appName: { en: "AGRO", hi: "एग्रो", ta: "அக்ரோ", te: "ఆగ్రో", bn: "এগ্রো", mr: "एग्रो", gu: "એગ્રો", pa: "ਐਗਰੋ", kn: "ಆಗ್ರೋ", ml: "അഗ്രോ" },
  tagline: {
    en: "Your AI farming companion",
    hi: "आपका एआई कृषि साथी",
    ta: "உங்கள் AI விவசாய துணை",
    te: "మీ AI వ్యవసాయ సహచరుడు",
    bn: "আপনার AI কৃষি সঙ্গী",
    mr: "तुमचा AI शेती सोबती",
    gu: "તમારો AI ખેતી સાથી",
    pa: "ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਾਥੀ",
    kn: "ನಿಮ್ಮ AI ಕೃಷಿ ಸಂಗಾತಿ",
    ml: "നിങ്ങളുടെ AI കാർഷിക സഹചാരി",
  },
  home: { en: "Home", hi: "होम", ta: "முகப்பு", te: "హోమ్", bn: "হোম", mr: "होम", gu: "હોમ", pa: "ਹੋਮ", kn: "ಮುಖಪುಟ", ml: "ഹോം" },
  chat: { en: "Assistant", hi: "सहायक", ta: "உதவியாளர்", te: "సహాయకుడు", bn: "সহকারী", mr: "सहाय्यक", gu: "સહાયક", pa: "ਸਹਾਇਕ", kn: "ಸಹಾಯಕ", ml: "സഹായി" },
  weather: { en: "Weather", hi: "मौसम", ta: "வானிலை", te: "వాతావరణం", bn: "আবহাওয়া", mr: "हवामान", gu: "હવામાન", pa: "ਮੌਸਮ", kn: "ಹವಾಮಾನ", ml: "കാലാവസ്ഥ" },
  scan: { en: "Scan", hi: "स्कैन", ta: "ஸ்கேன்", te: "స్కాన్", bn: "স্ক্যান", mr: "स्कॅन", gu: "સ્કેન", pa: "ਸਕੈਨ", kn: "ಸ್ಕ್ಯಾನ್", ml: "സ്കാൻ" },
  schemes: { en: "Schemes", hi: "योजनाएं", ta: "திட்டங்கள்", te: "పథకాలు", bn: "প্রকল্প", mr: "योजना", gu: "યોજનાઓ", pa: "ਯੋਜਨਾਵਾਂ", kn: "ಯೋಜನೆಗಳು", ml: "പദ്ധതികൾ" },
  market: { en: "Market", hi: "मंडी", ta: "சந்தை", te: "మార్కెట్", bn: "বাজার", mr: "बाजार", gu: "બજાર", pa: "ਮੰਡੀ", kn: "ಮಾರುಕಟ್ಟೆ", ml: "ചന്ത" },
  profile: { en: "Profile", hi: "प्रोफ़ाइल", ta: "சுயவிவரம்", te: "ప్రొఫైల్", bn: "প্রোফাইল", mr: "प्रोफाइल", gu: "પ્રોફાઇલ", pa: "ਪ੍ਰੋਫਾਈਲ", kn: "ಪ್ರೊಫೈಲ್", ml: "പ്രൊഫൈൽ" },
  speak: { en: "Speak", hi: "बोलें", ta: "பேசு", te: "మాట్లాడు", bn: "বলুন", mr: "बोला", gu: "બોલો", pa: "ਬੋਲੋ", kn: "ಮಾತನಾಡಿ", ml: "സംസാരിക്കുക" },
  scanCrop: { en: "Scan Crop", hi: "फसल जांच", ta: "பயிர் ஸ்கேன்", te: "పంట స్కాన్", bn: "ফসল স্ক্যান", mr: "पीक स्कॅन", gu: "પાક સ્કેન", pa: "ਫਸਲ ਸਕੈਨ", kn: "ಬೆಳೆ ಸ್ಕ್ಯಾನ್", ml: "വിള സ്കാൻ" },
  cropHelp: { en: "Crop Help", hi: "फसल सहायता", ta: "பயிர் உதவி", te: "పంట సహాయం", bn: "ফসল সহায়তা", mr: "पीक मदत", gu: "પાક મદદ", pa: "ਫਸਲ ਮਦਦ", kn: "ಬೆಳೆ ಸಹಾಯ", ml: "വിള സഹായം" },
  goodMorning: { en: "Good morning", hi: "सुप्रभात", ta: "காலை வணக்கம்", te: "శుభోదయం", bn: "সুপ্রভাত", mr: "सुप्रभात", gu: "સુપ્રભાત", pa: "ਸ਼ੁਭ ਸਵੇਰ", kn: "ಶುಭೋದಯ", ml: "സുപ്രഭാതം" },
  goodAfternoon: { en: "Good afternoon", hi: "नमस्ते", ta: "மதிய வணக்கம்", te: "శుభ మధ్యాహ్నం", bn: "শুভ অপরাহ্ন", mr: "नमस्कार", gu: "નમસ્તે", pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", kn: "ಶುಭ ಮಧ್ಯಾಹ್ನ", ml: "ഉച്ച വണക്കം" },
  goodEvening: { en: "Good evening", hi: "शुभ संध्या", ta: "மாலை வணக்கம்", te: "శుభ సాయంత్రం", bn: "শুভ সন্ধ্যা", mr: "शुभ संध्याकाळ", gu: "શુભ સંધ્યા", pa: "ਸ਼ੁਭ ਸ਼ਾਮ", kn: "ಶುಭ ಸಂಜೆ", ml: "ശുഭ സന്ധ്യ" },
  todayAdvice: { en: "Today's advice" },
  quickActions: { en: "Quick actions", hi: "त्वरित कार्य", ta: "விரைவு செயல்கள்", te: "త్వరిత చర్యలు", bn: "দ্রুত কাজ", mr: "त्वरित कृती", gu: "ઝડપી ક્રિયાઓ", pa: "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ", kn: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು", ml: "ദ്രുത പ്രവർത്തനങ്ങൾ" },
  recentChats: { en: "Recent conversations" },
  noChats: { en: "Start a conversation to see it here." },
  askAnything: { en: "Ask anything about farming…", hi: "कृषि के बारे में पूछें…" },
  send: { en: "Send", hi: "भेजें" },
  uploadImage: { en: "Upload crop image", hi: "फसल की छवि अपलोड करें" },
  analyzing: { en: "Analyzing your crop…", hi: "आपकी फसल का विश्लेषण…" },
  diseaseTitle: { en: "Crop Disease Scanner", hi: "फसल रोग स्कैनर" },
  diseaseHint: { en: "Photograph a leaf or affected area. AGRO will identify likely diseases and suggest treatment.", hi: "पत्ती की फोटो लें।" },
  weatherTitle: { en: "Weather Intelligence", hi: "मौसम बुद्धिमत्ता" },
  schemesTitle: { en: "Government Schemes", hi: "सरकारी योजनाएं" },
  searchSchemes: { en: "Search schemes…", hi: "योजनाएं खोजें…" },
  language: { en: "Language", hi: "भाषा", ta: "மொழி", te: "భాష", bn: "ভাষা", mr: "भाषा", gu: "ભાષા", pa: "ਭਾਸ਼ਾ", kn: "ಭಾಷೆ", ml: "ഭാഷ" },
  // Onboarding
  welcome: { en: "Welcome to AGRO", hi: "एग्रो में आपका स्वागत है", ta: "AGRO-வுக்கு வரவேற்கிறோம்", te: "AGRO కి స్వాగతం", bn: "AGRO তে স্বাগতম", mr: "AGRO मध्ये स्वागत", gu: "AGRO માં આપનું સ્વાગત", pa: "AGRO ਵਿੱਚ ਜੀ ਆਇਆਂ", kn: "AGRO ಗೆ ಸ್ವಾಗತ", ml: "AGRO യിലേക്ക് സ്വാഗതം" },
  chooseLanguage: { en: "Choose your language", hi: "अपनी भाषा चुनें", ta: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்", te: "మీ భాషను ఎంచుకోండి", bn: "আপনার ভাষা নির্বাচন করুন", mr: "तुमची भाषा निवडा", gu: "તમારી ભાષા પસંદ કરો", pa: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ", kn: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", ml: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക" },
  yourName: { en: "Your name", hi: "आपका नाम", ta: "உங்கள் பெயர்", te: "మీ పేరు", bn: "আপনার নাম", mr: "तुमचे नाव", gu: "તમારું નામ", pa: "ਤੁਹਾਡਾ ਨਾਮ", kn: "ನಿಮ್ಮ ಹೆಸರು", ml: "നിങ്ങളുടെ പേര്" },
  whereFarm: { en: "Where do you farm?", hi: "आप कहाँ खेती करते हैं?", ta: "எங்கே விவசாயம் செய்கிறீர்கள்?", te: "మీరు ఎక్కడ వ్యవసాయం చేస్తారు?", bn: "কোথায় চাষ করেন?", mr: "तुम्ही कुठे शेती करता?", gu: "ક્યાં ખેતી કરો છો?", pa: "ਤੁਸੀਂ ਕਿੱਥੇ ਖੇਤੀ ਕਰਦੇ ਹੋ?", kn: "ನೀವು ಎಲ್ಲಿ ಕೃಷಿ ಮಾಡುತ್ತೀರಿ?", ml: "നിങ്ങൾ എവിടെ കൃഷി ചെയ്യുന്നു?" },
  mainCrop: { en: "Main crop", hi: "मुख्य फसल", ta: "முக்கிய பயிர்", te: "ప్రధాన పంట", bn: "প্রধান ফসল", mr: "मुख्य पीक", gu: "મુખ્ય પાક", pa: "ਮੁੱਖ ਫਸਲ", kn: "ಮುಖ್ಯ ಬೆಳೆ", ml: "പ്രധാന വിള" },
  continue: { en: "Continue", hi: "जारी रखें", ta: "தொடரவும்", te: "కొనసాగించండి", bn: "চালিয়ে যান", mr: "पुढे जा", gu: "ચાલુ રાખો", pa: "ਜਾਰੀ ਰੱਖੋ", kn: "ಮುಂದುವರಿಸಿ", ml: "തുടരുക" },
  skip: { en: "Skip", hi: "छोड़ें", ta: "தவிர்", te: "దాటవేయండి", bn: "এড়িয়ে যান", mr: "वगळा", gu: "છોડો", pa: "ਛੱਡੋ", kn: "ಬಿಟ್ಟುಬಿಡಿ", ml: "ഒഴിവാക്കുക" },
  getStarted: { en: "Get started", hi: "शुरू करें", ta: "தொடங்குங்கள்", te: "ప్రారంభించండి", bn: "শুরু করুন", mr: "सुरू करा", gu: "શરૂ કરો", pa: "ਸ਼ੁਰੂ ਕਰੋ", kn: "ಪ್ರಾರಂಭಿಸಿ", ml: "ആരംഭിക്കുക" },
  back: { en: "Back", hi: "वापस", ta: "பின்", te: "వెనుకకు", bn: "পেছনে", mr: "मागे", gu: "પાછળ", pa: "ਪਿੱਛੇ", kn: "ಹಿಂದೆ", ml: "പിന്നോട്ട്" },
  onboardingIntro: {
    en: "AI-powered guidance for crops, weather, disease scanning and government schemes — all in your language.",
    hi: "फसल, मौसम, रोग स्कैनिंग और सरकारी योजनाओं के लिए एआई सलाह — आपकी भाषा में।",
    ta: "பயிர், வானிலை, நோய் ஸ்கேன் மற்றும் அரசு திட்டங்களுக்கான AI வழிகாட்டுதல் — உங்கள் மொழியில்.",
    te: "పంటలు, వాతావరణం, వ్యాధి స్కానింగ్ మరియు ప్రభుత్వ పథకాల కోసం AI మార్గదర్శకత్వం — మీ భాషలో.",
    bn: "ফসল, আবহাওয়া, রোগ স্ক্যান এবং সরকারি প্রকল্পের জন্য AI নির্দেশনা — আপনার ভাষায়।",
    mr: "पीक, हवामान, रोग स्कॅनिंग आणि सरकारी योजनांसाठी AI मार्गदर्शन — तुमच्या भाषेत.",
    gu: "પાક, હવામાન, રોગ સ્કેન અને સરકારી યોજનાઓ માટે AI માર્ગદર્શન — તમારી ભાષામાં.",
    pa: "ਫਸਲ, ਮੌਸਮ, ਰੋਗ ਸਕੈਨ ਅਤੇ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਲਈ AI ਮਾਰਗਦਰਸ਼ਨ — ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ.",
    kn: "ಬೆಳೆ, ಹವಾಮಾನ, ರೋಗ ಸ್ಕ್ಯಾನ್ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ AI ಮಾರ್ಗದರ್ಶನ — ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ.",
    ml: "വിള, കാലാവസ്ഥ, രോഗ സ്കാൻ, സർക്കാർ പദ്ധതികൾ — നിങ്ങളുടെ ഭാഷയിൽ AI മാർഗ്ഗനിർദ്ദേശം.",
  },
  tellAboutFarm: { en: "Tell us about your farm", hi: "अपने खेत के बारे में बताएं", ta: "உங்கள் பண்ணை பற்றி சொல்லுங்கள்", te: "మీ పొలం గురించి చెప్పండి", bn: "আপনার খামার সম্পর্কে বলুন", mr: "तुमच्या शेताबद्दल सांगा", gu: "તમારા ખેતર વિશે કહો", pa: "ਆਪਣੇ ਖੇਤ ਬਾਰੇ ਦੱਸੋ", kn: "ನಿಮ್ಮ ಜಮೀನಿನ ಬಗ್ಗೆ ಹೇಳಿ", ml: "നിങ്ങളുടെ കൃഷിയിടത്തെക്കുറിച്ച് പറയുക" },
  state: { en: "State", hi: "राज्य", ta: "மாநிலம்", te: "రాష్ట్రం", bn: "রাজ্য", mr: "राज्य", gu: "રાજ્ય", pa: "ਰਾਜ", kn: "ರಾಜ್ಯ", ml: "സംസ്ഥാനം" },
  village: { en: "Village", hi: "गाँव", ta: "கிராமம்", te: "గ్రామం", bn: "গ্রাম", mr: "गाव", gu: "ગામ", pa: "ਪਿੰਡ", kn: "ಗ್ರಾಮ", ml: "ഗ്രാമം" },
} satisfies Dict;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: keyof typeof T) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("agro_lang")) as Lang | null;
    if (saved && LANGS.some((l) => l.code === saved)) setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("agro_lang", l);
  };
  const t = (k: keyof typeof T) => {
    const entry = T[k] as Entry;
    return (entry?.[lang] ?? entry?.en ?? String(k)) as string;
  };
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

/** Pick a localized string from a partial dict, falling back to English. */
export function tr(obj: { en: string } & Partial<Record<string, string>>, lang: string): string {
  return (obj as Record<string, string>)[lang] ?? obj.en;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
