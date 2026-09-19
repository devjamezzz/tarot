import { useMemo, useSyncExternalStore } from "react";

/** localStorage key — one wallpaper per calendar day. Keep the name stable. */
export const STORAGE_KEY = "reffortune_wallpaper_daily";
const CHANGE_EVENT = "reffortune:wallpaper-daily";

export interface SavedWallpaper {
  date: string;
  imageUrl: string;
  tarotCardName?: string;
  tarotAdvice?: string;
  topic?: string;
  luckyNumber?: number;
  selectedColorNames?: string[];
}

export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getServerSnapshot = () => null;

function parseSaved(raw: string | null): SavedWallpaper | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedWallpaper;
    return parsed && parsed.date === getTodayKey() && parsed.imageUrl ? parsed : null;
  } catch {
    return null;
  }
}

/** Today's saved wallpaper, `null` on the server and when none was made today. */
export function useTodayWallpaper(): SavedWallpaper | null {
  const raw = useSyncExternalStore(subscribe, readRaw, getServerSnapshot);
  return useMemo(() => parseSaved(raw), [raw]);
}

/** Returns false when storage is unavailable or full (large data URLs). */
export function saveTodayWallpaper(data: SavedWallpaper): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function timeUntilTomorrow(): string {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} ชม. ${minutes} นาที`;
}
