/**
 * Seeded card draw for the เลือกไพ่ ritual.
 *
 * Same seed → same 30 cards in the same order, so a visit that navigates
 * pick → result → back sees the identical spread (product invariant:
 * deterministic per session). The seed itself lives in sessionStorage
 * (see ./seedStore.ts); this module is pure.
 */

import { TAROT_DECK } from "@/lib/tarot/deck";
import type { TarotCard } from "@/lib/tarot/types";

/** Cards laid out on the table — 5 columns × 6 rows on mobile. */
export const PICK_GRID_SIZE = 30;

/** mulberry32 — small, fast, good enough for a card draw. */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher–Yates on a copy; the input array is never mutated. */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const random = createSeededRandom(seed);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** The 30 face-down cards shown for a given seed, drawn from all 78. */
export function drawPickGrid(seed: number, size: number = PICK_GRID_SIZE): TarotCard[] {
  return seededShuffle(TAROT_DECK, seed).slice(0, Math.min(size, TAROT_DECK.length));
}

/** A fresh 32-bit seed. */
export function newPickSeed(): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0];
  }
  return Math.floor(Math.random() * 4294967296) >>> 0;
}
