/**
 * Thai date formatting — Buddhist year (CE + 543) and Thai short month names,
 * e.g. `19 ก.ย. 2569`.
 *
 * Dates are rendered in Asia/Bangkok (fixed UTC+7, no DST) so server and
 * client produce identical strings and the output does not depend on ICU.
 */

export const BUDDHIST_YEAR_OFFSET = 543;

export const THAI_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
] as const;

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

export type ThaiDateOptions = {
  /** Append `HH:MM น.` after the date. */
  withTime?: boolean;
};

export function toBuddhistYear(ceYear: number): number {
  return ceYear + BUDDHIST_YEAR_OFFSET;
}

export function toChristianYear(beYear: number): number {
  return beYear - BUDDHIST_YEAR_OFFSET;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Format a date as `19 ก.ย. 2569` (or `19 ก.ย. 2569 14:05 น.` with time).
 * Returns an empty string for invalid input.
 */
export function formatThaiDate(
  input: Date | string | number,
  options: ThaiDateOptions = {}
): string {
  const ms = input instanceof Date ? input.getTime() : new Date(input).getTime();
  if (!Number.isFinite(ms)) return "";

  const bangkok = new Date(ms + BANGKOK_OFFSET_MS);
  const day = bangkok.getUTCDate();
  const month = THAI_MONTHS_SHORT[bangkok.getUTCMonth()];
  const year = toBuddhistYear(bangkok.getUTCFullYear());
  const date = `${day} ${month} ${year}`;

  if (!options.withTime) return date;

  return `${date} ${pad2(bangkok.getUTCHours())}:${pad2(bangkok.getUTCMinutes())} น.`;
}
