import { useSyncExternalStore } from "react";
import { TAROT_DECK } from "@/lib/tarot/deck";
import type { DrawnCard, Orientation } from "@/lib/tarot/types";

/** Existing key + shape ({ date, cardId, orientation }) — never change. */
export const DAILY_CARD_KEY = "reffortune_daily_card";
/** Sibling key: JSON array of 'YYYY-MM-DD' day keys on which a card was opened. */
export const DAILY_HISTORY_KEY = "reffortune_daily_card_history";
const HISTORY_LIMIT = 60;

export interface StoredDailyCard {
  date: string;
  cardId: string;
  orientation: Orientation;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Local-time day key (matches the legacy getTodayKey behaviour). */
export function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getTodayKey(): string {
  return toDayKey(new Date());
}

/** Parse a 'YYYY-MM-DD' key back into a local Date at noon (DST-safe). */
export function dayKeyToDate(dayKey: string): Date {
  const [year, month, day] = dayKey.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1, 12, 0, 0, 0);
}

export function msUntilNextMidnight(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return Math.max(0, next.getTime() - now.getTime());
}

// ---------------------------------------------------------------------------
// localStorage access (never throws: private mode / quota / SSR)
// ---------------------------------------------------------------------------

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable — the page still works for this session
  }
}

function safeRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Subscription (same-tab writes + cross-tab storage events)
// ---------------------------------------------------------------------------

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeDailyCard(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === DAILY_CARD_KEY || event.key === DAILY_HISTORY_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// ---------------------------------------------------------------------------
// Today's card (cached so useSyncExternalStore gets a stable reference)
// ---------------------------------------------------------------------------

let cardCacheKey: string | undefined;
let cardCacheValue: StoredDailyCard | null = null;

function parseStoredCard(raw: string | null, today: string): StoredDailyCard | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const { date, cardId, orientation } = parsed as Record<string, unknown>;
    if (date !== today || typeof cardId !== "string") return null;
    return { date: today, cardId, orientation: orientation === "reversed" ? "reversed" : "upright" };
  } catch {
    return null;
  }
}

function readStoredCard(): StoredDailyCard | null {
  const today = getTodayKey();
  const raw = safeGet(DAILY_CARD_KEY);
  const key = `${today}|${raw ?? ""}`;
  if (key !== cardCacheKey) {
    cardCacheKey = key;
    cardCacheValue = parseStoredCard(raw, today);
  }
  return cardCacheValue;
}

function getNullSnapshot(): null {
  return null;
}

/** Today's opened card from localStorage, or null (also null during SSR/hydration). */
export function useStoredDailyCard(): StoredDailyCard | null {
  return useSyncExternalStore(subscribeDailyCard, readStoredCard, getNullSnapshot);
}

// ---------------------------------------------------------------------------
// 7-day history
// ---------------------------------------------------------------------------

const EMPTY_HISTORY: string[] = [];
let historyCacheRaw: string | null | undefined;
let historyCacheValue: string[] = EMPTY_HISTORY;

function parseHistory(raw: string | null): string[] {
  if (!raw) return EMPTY_HISTORY;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : EMPTY_HISTORY;
  } catch {
    return EMPTY_HISTORY;
  }
}

function readHistory(): string[] {
  const raw = safeGet(DAILY_HISTORY_KEY);
  if (raw !== historyCacheRaw) {
    historyCacheRaw = raw;
    historyCacheValue = parseHistory(raw);
  }
  return historyCacheValue;
}

function getEmptyHistory(): string[] {
  return EMPTY_HISTORY;
}

/** Day keys on which a card was opened (most recent last). */
export function useDailyHistory(): string[] {
  return useSyncExternalStore(subscribeDailyCard, readHistory, getEmptyHistory);
}

function appendHistory(dayKey: string): void {
  const current = readHistory();
  if (current.includes(dayKey)) return;
  safeSet(DAILY_HISTORY_KEY, JSON.stringify([...current, dayKey].slice(-HISTORY_LIMIT)));
}

// ---------------------------------------------------------------------------
// Draw + writes
// ---------------------------------------------------------------------------

let pendingDraw: DrawnCard | null = null;

export function drawOneCard(): DrawnCard {
  const card = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)] ?? TAROT_DECK[0];
  // The daily draw never uses reversed cards.
  return { card, orientation: "upright" };
}

/** The not-yet-opened card for this page load; stable across re-renders. */
export function getPendingDraw(): DrawnCard {
  if (!pendingDraw) pendingDraw = drawOneCard();
  return pendingDraw;
}

export function toDrawnCard(stored: StoredDailyCard): DrawnCard | null {
  const card = TAROT_DECK.find((item) => item.id === stored.cardId);
  return card ? { card, orientation: stored.orientation } : null;
}

/** Persist today's card (existing key/shape) and mark today in the history. */
export function saveTodayCard(drawn: DrawnCard): void {
  const date = getTodayKey();
  safeSet(DAILY_CARD_KEY, JSON.stringify({ date, cardId: drawn.card.id, orientation: drawn.orientation }));
  appendHistory(date);
  // The stored card is now the source of truth; a fresh draw happens tomorrow.
  pendingDraw = null;
  emit();
}

/** Admin-only: forget today's card so a fresh one can be drawn. */
export function clearTodayCard(): void {
  safeRemove(DAILY_CARD_KEY);
  pendingDraw = null;
  emit();
}

// ---------------------------------------------------------------------------
// Hydration flag + ticking clock (no setState-in-effect needed)
// ---------------------------------------------------------------------------

function subscribeNoop(): () => void {
  return () => {};
}
function getTrue(): boolean {
  return true;
}
function getFalse(): boolean {
  return false;
}

/** false on the server and during hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNoop, getTrue, getFalse);
}

let lastDayKey = "";

function subscribeClock(listener: () => void): () => void {
  const id = window.setInterval(() => {
    listener();
    // Crossing local midnight invalidates today's card: wake the card subscribers too.
    const today = getTodayKey();
    if (lastDayKey && today !== lastDayKey) emit();
    lastDayKey = today;
  }, 1000);
  return () => window.clearInterval(id);
}
function getNowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}
function getZero(): number {
  return 0;
}

/** Current unix time in seconds, ticking once per second; 0 during SSR/hydration. */
export function useClockSeconds(): number {
  return useSyncExternalStore(subscribeClock, getNowSeconds, getZero);
}
