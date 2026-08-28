import { Wheat, Sprout, Apple, Cherry, Carrot, Citrus, Grape, Flame, Leaf, Nut, TreePine, Coffee, Flower2 } from "lucide-react";
import { cn } from "@/lib/utils";

type CropCategory = "grain" | "vegetable" | "fruit" | "spice" | "pulse" | "cash" | "nut" | "beverage" | "flower" | "tree";

const CATEGORY_MAP: { keywords: string[]; cat: CropCategory; icon: typeof Wheat }[] = [
  { keywords: ["wheat", "rice", "paddy", "basmati", "maize", "bajra", "jowar", "barley", "ragi", "millet", "corn", "sorghum"], cat: "grain", icon: Wheat },
  { keywords: ["tur", "arhar", "moong", "urad", "gram", "chana", "pulse", "lentil", "dal", "soybean", "soy"], cat: "pulse", icon: Sprout },
  { keywords: ["potato", "onion", "tomato", "brinjal", "cabbage", "cauliflower", "carrot", "cucumber", "peas", "pea", "spinach", "okra", "ladyfinger", "drumstick", "pumpkin", "beetroot", "radish", "vegetable"], cat: "vegetable", icon: Carrot },
  { keywords: ["banana", "mango", "apple", "grape", "orange", "lemon", "papaya", "pineapple", "guava", "pomegranate", "litchi", "watermelon", "cherry", "plum", "pear", "kiwi", "fruit", "mandarin", "apricot"], cat: "fruit", icon: Apple },
  { keywords: ["chilli", "chili", "turmeric", "ginger", "cumin", "coriander", "garlic", "pepper", "cardamom", "saffron", "mustard", "fennel", "mentha", "spice"], cat: "spice", icon: Flame },
  { keywords: ["cotton", "sugarcane", "jute", "tobacco", "rubber", "castor", "guar"], cat: "cash", icon: Leaf },
  { keywords: ["groundnut", "peanut", "cashew", "almond", "walnut", "coconut", "areca", "nut"], cat: "nut", icon: Nut },
  { keywords: ["tea", "coffee"], cat: "beverage", icon: Coffee },
  { keywords: ["rose", "marigold", "jasmine", "flower"], cat: "flower", icon: Flower2 },
  { keywords: ["bamboo", "tree", "wood"], cat: "tree", icon: TreePine },
];

const CAT_STYLES: Record<CropCategory, string> = {
  grain: "from-amber-200 to-amber-400 text-amber-900",
  pulse: "from-orange-100 to-amber-300 text-amber-900",
  vegetable: "from-emerald-200 to-green-400 text-emerald-900",
  fruit: "from-rose-200 to-red-400 text-rose-900",
  spice: "from-orange-300 to-red-500 text-white",
  cash: "from-lime-200 to-green-400 text-green-900",
  nut: "from-yellow-100 to-amber-300 text-amber-900",
  beverage: "from-stone-300 to-stone-500 text-stone-900",
  flower: "from-pink-200 to-fuchsia-400 text-fuchsia-900",
  tree: "from-emerald-300 to-teal-500 text-emerald-950",
};

export function classifyCrop(name: string): { cat: CropCategory; Icon: typeof Wheat } {
  const k = name.toLowerCase().trim();
  for (const entry of CATEGORY_MAP) {
    if (entry.keywords.some((w) => k.includes(w))) return { cat: entry.cat, Icon: entry.icon };
  }
  return { cat: "grain", Icon: Wheat };
}

export function CropIcon({ name, size = "md", className }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const { cat, Icon } = classifyCrop(name);
  const dims = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return (
    <div
      className={cn(
        "shrink-0 rounded-xl bg-gradient-to-br shadow-soft ring-1 ring-black/5 flex items-center justify-center",
        CAT_STYLES[cat],
        dims,
        className,
      )}
      aria-hidden
    >
      <Icon className={iconSize} strokeWidth={2.2} />
    </div>
  );
}
