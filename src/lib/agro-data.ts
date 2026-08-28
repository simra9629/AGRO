export type Scheme = {
  id: string;
  title: { en: string; hi: string };
  ministry: string;
  category: "subsidy" | "insurance" | "irrigation" | "credit" | "training" | "welfare" | "market";
  states?: string[]; // empty/undefined = central / all-India
  summary: { en: string; hi: string };
  link: string;
};

export const SCHEMES: Scheme[] = [
  {
    id: "pmkisan",
    title: { en: "PM-KISAN Samman Nidhi", hi: "पीएम-किसान सम्मान निधि" },
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "subsidy",
    summary: {
      en: "₹6,000/year direct income support to landholding farmers in three equal installments.",
      hi: "भूमिधारक किसानों को तीन किस्तों में ₹6,000/वर्ष की प्रत्यक्ष आय सहायता।",
    },
    link: "https://pmkisan.gov.in",
  },
  {
    id: "pmfby",
    title: { en: "Pradhan Mantri Fasal Bima Yojana", hi: "प्रधानमंत्री फसल बीमा योजना" },
    ministry: "Ministry of Agriculture",
    category: "insurance",
    summary: {
      en: "Crop insurance against natural calamities, pests and diseases at subsidised premiums (1.5–5%).",
      hi: "रियायती प्रीमियम (1.5–5%) पर प्राकृतिक आपदाओं और कीटों के विरुद्ध फसल बीमा।",
    },
    link: "https://pmfby.gov.in",
  },
  {
    id: "pmksy",
    title: { en: "PM Krishi Sinchayee Yojana", hi: "पीएम कृषि सिंचाई योजना" },
    ministry: "Jal Shakti",
    category: "irrigation",
    summary: {
      en: "Per-drop-more-crop irrigation support — drip & sprinkler subsidies up to 55%.",
      hi: "ड्रिप व स्प्रिंकलर पर 55% तक सब्सिडी, 'हर बूँद अधिक फसल'।",
    },
    link: "https://pmksy.gov.in",
  },
  {
    id: "kcc",
    title: { en: "Kisan Credit Card", hi: "किसान क्रेडिट कार्ड" },
    ministry: "Department of Financial Services",
    category: "credit",
    summary: {
      en: "Short-term credit up to ₹3 lakh at 4% effective interest for cultivation expenses.",
      hi: "खेती के खर्च हेतु ₹3 लाख तक 4% प्रभावी ब्याज पर अल्पावधि ऋण।",
    },
    link: "https://www.myscheme.gov.in/schemes/kcc",
  },
  {
    id: "shc",
    title: { en: "Soil Health Card", hi: "मृदा स्वास्थ्य कार्ड" },
    ministry: "Department of Agriculture",
    category: "training",
    summary: {
      en: "Free soil testing and crop-wise nutrient recommendations every 2 years.",
      hi: "हर 2 वर्ष में मुफ़्त मृदा परीक्षण और पोषक तत्व सलाह।",
    },
    link: "https://soilhealth.dac.gov.in",
  },
  {
    id: "enam",
    title: { en: "e-NAM National Agriculture Market", hi: "ई-नाम राष्ट्रीय कृषि बाज़ार" },
    ministry: "Ministry of Agriculture",
    category: "market",
    summary: {
      en: "Online trading of agricultural commodities across 1,400+ mandis for better price discovery.",
      hi: "1400+ मंडियों में कृषि उपज की ऑनलाइन बिक्री हेतु प्लेटफ़ॉर्म।",
    },
    link: "https://www.enam.gov.in",
  },
  {
    id: "pkvy",
    title: { en: "Paramparagat Krishi Vikas Yojana", hi: "परम्परागत कृषि विकास योजना" },
    ministry: "Ministry of Agriculture",
    category: "subsidy",
    summary: {
      en: "₹50,000/ha over 3 years to adopt organic farming in cluster mode.",
      hi: "क्लस्टर आधार पर 3 वर्षों में ₹50,000/हेक्टेयर जैविक खेती सहायता।",
    },
    link: "https://pgsindia-ncof.gov.in/PKVY",
  },
  {
    id: "rkvy",
    title: { en: "Rashtriya Krishi Vikas Yojana", hi: "राष्ट्रीय कृषि विकास योजना" },
    ministry: "Ministry of Agriculture",
    category: "subsidy",
    summary: {
      en: "State-level grants for agriculture infrastructure, agri-startups and value-chain projects.",
      hi: "कृषि अवसंरचना, स्टार्टअप और मूल्य-शृंखला परियोजनाओं हेतु राज्य-स्तरीय अनुदान।",
    },
    link: "https://rkvy.da.gov.in",
  },
  {
    id: "namo-drone",
    title: { en: "NAMO Drone Didi", hi: "नमो ड्रोन दीदी" },
    ministry: "Ministry of Agriculture",
    category: "subsidy",
    summary: {
      en: "80% subsidy on agri-drones (up to ₹8 lakh) for women-led SHG farmer collectives.",
      hi: "महिला स्वयं सहायता समूहों को कृषि ड्रोन पर 80% सब्सिडी (₹8 लाख तक)।",
    },
    link: "https://www.india.gov.in/spotlight/namo-drone-didi-scheme",
  },
  {
    id: "pm-pranam",
    title: { en: "PM PRANAM", hi: "पीएम प्रणाम" },
    ministry: "Department of Fertilizers",
    category: "subsidy",
    summary: {
      en: "Incentives to states reducing chemical fertilizer use and promoting bio-fertilizers.",
      hi: "रासायनिक उर्वरकों में कमी और जैव-उर्वरकों को बढ़ावा देने वाले राज्यों को प्रोत्साहन।",
    },
    link: "https://www.myscheme.gov.in",
  },
  {
    id: "agri-infra",
    title: { en: "Agriculture Infrastructure Fund", hi: "कृषि अवसंरचना कोष" },
    ministry: "Ministry of Agriculture",
    category: "credit",
    summary: {
      en: "₹1 lakh crore fund — 3% interest subvention + credit guarantee for post-harvest infra.",
      hi: "₹1 लाख करोड़ कोष — फसलोपरांत अवसंरचना के लिए 3% ब्याज छूट + क्रेडिट गारंटी।",
    },
    link: "https://agriinfra.dac.gov.in",
  },
  {
    id: "smam",
    title: { en: "Sub-Mission on Agricultural Mechanization", hi: "कृषि यंत्रीकरण उप-मिशन" },
    ministry: "Ministry of Agriculture",
    category: "subsidy",
    summary: {
      en: "40–50% subsidy on tractors, power tillers, harvesters and custom hiring centres.",
      hi: "ट्रैक्टर, पावर टिलर, हार्वेस्टर तथा कस्टम हायरिंग केंद्रों पर 40–50% सब्सिडी।",
    },
    link: "https://agrimachinery.nic.in",
  },
  {
    id: "nfsm",
    title: { en: "National Food Security Mission", hi: "राष्ट्रीय खाद्य सुरक्षा मिशन" },
    ministry: "Ministry of Agriculture",
    category: "subsidy",
    summary: {
      en: "Support for rice, wheat, pulses, coarse cereals & nutri-cereals through seed kits and inputs.",
      hi: "बीज किट और इनपुट सहायता द्वारा चावल, गेहूं, दलहन और मोटे अनाज को समर्थन।",
    },
    link: "https://www.nfsm.gov.in",
  },
  {
    id: "mids",
    title: { en: "Micro Irrigation Drip & Sprinkler Subsidy", hi: "सूक्ष्म सिंचाई सब्सिडी" },
    ministry: "Department of Agriculture",
    category: "irrigation",
    summary: {
      en: "Up to 55% subsidy for small/marginal farmers, 45% for others on drip & sprinkler systems.",
      hi: "लघु/सीमांत किसानों को 55% तक एवं अन्य को 45% सूक्ष्म सिंचाई सब्सिडी।",
    },
    link: "https://pmksy.gov.in/microirrigation",
  },
  {
    id: "kusum",
    title: { en: "PM-KUSUM Solar Pumps", hi: "पीएम-कुसुम सोलर पंप" },
    ministry: "Ministry of New & Renewable Energy",
    category: "subsidy",
    summary: {
      en: "60% subsidy on standalone solar pumps + grid-connected solar power plant on barren land.",
      hi: "स्टैंडअलोन सोलर पंप पर 60% सब्सिडी एवं बंजर भूमि पर सोलर प्लांट।",
    },
    link: "https://pmkusum.mnre.gov.in",
  },
  {
    id: "pmmsy",
    title: { en: "PM Matsya Sampada Yojana", hi: "पीएम मत्स्य सम्पदा योजना" },
    ministry: "Department of Fisheries",
    category: "welfare",
    summary: {
      en: "₹20,050 crore investment for fisheries — pond construction, hatcheries, cold-chain support.",
      hi: "मत्स्य पालन के लिए ₹20,050 करोड़ निवेश — तालाब, हैचरी, कोल्ड चेन।",
    },
    link: "https://pmmsy.dof.gov.in",
  },
  {
    id: "nlm",
    title: { en: "National Livestock Mission", hi: "राष्ट्रीय पशुधन मिशन" },
    ministry: "Department of Animal Husbandry",
    category: "subsidy",
    summary: {
      en: "50% capital subsidy (up to ₹50 lakh) for poultry, goat, sheep, pig & fodder entrepreneurship.",
      hi: "मुर्गी, बकरी, भेड़, सूअर एवं चारा उद्यमिता पर 50% पूँजी सब्सिडी (₹50 लाख तक)।",
    },
    link: "https://nlm.udyamimitra.in",
  },
  {
    id: "pmfme",
    title: { en: "PM Formalisation of Micro Food Enterprises", hi: "पीएम सूक्ष्म खाद्य उद्यम योजना" },
    ministry: "Ministry of Food Processing",
    category: "credit",
    summary: {
      en: "35% credit-linked subsidy (max ₹10 lakh) to upgrade micro food processing units.",
      hi: "सूक्ष्म खाद्य प्रसंस्करण इकाइयों के उन्नयन हेतु 35% क्रेडिट सब्सिडी (₹10 लाख तक)।",
    },
    link: "https://pmfme.mofpi.gov.in",
  },
  {
    id: "atma",
    title: { en: "ATMA — Extension Training", hi: "ATMA — विस्तार प्रशिक्षण" },
    ministry: "Department of Agriculture",
    category: "training",
    summary: {
      en: "District-level training, exposure visits and demonstrations for progressive farmers.",
      hi: "प्रगतिशील किसानों के लिए ज़िला-स्तरीय प्रशिक्षण, भ्रमण एवं प्रदर्शन।",
    },
    link: "https://extensionreforms.dac.gov.in",
  },
  // State-targeted
  {
    id: "ts-rythu",
    title: { en: "Rythu Bandhu", hi: "रायतु बंधु" },
    ministry: "Govt. of Telangana",
    category: "subsidy",
    states: ["Telangana"],
    summary: {
      en: "₹5,000/acre per season investment support to all farmers in Telangana — two crops a year.",
      hi: "तेलंगाना के किसानों को प्रति सीज़न ₹5,000/एकड़ निवेश सहायता — वर्ष में दो फसलें।",
    },
    link: "https://rythubandhu.telangana.gov.in",
  },
  {
    id: "ap-rythu",
    title: { en: "YSR Rythu Bharosa", hi: "वाईएसआर रायतु भरोसा" },
    ministry: "Govt. of Andhra Pradesh",
    category: "subsidy",
    states: ["Andhra Pradesh"],
    summary: {
      en: "₹13,500/year (incl. PM-KISAN) input support to landholding & tenant farmers.",
      hi: "₹13,500/वर्ष (पीएम-किसान सहित) इनपुट सहायता — भूस्वामी एवं किरायेदार किसान।",
    },
    link: "https://ysrrythubharosa.ap.gov.in",
  },
  {
    id: "od-kalia",
    title: { en: "KALIA Yojana", hi: "कालिया योजना" },
    ministry: "Govt. of Odisha",
    category: "welfare",
    states: ["Odisha"],
    summary: {
      en: "₹4,000/season livelihood support, life insurance and zero-interest crop loans.",
      hi: "₹4,000/सीज़न जीविका सहायता, जीवन बीमा एवं शून्य-ब्याज फसल ऋण।",
    },
    link: "https://kalia.odisha.gov.in",
  },
  {
    id: "mh-mahaagri",
    title: { en: "Mahatma Phule Krishi Karj Mukti", hi: "महात्मा फुले कृषि कर्ज मुक्ति" },
    ministry: "Govt. of Maharashtra",
    category: "credit",
    states: ["Maharashtra"],
    summary: {
      en: "One-time loan waiver up to ₹2 lakh for eligible Maharashtra farmers.",
      hi: "पात्र महाराष्ट्र किसानों के लिए ₹2 लाख तक एकमुश्त ऋण माफ़ी।",
    },
    link: "https://mjpsky.maharashtra.gov.in",
  },
  {
    id: "pb-paddy",
    title: { en: "Punjab DSR Direct Seeded Rice Incentive", hi: "पंजाब DSR धान प्रोत्साहन" },
    ministry: "Govt. of Punjab",
    category: "subsidy",
    states: ["Punjab", "Haryana"],
    summary: {
      en: "₹1,500/acre for switching from puddled transplanting to water-saving DSR method.",
      hi: "पारंपरिक रोपाई के बजाय जल-बचत DSR विधि अपनाने पर ₹1,500/एकड़।",
    },
    link: "https://agripb.gov.in",
  },
  {
    id: "kar-raitha",
    title: { en: "Raitha Shakthi Diesel Subsidy", hi: "रायता शक्ति डीज़ल सब्सिडी" },
    ministry: "Govt. of Karnataka",
    category: "subsidy",
    states: ["Karnataka"],
    summary: {
      en: "₹250/acre diesel subsidy (up to 5 acres) for irrigation during dry spells.",
      hi: "सूखे के दौरान सिंचाई हेतु ₹250/एकड़ डीज़ल सब्सिडी (अधिकतम 5 एकड़)।",
    },
    link: "https://raitamitra.karnataka.gov.in",
  },
];

