/**
 * Per-visit seed for the เลือกไพ่ grid, persisted in sessionStorage so the
 * same 30 cards come back after pick → result → back. Shaped as an external
 * store so components read it with `useSyncExternalStore` (server snapshot
 * is `null`, which keeps SSR and hydration markup identical).
 */

import { newPickSeed } from "./seededShuffle";

export const PICK_SEED_STORAGE_KEY = "reffortune.tarot.pick.seed";

type Listener = () => void;

const listeners = new Set<Listener>();
let cached: number | null = null;

function readStored(): number | null {
  try {
    const raw = window.sessionStorage.getItem(PICK_SEED_STORAGE_KEY);
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isInteger(parsed) && parsed >= 0 && parsed <= 0xffffffff ? parsed : null;
  } catch {
    return null;
  }
}

function writeStored(seed: number): void {
  try {
    window.sessionStorage.setItem(PICK_SEED_STORAGE_KEY, String(seed));
  } catch {
    // Private mode / blocked storage: the in-memory seed still works for this visit.
  }
}

/** Client snapshot — lazily creates and persists a seed on first read. */
export function getPickSeed(): number {
  if (cached !== null) return cached;
  const stored = readStored();
  cached = stored ?? newPickSeed();
  if (stored === null) writeStored(cached);
  return cached;
}

/** Server snapshot — no storage on the server. */
export function getPickSeedServerSnapshot(): number | null {
  return null;
}

/** 'สับใหม่': mint a new seed, persist it, notify subscribers. */
export function reseedPick(): number {
  cached = newPickSeed();
  writeStored(cached);
  listeners.forEach((listener) => listener());
  return cached;
}

export function subscribePickSeed(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
