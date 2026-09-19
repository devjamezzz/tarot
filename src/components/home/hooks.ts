"use client";

import { useSyncExternalStore } from "react";

/**
 * Opened day keys ('YYYY-MM-DD', local time) written by the daily-card page.
 * The home page only READS this key — /daily-card owns the writes.
 */
export const DAILY_CARD_HISTORY_KEY = "reffortune_daily_card_history";

const DAY_MS = 86_400_000;
const WEEK_LENGTH = 7;

function noopSubscribe() {
  return () => {};
}

function subscribeStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Local-time day key, same shape /daily-card stores. */
export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function readDailySnapshot(): string {
  let raw = "";
  try {
    raw = window.localStorage.getItem(DAILY_CARD_HISTORY_KEY) ?? "";
  } catch {
    raw = "";
  }
  // One string so the snapshot stays referentially stable per day + value.
  return `${toDayKey(new Date())}|${raw}`;
}

function parseOpenedDays(raw: string): Set<string> {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return new Set();
  }
}

export interface DailyCardWeek {
  days: { key: string; opened: boolean; isToday: boolean }[];
  openedCount: number;
}

/**
 * The last 7 days (oldest → today) with whether the daily card was opened.
 * Returns null on the server and before hydration.
 */
export function useDailyCardWeek(): DailyCardWeek | null {
  const snapshot = useSyncExternalStore(subscribeStorage, readDailySnapshot, () => null);
  if (snapshot === null) return null;

  const separator = snapshot.indexOf("|");
  const todayKey = snapshot.slice(0, separator);
  const opened = parseOpenedDays(snapshot.slice(separator + 1));

  const [y, m, d] = todayKey.split("-").map(Number);
  const days = Array.from({ length: WEEK_LENGTH }, (_, i) => {
    const offset = WEEK_LENGTH - 1 - i;
    const date = new Date(Date.UTC(y, m - 1, d - offset));
    const key = `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
    return { key, opened: opened.has(key), isToday: offset === 0 };
  });

  return { days, openedCount: days.filter((day) => day.opened).length };
}

function readDayIndex(): number {
  return Math.floor(Date.now() / DAY_MS);
}

/** Whole days since the Unix epoch — null on the server and before hydration. */
export function useDayIndex(): number | null {
  return useSyncExternalStore(noopSubscribe, readDayIndex, () => null);
}
