import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MANDI_BASELINE } from "./agro-data";

const Input = z.object({
  state: z.string().max(60).optional(),
  query: z.string().max(60).optional(),
  limit: z.number().min(1).max(500).optional(),
});

export type MandiRow = {
  commodity: { en: string; hi: string };
  emoji: string;
  market: string;
  state: string;
  unit: string;
  price: number;
  delta: number;
  source: "data.gov.in" | "curated";
};

const COMMODITY_EMOJI: Record<string, string> = {
  wheat: "🌾", rice: "🍚", paddy: "🌾", maize: "🌽", bajra: "🌾", jowar: "🌾", barley: "🌾",
  potato: "🥔", onion: "🧅", tomato: "🍅", garlic: "🧄", ginger: "🫚",
  banana: "🍌", apple: "🍎", mango: "🥭", grapes: "🍇", orange: "🍊", papaya: "🍈",
  cotton: "🧺", sugarcane: "🎋", soybean: "🌱", groundnut: "🥜",
  brinjal: "🍆", cabbage: "🥬", cauliflower: "🥦", carrot: "🥕", chilli: "🌶️", drumstick: "🌿",
  coconut: "🥥", lemon: "🍋", peas: "🟢", cucumber: "🥒",
};

function emojiFor(name: string) {
  const k = name.toLowerCase().trim();
  for (const key of Object.keys(COMMODITY_EMOJI)) {
    if (k.includes(key)) return COMMODITY_EMOJI[key];
  }
  return "🌾";
}

function seededDelta(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((((h >>> 0) % 10000) / 10000) - 0.5) * 12;
}

function curated(state?: string, query?: string): MandiRow[] {
  const day = new Date().toISOString().slice(0, 10);
  const term = (query || "").trim().toLowerCase();
  return MANDI_BASELINE.filter((r) => {
    if (state && r.state.toLowerCase() !== state.toLowerCase()) return false;
    if (!term) return true;
    return (
      r.commodity.en.toLowerCase().includes(term) ||
      r.commodity.hi.includes(term) ||
      r.market.toLowerCase().includes(term) ||
      r.state.toLowerCase().includes(term)
    );
  }).map((r) => {
    const delta = +seededDelta(`${day}|${r.commodity.en}|${r.market}`).toFixed(1);
    const price = Math.max(1, Math.round(r.basePrice * (1 + delta / 100)));
    return { ...r, price, delta, source: "curated" as const };
  });
}

export const fetchMandiPrices = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data ?? {}))
  .handler(async ({ data }) => {
    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    if (apiKey) {
      try {
        const url = new URL(
          "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
        );
        url.searchParams.set("api-key", apiKey);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", String(data.limit ?? 200));
        if (data.state) url.searchParams.set("filters[state]", data.state);
        if (data.query) url.searchParams.set("filters[commodity]", data.query);

        const res = await fetch(url.toString(), { signal: AbortSignal.timeout(9000) });
        if (res.ok) {
          const json = (await res.json()) as { records?: Array<Record<string, string | number>> };
          const rows: MandiRow[] = (json.records ?? []).map((r) => {
            const min = Number(r.min_price ?? 0);
            const max = Number(r.max_price ?? 0);
            const modal = Number(r.modal_price ?? Math.round((min + max) / 2)) || 0;
            const avg = (min + max) / 2 || modal;
            const delta = avg > 0 ? +(((modal - avg) / avg) * 100).toFixed(1) : 0;
            const name = String(r.commodity ?? "—");
            const market = String(r.market ?? "—");
            const district = String(r.district ?? "");
            return {
              commodity: { en: name, hi: name },
              emoji: emojiFor(name),
              market: district && district !== market ? `${market} · ${district}` : market,
              state: String(r.state ?? "—"),
              unit: "quintal",
              price: modal,
              delta,
              source: "data.gov.in" as const,
            };
          }).filter((r) => r.price > 0);
          if (rows.length) return { rows, source: "data.gov.in" as const };
        } else {
          console.error("[mandi] data.gov.in status", res.status);
        }
      } catch (e) {
        console.error("[mandi] data.gov.in fetch failed, falling back to curated", e);
      }
    }
    return { rows: curated(data.state, data.query), source: "curated" as const };
  });
