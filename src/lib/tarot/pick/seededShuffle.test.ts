import { describe, it, expect } from "vitest";
import { TAROT_DECK } from "@/lib/tarot/deck";
import {
  PICK_GRID_SIZE,
  createSeededRandom,
  drawPickGrid,
  newPickSeed,
  seededShuffle,
} from "./seededShuffle";

describe("seededShuffle", () => {
  it("is deterministic for the same seed", () => {
    const a = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 42);
    const b = seededShuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 42);
    expect(a).toEqual(b);
  });

  it("changes order for a different seed and keeps every item", () => {
    const items = Array.from({ length: 20 }, (_, i) => i);
    const a = seededShuffle(items, 1);
    const b = seededShuffle(items, 2);
    expect(a).not.toEqual(b);
    expect([...a].sort((x, y) => x - y)).toEqual(items);
  });

  it("does not mutate the input", () => {
    const items = [1, 2, 3, 4];
    seededShuffle(items, 7);
    expect(items).toEqual([1, 2, 3, 4]);
  });

  it("random values stay in [0, 1)", () => {
    const random = createSeededRandom(123);
    for (let i = 0; i < 1000; i += 1) {
      const v = random();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("drawPickGrid", () => {
  it("draws 30 unique cards from the 78-card deck", () => {
    const grid = drawPickGrid(99);
    expect(grid).toHaveLength(PICK_GRID_SIZE);
    expect(new Set(grid.map((c) => c.id)).size).toBe(PICK_GRID_SIZE);
    for (const card of grid) {
      expect(TAROT_DECK.some((d) => d.id === card.id)).toBe(true);
      expect(card.nameTh).toBeTruthy();
    }
  });

  it("is stable per seed", () => {
    expect(drawPickGrid(2024).map((c) => c.id)).toEqual(drawPickGrid(2024).map((c) => c.id));
  });

  it("newPickSeed returns a 32-bit unsigned integer", () => {
    const seed = newPickSeed();
    expect(Number.isInteger(seed)).toBe(true);
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThanOrEqual(0xffffffff);
  });
});
