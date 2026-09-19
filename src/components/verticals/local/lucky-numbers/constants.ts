import type { LuckyDigitCount } from "@/lib/lucky-numbers/engine";

export type Stage = "choose-count" | "picking" | "result";

export const PICK_CHOICES: LuckyDigitCount[] = [2, 3, 4];

/** "วิธีเล่น" steps shown under the count chooser. */
export const HOW_TO_PLAY_STEPS: ReadonlyArray<string> = [
  "เลือกจำนวนหลักที่ต้องการ 2, 3 หรือ 4 หลัก",
  "ตั้งจิตอธิษฐาน แล้วแตะหยิบไพ่จากครึ่งวงกลมทีละใบ ไพ่จะสับใหม่ทุกรอบ",
  "ครบจำนวนแล้วไพ่จะพลิกเปิดพร้อมกัน พร้อมคำอธิบายพลังของเลขแต่ละตัว",
];

/** Stagger between each card flip during the reveal animation (ms). */
export const REVEAL_STAGGER_MS = 850;
/** Pause after a pick before reshuffling the next round (ms). */
export const PICK_TRANSITION_MS = 750;

export const LUCKY_BACK_IMAGE = "/lucky-numbers/back.png";

export function luckyDigitImage(digit: number): string {
  return `/lucky-numbers/${digit}.png`;
}

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
