/**
 * Thai labels for library / saved-reading views. Single source so the list,
 * the detail page and the vertical pages print the same words.
 */
import { getAllZodiacSigns } from "@/lib/horoscope/zodiac";
import { ANIMAL_METADATA, ELEMENT_METADATA } from "@/lib/chinese-zodiac/animals";
import type { ChineseElement, ChineseZodiacAnimal } from "@/lib/chinese-zodiac/types";
import { ReadingType } from "@/lib/reading/types";
import type { Orientation, Suit, TarotCard } from "@/lib/tarot/types";

export const PERIOD_TH: Record<string, string> = {
  daily: "รายวัน",
  weekly: "รายสัปดาห์",
  monthly: "รายเดือน",
  yearly: "รายปี",
};

export const DOMAIN_TH: Record<string, string> = {
  finance_career: "การเงิน/การงาน",
  love_relationships: "ความรัก/ความสัมพันธ์",
};

export const SUIT_TH: Record<Suit, string> = {
  wands: "ไม้เท้า",
  cups: "ถ้วย",
  swords: "ดาบ",
  pentacles: "เหรียญ",
};

export const ORIENTATION_TH: Record<Orientation, string> = {
  upright: "ตั้งตรง",
  reversed: "กลับหัว",
};

export const READING_TYPE_TH: Record<ReadingType, string> = {
  [ReadingType.TAROT]: "ทาโรต์",
  [ReadingType.SPIRIT_CARD]: "ไพ่จิตวิญญาณ",
  [ReadingType.NUMEROLOGY]: "เลขศาสตร์",
  [ReadingType.DAILY_CARD]: "ไพ่ประจำวัน",
  [ReadingType.HOROSCOPE]: "ดวงชะตา",
  [ReadingType.COMPATIBILITY]: "ความเข้ากัน",
  [ReadingType.CHINESE_ZODIAC]: "ราศีจีน",
  [ReadingType.SPECIALIZED]: "เฉพาะทาง",
  [ReadingType.NAME_NUMEROLOGY]: "เลขศาสตร์ชื่อ",
};

const ZODIAC_TH: Record<string, string> = Object.fromEntries(
  getAllZodiacSigns().map((meta) => [meta.sign, meta.thaiName])
);

export function zodiacTh(sign: string): string {
  return ZODIAC_TH[sign] ?? sign;
}

export function periodTh(period: string): string {
  return PERIOD_TH[period] ?? period;
}

/** "ปีมะโรง" — already carries the ปี prefix. */
export function animalTh(animal: string): string {
  return ANIMAL_METADATA[animal as ChineseZodiacAnimal]?.thaiName ?? animal;
}

export function elementTh(element: string): string {
  return ELEMENT_METADATA[element as ChineseElement]?.thaiName ?? element;
}

export function domainTh(domain: string): string {
  return DOMAIN_TH[domain] ?? domain;
}

export function orientationTh(orientation: Orientation): string {
  return ORIENTATION_TH[orientation];
}

export function readingTypeTh(type: ReadingType): string {
  return READING_TYPE_TH[type] ?? "ดูดวง";
}

export function cardNameTh(card: Pick<TarotCard, "name" | "nameTh">): string {
  return card.nameTh ?? card.name;
}

/** "ไพ่ชุดหลัก" or "ไพ่ชุดรอง · ถ้วย". */
export function arcanaLabelTh(card: Pick<TarotCard, "arcana" | "suit">): string {
  if (card.arcana === "major") return "ไพ่ชุดหลัก";
  return card.suit ? `ไพ่ชุดรอง · ${SUIT_TH[card.suit]}` : "ไพ่ชุดรอง";
}

/** Thai day/month/year for a CE date triple, e.g. `14/2/2537`. */
export function formatDateParts(day: number, month: number, year: number): string {
  return `${day}/${month}/${year + 543}`;
}
