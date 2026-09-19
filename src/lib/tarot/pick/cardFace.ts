/**
 * Labels drawn onto the REF FORTUNE card face (see components/tarot/pick/
 * TarotCardFace.tsx). The Rider–Waite scans carry an English caption strip;
 * the face crops it away and paints Thai type instead, so nothing on the
 * card is English.
 */

import type { TarotCard } from "@/lib/tarot/types";

const THAI_DIGITS = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"] as const;

/** 10 → "๑๐". Negative / fractional input is truncated to its magnitude. */
export function toThaiNumeral(value: number): string {
  const n = Number.isFinite(value) ? Math.abs(Math.trunc(value)) : 0;
  return String(n)
    .split("")
    .map((digit) => THAI_DIGITS[Number(digit)] ?? "")
    .join("");
}

/**
 * Numeral for the medallion at the top of the face: majors 0–21 and pip
 * cards 1–10 in Thai digits; court cards (11–14) get no numeral and the
 * medallion shows a star instead.
 */
export function cardNumeralTh(card: Pick<TarotCard, "arcana" | "number">): string | null {
  if (card.arcana === "major") return toThaiNumeral(card.number);
  return card.number >= 1 && card.number <= 10 ? toThaiNumeral(card.number) : null;
}
