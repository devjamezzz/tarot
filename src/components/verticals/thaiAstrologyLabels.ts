import type { BirthDateValue } from "@/components/ui/BirthDateField";
import { getThaiDay, getThaiYearAnimal } from "@/lib/thai-astrology/engine";
import {
  THAI_DAY_MEANINGS,
  THAI_YEAR_ANIMAL_MEANINGS,
  ThaiElement,
} from "@/lib/thai-astrology/types";
import { birthDateToDate } from "./readingMeta";

/** Thai names of the five ธาตุ used by the Thai-astrology compatibility engine. */
export const THAI_ELEMENT_LABELS: Record<ThaiElement, string> = {
  [ThaiElement.WOOD]: "ไม้",
  [ThaiElement.FIRE]: "ไฟ",
  [ThaiElement.EARTH]: "ดิน",
  [ThaiElement.METAL]: "ทอง",
  [ThaiElement.WATER]: "น้ำ",
};

/** `วันพุธ · ปีมะโรง (มังกร) · ธาตุดิน` for a chosen birth date. */
export function describeBirthDate(value: BirthDateValue): string {
  const date = birthDateToDate(value);
  const day = THAI_DAY_MEANINGS[getThaiDay(date)].name;
  const animal = THAI_YEAR_ANIMAL_MEANINGS[getThaiYearAnimal(date)];
  return `${day} · ปี${animal.name} (${animal.animal}) · ธาตุ${THAI_ELEMENT_LABELS[animal.element]}`;
}

export function compatibilityLabel(score: number): string {
  if (score >= 80) return "เข้ากันดีมาก";
  if (score >= 60) return "เข้ากันดี";
  if (score >= 40) return "เข้ากันปานกลาง";
  return "ต้องปรับตัวเข้าหากัน";
}
