export type FarmProfile = {
  name: string;
  village: string;
  state: string;
  landAcres: string;
  mainCrop: string;
  lat?: number;
  lon?: number;
};

const KEY = "agro_profile";

export function readProfile(): FarmProfile {
  if (typeof window === "undefined") return { name: "", village: "", state: "", landAcres: "", mainCrop: "" };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { name: "", village: "", state: "", landAcres: "", mainCrop: "" };
    return { name: "", village: "", state: "", landAcres: "", mainCrop: "", ...JSON.parse(raw) };
  } catch {
    return { name: "", village: "", state: "", landAcres: "", mainCrop: "" };
  }
}

export function writeProfile(p: Partial<FarmProfile>) {
  if (typeof window === "undefined") return;
  const existing = readProfile();
  localStorage.setItem(KEY, JSON.stringify({ ...existing, ...p }));
}
