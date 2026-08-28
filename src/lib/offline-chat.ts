// Rule-based offline fallback for the AI assistant.
// Used when the network call fails or `navigator.onLine` is false.

type Rule = { keywords: string[]; reply: { en: string; hi: string } };

const RULES: Rule[] = [
  {
    keywords: ["yellow", "yellowing", "पीला", "पीली", "पीले"],
    reply: {
      en: "Yellowing leaves usually indicate nitrogen deficiency or overwatering. Check soil moisture, add urea/compost (10-15 kg/acre split), and ensure drainage.",
      hi: "पत्तियों का पीला होना नाइट्रोजन की कमी या अधिक पानी देने का संकेत है। मिट्टी की नमी जाँचें, यूरिया/कम्पोस्ट डालें और जल निकासी सुनिश्चित करें।",
    },
  },
  {
    keywords: ["aphid", "माहू", "जूँ", "pest"],
    reply: {
      en: "For aphids: spray neem oil (5 ml/L water) early morning, repeat after 7 days. Encourage ladybirds. Avoid broad-spectrum chemicals.",
      hi: "माहू के लिए सुबह नीम का तेल (5 मिली/लीटर) छिड़कें, 7 दिन बाद दोहराएँ। लेडीबर्ड कीटों को बढ़ाएँ।",
    },
  },
  {
    keywords: ["water", "irrigation", "irrigate", "सिंचाई", "पानी"],
    reply: {
      en: "Water early morning or evening to reduce evaporation. Wheat needs 4-6 irrigations. Use drip/sprinkler where possible — 30-40% water savings.",
      hi: "सुबह या शाम सिंचाई करें। गेहूं को 4-6 बार सिंचाई चाहिए। ड्रिप/स्प्रिंकलर से 30-40% पानी बचा सकते हैं।",
    },
  },
  {
    keywords: ["fertilizer", "urea", "खाद", "उर्वरक"],
    reply: {
      en: "Get soil tested first (Soil Health Card — free). General NPK for wheat: 120-60-40 kg/ha. Split urea: 1/3 at sowing, 1/3 at tillering, 1/3 at booting.",
      hi: "पहले मिट्टी की जाँच कराएँ (मृदा स्वास्थ्य कार्ड — मुफ्त)। गेहूं हेतु NPK: 120-60-40 किग्रा/हेक्टेयर। यूरिया को तीन बार में डालें।",
    },
  },
  {
    keywords: ["price", "mandi", "rate", "मंडी", "भाव", "कीमत"],
    reply: {
      en: "Check live mandi prices on the Market screen. Tip: sell on rising trends, hold during sharp dips when storage allows.",
      hi: "बाज़ार स्क्रीन पर लाइव मंडी भाव देखें। सुझाव: बढ़ते भाव पर बेचें, गिरावट में भंडारण उपलब्ध हो तो रुकें।",
    },
  },
  {
    keywords: ["scheme", "subsidy", "loan", "योजना", "सब्सिडी", "ऋण"],
    reply: {
      en: "Top central schemes: PM-KISAN (₹6,000/yr), PMFBY (crop insurance), KCC (loan up to ₹3L at 4%). Open the Schemes screen to browse all.",
      hi: "मुख्य केंद्रीय योजनाएँ: पीएम-किसान (₹6,000/वर्ष), पीएमएफबीवाई (फसल बीमा), केसीसी (₹3 लाख तक 4% ब्याज)।",
    },
  },
  {
    keywords: ["weather", "rain", "मौसम", "बारिश"],
    reply: {
      en: "Open the Weather screen for the 7-day forecast and farmer alerts. Avoid spraying before rain. Sow within 24 hours of first 25mm monsoon rain.",
      hi: "मौसम स्क्रीन पर 7-दिन का पूर्वानुमान देखें। बारिश से पहले छिड़काव से बचें। पहली 25 मिमी मानसून वर्षा के 24 घंटे में बोएँ।",
    },
  },
  {
    keywords: ["organic", "जैविक", "natural"],
    reply: {
      en: "Use farmyard manure (10 t/ha), vermicompost, jeevamrut spray, and crop rotation with legumes. PKVY scheme gives ₹50,000/ha over 3 years.",
      hi: "गोबर खाद (10 टन/हेक्टेयर), वर्मीकम्पोस्ट, जीवामृत और दलहन के साथ फसल चक्र अपनाएँ। PKVY से 3 वर्ष में ₹50,000/हेक्टेयर मिलते हैं।",
    },
  },
];

const DEFAULT = {
  en: "You appear offline. AGRO will retry when the connection returns. Meanwhile: check the Market, Weather, or Schemes screens — they cache the latest data.",
  hi: "आप ऑफ़लाइन प्रतीत होते हैं। कनेक्शन लौटते ही AGRO फिर कोशिश करेगा। तब तक मंडी, मौसम या योजनाएँ स्क्रीन देखें — वे अंतिम डेटा कैश रखती हैं।",
};

export function offlineReply(text: string, lang: string): string {
  const q = text.toLowerCase();
  for (const r of RULES) {
    if (r.keywords.some((k) => q.includes(k.toLowerCase()))) {
      return r.reply[lang === "hi" ? "hi" : "en"];
    }
  }
  return DEFAULT[lang === "hi" ? "hi" : "en"];
}
