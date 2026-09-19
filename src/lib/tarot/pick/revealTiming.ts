/**
 * Timing for the เปิดไพ่ ritual: after "เปิดไพ่" the chosen cards turn over by
 * themselves, one after another, and the page hands off to the result once
 * the last flip has settled (brief §1.4: 3D flip 600ms ทีละใบ). Pure so it
 * can be unit-tested; PickClient owns the timers.
 */

/** One 3D flip (framer-motion `rotateY`). */
export const FLIP_DURATION_MS = 600;

/** Breath after the reveal row mounts before the first card turns. */
export const FIRST_FLIP_DELAY_MS = 600;

/** Hold on the fully revealed row before navigating to the result. */
export const AUTO_ADVANCE_MS = 600;

/** ≤ 5 cards: strictly one at a time, with a short pause between flips. */
const SEQUENTIAL_GAP_MS = 150;

/** Larger spreads (Celtic Cross) overlap flips so the ritual stays under ~5s. */
const DENSE_FROM = 6;
const DENSE_STAGGER_MS = 420;

/** Milliseconds after entering the reveal stage at which card `i` starts flipping. */
export function flipDelaysMs(count: number): number[] {
  const n = Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0;
  const stagger = n >= DENSE_FROM ? DENSE_STAGGER_MS : FLIP_DURATION_MS + SEQUENTIAL_GAP_MS;
  return Array.from({ length: n }, (_, i) => FIRST_FLIP_DELAY_MS + i * stagger);
}
