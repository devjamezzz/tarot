import { describe, expect, it } from "vitest";
import { getCardById } from "@/lib/tarot/deck";
import { cardNumeralTh, toThaiNumeral } from "./cardFace";

describe("toThaiNumeral", () => {
  it("converts every digit", () => {
    expect(toThaiNumeral(0)).toBe("๐");
    expect(toThaiNumeral(7)).toBe("๗");
    expect(toThaiNumeral(10)).toBe("๑๐");
    expect(toThaiNumeral(21)).toBe("๒๑");
    expect(toThaiNumeral(1234567890)).toBe("๑๒๓๔๕๖๗๘๙๐");
  });

  it("never emits Latin digits", () => {
    for (let n = 0; n <= 21; n += 1) {
      expect(toThaiNumeral(n)).not.toMatch(/[0-9]/);
    }
  });

  it("tolerates bad input", () => {
    expect(toThaiNumeral(-3)).toBe("๓");
    expect(toThaiNumeral(4.7)).toBe("๔");
    expect(toThaiNumeral(Number.NaN)).toBe("๐");
  });
});

describe("cardNumeralTh", () => {
  it("numbers the majors from ๐", () => {
    expect(cardNumeralTh({ arcana: "major", number: 0 })).toBe("๐");
    expect(cardNumeralTh({ arcana: "major", number: 9 })).toBe("๙");
    expect(cardNumeralTh({ arcana: "major", number: 21 })).toBe("๒๑");
  });

  it("numbers pip cards and leaves court cards blank", () => {
    expect(cardNumeralTh({ arcana: "minor", number: 1 })).toBe("๑");
    expect(cardNumeralTh({ arcana: "minor", number: 10 })).toBe("๑๐");
    expect(cardNumeralTh({ arcana: "minor", number: 11 })).toBeNull();
    expect(cardNumeralTh({ arcana: "minor", number: 14 })).toBeNull();
  });

  it("works against the real deck", () => {
    expect(cardNumeralTh(getCardById("maj07")!)).toBe("๗");
    expect(cardNumeralTh(getCardById("cup04")!)).toBe("๔");
  });
});
