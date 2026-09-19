import type { TrustConfidence } from "@/components/reading/TrustPanel";
import type { BirthDateValue } from "@/components/ui/BirthDateField";
import { THAI_MONTHS } from "@/components/ui/BirthDateField";
import { THAI_MONTHS_SHORT, toBuddhistYear } from "@/lib/format/thaiDate";
import { ReadingDomain } from "@/lib/horoscope/specialized";
import { TimePeriod, ZodiacSign } from "@/lib/horoscope/types";
import type { ZodiacMetadata } from "@/lib/horoscope/zodiac";

/** Canonical generic error copy (IMPLEMENTATION.md §0). */
export const GENERIC_ERROR = "ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";

export const PERIOD_LABELS: Record<TimePeriod, string> = {
  [TimePeriod.DAILY]: "รายวัน",
  [TimePeriod.WEEKLY]: "รายสัปดาห์",
  [TimePeriod.MONTHLY]: "รายเดือน",
};

export const DOMAIN_LABELS: Record<ReadingDomain, string> = {
  [ReadingDomain.FINANCE_CAREER]: "การเงิน/การงาน",
  [ReadingDomain.LOVE_RELATIONSHIPS]: "ความรัก/ความสัมพันธ์",
};

/** Thai labels for the four Western elements used by the zodiac metadata. */
export const WESTERN_ELEMENT_LABELS: Record<ZodiacMetadata["element"], string> = {
  fire: "ไฟ",
  earth: "ดิน",
  air: "ลม",
  water: "น้ำ",
};

export function isTimePeriod(value: string | null | undefined): value is TimePeriod {
  return value === TimePeriod.DAILY || value === TimePeriod.WEEKLY || value === TimePeriod.MONTHLY;
}

export function isZodiacSign(value: string | null | undefined): value is ZodiacSign {
  return typeof value === "string" && (Object.values(ZodiacSign) as string[]).includes(value);
}

export function isReadingDomain(value: string | null | undefined): value is ReadingDomain {
  return value === ReadingDomain.FINANCE_CAREER || value === ReadingDomain.LOVE_RELATIONSHIPS;
}

/**
 * `19 ก.ย. 2569` in the browser's local time. The vertical engines build their
 * date ranges with local Date math, so formatting stays in the same zone.
 */
export function formatThaiDateLocal(date: Date): string {
  return `${date.getDate()} ${THAI_MONTHS_SHORT[date.getMonth()]} ${toBuddhistYear(date.getFullYear())}`;
}

/** `19 ก.ย. 2569` · `15–21 ก.ย. 2569` · `กันยายน 2569` depending on the period. */
export function formatPeriodRange(period: TimePeriod, start: Date, end: Date): string {
  if (period === TimePeriod.MONTHLY) {
    return `${THAI_MONTHS[start.getMonth()]} ${toBuddhistYear(start.getFullYear())}`;
  }
  if (period === TimePeriod.WEEKLY) {
    const sameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();
    if (sameDay) return formatThaiDateLocal(start);
    const sameMonth =
      start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (sameMonth) {
      return `${start.getDate()}–${end.getDate()} ${THAI_MONTHS_SHORT[start.getMonth()]} ${toBuddhistYear(start.getFullYear())}`;
    }
    return `${formatThaiDateLocal(start)} – ${formatThaiDateLocal(end)}`;
  }
  return formatThaiDateLocal(start);
}

/** `21 มี.ค. – 19 เม.ย.` for a zodiac sign's date window. */
export function zodiacRangeLabel(meta: ZodiacMetadata): string {
  const { start, end } = meta.dateRange;
  return `${start.day} ${THAI_MONTHS_SHORT[start.month - 1]} – ${end.day} ${THAI_MONTHS_SHORT[end.month - 1]}`;
}

/** Maps an engine 0–100 confidence to the three trust-panel levels. */
export function confidenceFromScore(score: number): TrustConfidence {
  if (score >= 80) return "สูง";
  if (score >= 50) return "ปานกลาง";
  return "ต่ำ";
}

/** Parses `YYYY-MM-DD` into a local-midnight Date; null when malformed or not a real date. */
export function parseIsoDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const real =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return real ? date : null;
}

/** `YYYY-MM-DD` from a BirthDateField value (CE year). */
export function toIsoDate(value: BirthDateValue): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${value.year}-${pad(value.month)}-${pad(value.day)}`;
}

export function birthDateToDate(value: BirthDateValue): Date {
  return new Date(value.year, value.month - 1, value.day);
}