export const CROPS = [
  { id: "wheat", name: { en: "Wheat", hi: "गेहूं" }, season: "Rabi", emoji: "🌾" },
  { id: "rice", name: { en: "Rice", hi: "धान" }, season: "Kharif", emoji: "🌾" },
  { id: "maize", name: { en: "Maize", hi: "मक्का" }, season: "Kharif", emoji: "🌽" },
  { id: "cotton", name: { en: "Cotton", hi: "कपास" }, season: "Kharif", emoji: "🪴" },
  { id: "sugarcane", name: { en: "Sugarcane", hi: "गन्ना" }, season: "Year-round", emoji: "🎋" },
  { id: "tomato", name: { en: "Tomato", hi: "टमाटर" }, season: "All", emoji: "🍅" },
  { id: "potato", name: { en: "Potato", hi: "आलू" }, season: "Rabi", emoji: "🥔" },
  { id: "soybean", name: { en: "Soybean", hi: "सोयाबीन" }, season: "Kharif", emoji: "🫘" },
];

// Comprehensive curated mandi dataset used as fallback when no live key configured.
// Prices are typical FY24-25 ranges per quintal (₹) for the listed mandi.
export const MANDI_BASELINE: {
  commodity: { en: string; hi: string };
  emoji: string;
  market: string;
  state: string;
  unit: string;
  basePrice: number;
}[] = [
  { commodity: { en: "Wheat", hi: "गेहूं" }, emoji: "🌾", market: "Karnal", state: "Haryana", unit: "quintal", basePrice: 2425 },
  { commodity: { en: "Wheat", hi: "गेहूं" }, emoji: "🌾", market: "Indore", state: "Madhya Pradesh", unit: "quintal", basePrice: 2510 },
  { commodity: { en: "Rice (Paddy)", hi: "धान" }, emoji: "🍚", market: "Raipur", state: "Chhattisgarh", unit: "quintal", basePrice: 2183 },
  { commodity: { en: "Basmati Paddy", hi: "बासमती धान" }, emoji: "🍚", market: "Karnal", state: "Haryana", unit: "quintal", basePrice: 4150 },
  { commodity: { en: "Onion", hi: "प्याज" }, emoji: "🧅", market: "Lasalgaon", state: "Maharashtra", unit: "quintal", basePrice: 1840 },
  { commodity: { en: "Onion", hi: "प्याज" }, emoji: "🧅", market: "Bengaluru", state: "Karnataka", unit: "quintal", basePrice: 2100 },
  { commodity: { en: "Tomato", hi: "टमाटर" }, emoji: "🍅", market: "Kolar", state: "Karnataka", unit: "quintal", basePrice: 1260 },
  { commodity: { en: "Tomato", hi: "टमाटर" }, emoji: "🍅", market: "Madanapalle", state: "Andhra Pradesh", unit: "quintal", basePrice: 1380 },
  { commodity: { en: "Potato", hi: "आलू" }, emoji: "🥔", market: "Agra", state: "Uttar Pradesh", unit: "quintal", basePrice: 980 },
  { commodity: { en: "Potato", hi: "आलू" }, emoji: "🥔", market: "Hooghly", state: "West Bengal", unit: "quintal", basePrice: 1050 },
  { commodity: { en: "Cotton", hi: "कपास" }, emoji: "🪡", market: "Rajkot", state: "Gujarat", unit: "quintal", basePrice: 7320 },
  { commodity: { en: "Soybean", hi: "सोयाबीन" }, emoji: "🫘", market: "Indore", state: "Madhya Pradesh", unit: "quintal", basePrice: 4612 },
  { commodity: { en: "Maize", hi: "मक्का" }, emoji: "🌽", market: "Davangere", state: "Karnataka", unit: "quintal", basePrice: 2105 },
  { commodity: { en: "Maize", hi: "मक्का" }, emoji: "🌽", market: "Nizamabad", state: "Telangana", unit: "quintal", basePrice: 2050 },
  { commodity: { en: "Sugarcane", hi: "गन्ना" }, emoji: "🎋", market: "Muzaffarnagar", state: "Uttar Pradesh", unit: "quintal", basePrice: 360 },
  { commodity: { en: "Turmeric", hi: "हल्दी" }, emoji: "🌿", market: "Erode", state: "Tamil Nadu", unit: "quintal", basePrice: 13450 },
  { commodity: { en: "Chilli", hi: "मिर्च" }, emoji: "🌶️", market: "Guntur", state: "Andhra Pradesh", unit: "quintal", basePrice: 17890 },
  { commodity: { en: "Mustard", hi: "सरसों" }, emoji: "🌼", market: "Sri Ganganagar", state: "Rajasthan", unit: "quintal", basePrice: 5620 },
  { commodity: { en: "Groundnut", hi: "मूँगफली" }, emoji: "🥜", market: "Junagadh", state: "Gujarat", unit: "quintal", basePrice: 6240 },
  { commodity: { en: "Bajra", hi: "बाजरा" }, emoji: "🌾", market: "Jaipur", state: "Rajasthan", unit: "quintal", basePrice: 2360 },
  { commodity: { en: "Jowar", hi: "ज्वार" }, emoji: "🌾", market: "Solapur", state: "Maharashtra", unit: "quintal", basePrice: 3120 },
  { commodity: { en: "Arhar (Tur)", hi: "अरहर" }, emoji: "🫘", market: "Latur", state: "Maharashtra", unit: "quintal", basePrice: 10520 },
  { commodity: { en: "Moong", hi: "मूँग" }, emoji: "🫘", market: "Jaipur", state: "Rajasthan", unit: "quintal", basePrice: 8740 },
  { commodity: { en: "Urad", hi: "उड़द" }, emoji: "🫘", market: "Gulbarga", state: "Karnataka", unit: "quintal", basePrice: 9320 },
  { commodity: { en: "Coriander", hi: "धनिया" }, emoji: "🌿", market: "Kota", state: "Rajasthan", unit: "quintal", basePrice: 7100 },
  { commodity: { en: "Garlic", hi: "लहसुन" }, emoji: "🧄", market: "Mandsaur", state: "Madhya Pradesh", unit: "quintal", basePrice: 14820 },
  // Eastern & North-Eastern states
  { commodity: { en: "Rice", hi: "धान" }, emoji: "🍚", market: "Patna", state: "Bihar", unit: "quintal", basePrice: 2210 },
  { commodity: { en: "Litchi", hi: "लीची" }, emoji: "🍒", market: "Muzaffarpur", state: "Bihar", unit: "quintal", basePrice: 8200 },
  { commodity: { en: "Jute", hi: "जूट" }, emoji: "🪢", market: "Bongaigaon", state: "Assam", unit: "quintal", basePrice: 5310 },
  { commodity: { en: "Tea Leaf", hi: "चाय पत्ती" }, emoji: "🍃", market: "Jorhat", state: "Assam", unit: "quintal", basePrice: 17400 },
  { commodity: { en: "Pineapple", hi: "अनानास" }, emoji: "🍍", market: "Agartala", state: "Tripura", unit: "quintal", basePrice: 1850 },
  { commodity: { en: "Ginger", hi: "अदरक" }, emoji: "🫚", market: "Aizawl", state: "Mizoram", unit: "quintal", basePrice: 9450 },
  { commodity: { en: "Cardamom", hi: "इलायची" }, emoji: "🌿", market: "Gangtok", state: "Sikkim", unit: "quintal", basePrice: 138000 },
  { commodity: { en: "Pineapple", hi: "अनानास" }, emoji: "🍍", market: "Dimapur", state: "Nagaland", unit: "quintal", basePrice: 1720 },
  { commodity: { en: "Maize", hi: "मक्का" }, emoji: "🌽", market: "Imphal", state: "Manipur", unit: "quintal", basePrice: 2080 },
  { commodity: { en: "Turmeric", hi: "हल्दी" }, emoji: "🌿", market: "Shillong", state: "Meghalaya", unit: "quintal", basePrice: 11800 },
  { commodity: { en: "Orange", hi: "संतरा" }, emoji: "🍊", market: "Itanagar", state: "Arunachal Pradesh", unit: "quintal", basePrice: 3950 },
  { commodity: { en: "Rice", hi: "धान" }, emoji: "🍚", market: "Cuttack", state: "Odisha", unit: "quintal", basePrice: 2230 },
  { commodity: { en: "Coconut", hi: "नारियल" }, emoji: "🥥", market: "Kochi", state: "Kerala", unit: "quintal", basePrice: 4980 },
  { commodity: { en: "Rubber", hi: "रबर" }, emoji: "🌳", market: "Kottayam", state: "Kerala", unit: "quintal", basePrice: 19200 },
  { commodity: { en: "Pepper", hi: "काली मिर्च" }, emoji: "🌶️", market: "Idukki", state: "Kerala", unit: "quintal", basePrice: 65500 },
  { commodity: { en: "Banana", hi: "केला" }, emoji: "🍌", market: "Theni", state: "Tamil Nadu", unit: "quintal", basePrice: 2640 },
  { commodity: { en: "Apple", hi: "सेब" }, emoji: "🍎", market: "Shimla", state: "Himachal Pradesh", unit: "quintal", basePrice: 8120 },
  { commodity: { en: "Apple", hi: "सेब" }, emoji: "🍎", market: "Sopore", state: "Jammu & Kashmir", unit: "quintal", basePrice: 7850 },
  { commodity: { en: "Saffron", hi: "केसर" }, emoji: "🌸", market: "Pampore", state: "Jammu & Kashmir", unit: "kg", basePrice: 285000 },
  { commodity: { en: "Apricot", hi: "खुबानी" }, emoji: "🍑", market: "Leh", state: "Ladakh", unit: "quintal", basePrice: 12400 },
  { commodity: { en: "Wheat", hi: "गेहूं" }, emoji: "🌾", market: "Haldwani", state: "Uttarakhand", unit: "quintal", basePrice: 2420 },
  { commodity: { en: "Rice", hi: "धान" }, emoji: "🍚", market: "Ranchi", state: "Jharkhand", unit: "quintal", basePrice: 2170 },
  { commodity: { en: "Cashew", hi: "काजू" }, emoji: "🥜", market: "Panaji", state: "Goa", unit: "quintal", basePrice: 14200 },
  { commodity: { en: "Coconut", hi: "नारियल" }, emoji: "🥥", market: "Port Blair", state: "Andaman & Nicobar Islands", unit: "quintal", basePrice: 4720 },
  { commodity: { en: "Coconut", hi: "नारियल" }, emoji: "🥥", market: "Kavaratti", state: "Lakshadweep", unit: "quintal", basePrice: 5100 },
  { commodity: { en: "Vegetables", hi: "सब्ज़ी" }, emoji: "🥬", market: "Azadpur", state: "Delhi", unit: "quintal", basePrice: 2150 },
  { commodity: { en: "Wheat", hi: "गेहूं" }, emoji: "🌾", market: "Sector 26", state: "Chandigarh", unit: "quintal", basePrice: 2390 },
  { commodity: { en: "Rice", hi: "धान" }, emoji: "🍚", market: "Puducherry", state: "Puducherry", unit: "quintal", basePrice: 2280 },
  { commodity: { en: "Mango", hi: "आम" }, emoji: "🥭", market: "Daman", state: "Dadra & Nagar Haveli and Daman & Diu", unit: "quintal", basePrice: 3800 },
];
