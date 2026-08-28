export type ScanRecord = {
  id: string;
  ts: number;
  thumb: string; // small data URL
  crop?: string;
  condition?: string;
  confidence?: number;
  mobilenetGuess?: string;
  note?: string;
  symptoms?: string[];
  causes?: string[]; // FIX: was missing, so causes were lost on save
  treatment?: string[];
  prevention?: string[];
};

const KEY = "agro_scan_history_v1";
const MAX = 12;

export function loadScans(): ScanRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveScan(rec: ScanRecord) {
  if (typeof window === "undefined") return;
  const list = loadScans();
  const next = [rec, ...list].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function deleteScan(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(loadScans().filter((s) => s.id !== id)));
}

export function clearScans() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

/** Generate a small thumbnail data URL (~256px JPEG) from a source image data URL. */
export async function makeThumb(dataUrl: string, size = 256): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const r = Math.min(size / img.width, size / img.height, 1);
      const w = Math.round(img.width * r);
      const h = Math.round(img.height * r);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
