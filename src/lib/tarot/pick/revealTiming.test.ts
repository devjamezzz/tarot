import { describe, expect, it } from "vitest";
import {
  AUTO_ADVANCE_MS,
  FIRST_FLIP_DELAY_MS,
  FLIP_DURATION_MS,
  flipDelaysMs,
} from "./revealTiming";

describe("flipDelaysMs", () => {
  it("returns one delay per card, starting after the initial breath", () => {
    const delays = flipDelaysMs(3);
    expect(delays).toHaveLength(3);
    expect(delays[0]).toBe(FIRST_FLIP_DELAY_MS);
  });

  it("flips small spreads strictly one at a time", () => {
    const [first, second, third] = flipDelaysMs(3);
    expect(second - first).toBeGreaterThanOrEqual(FLIP_DURATION_MS);
    expect(third - second).toBeGreaterThanOrEqual(FLIP_DURATION_MS);
  });

  it("keeps the Celtic Cross ritual under six seconds", () => {
    const delays = flipDelaysMs(10);
    const total = delays[delays.length - 1] + FLIP_DURATION_MS + AUTO_ADVANCE_MS;
    expect(delays).toHaveLength(10);
    expect(total).toBeLessThan(6000);
  });

  it("is monotonic", () => {
    for (const count of [1, 2, 4, 5, 10]) {
      const delays = flipDelaysMs(count);
      for (let i = 1; i < delays.length; i += 1) {
        expect(delays[i]).toBeGreaterThan(delays[i - 1]);
      }
    }
  });

  it("tolerates bad counts", () => {
    expect(flipDelaysMs(0)).toEqual([]);
    expect(flipDelaysMs(-2)).toEqual([]);
    expect(flipDelaysMs(Number.NaN)).toEqual([]);
    expect(flipDelaysMs(2.9)).toHaveLength(2);
  });
});
