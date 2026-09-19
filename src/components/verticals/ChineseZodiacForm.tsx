"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Flame } from "lucide-react";
import { PeriodSelector } from "@/components/horoscope/PeriodSelector";
import { Card } from "@/components/ui/Card";
import {
  calculateChineseElement,
  calculateChineseZodiac,
  getAnimalMetadata,
  getElementMetadata,
} from "@/lib/chinese-zodiac/animals";
import { toBuddhistYear } from "@/lib/format/thaiDate";
import { TimePeriod } from "@/lib/horoscope/types";
import { ReadingType } from "@/lib/reading/types";
import { BirthYearField } from "./BirthYearField";
import { FormGroup } from "./FormGroup";
import { VerticalFormShell } from "./VerticalFormShell";

export const CHINESE_ZODIAC_LABEL = "ดูดวงจีน";
export const CHINESE_ZODIAC_FORM_HREF = "/chinese-zodiac";

export function chineseZodiacResultHref(year: number, period: TimePeriod): string {
  const params = new URLSearchParams({ year: String(year), period });
  return `/chinese-zodiac/result?${params.toString()}`;
}

/** `ปีมะโรง · ธาตุดิน` preview for a CE birth year. */
function describeYear(year: number): string {
  const animal = getAnimalMetadata(calculateChineseZodiac(year));
  const element = getElementMetadata(calculateChineseElement(year));
  return `${animal.thaiName} · ธาตุ${element.thaiName} · พ.ศ. ${toBuddhistYear(year)}`;
}

/** /chinese-zodiac — birth year (พ.ศ. by default) + period → 12-animal reading. */
export function ChineseZodiacForm() {
  const router = useRouter();
  const [year, setYear] = useState<number | null>(null);
  const [period, setPeriod] = useState<TimePeriod>(TimePeriod.DAILY);

  return (
    <VerticalFormShell
      label={CHINESE_ZODIAC_LABEL}
      title="ดูดวงจีน 12 นักษัตร"
      caption="ใส่ปีเกิด ระบบจะหานักษัตรและธาตุประจำตัวให้"
      backHref="/"
      privacy={{ featureType: ReadingType.CHINESE_ZODIAC, featureName: "ดูดวงจีน" }}
      submitLabel="ดูดวงจีน"
      submitDisabled={year === null}
      onSubmit={() => {
        if (year !== null) router.push(chineseZodiacResultHref(year, period));
      }}
    >
      <FormGroup icon={Flame} title="ปีเกิดของคุณ" hint="นักษัตรและธาตุคำนวณจากปีเกิดโดยอัตโนมัติ">
        <BirthYearField id="birth-year" value={year} onChange={setYear} />
        <p className="min-h-5 text-[13px] text-gold" aria-live="polite" data-testid="zodiac-preview">
          {year !== null ? describeYear(year) : ""}
        </p>
      </FormGroup>

      <FormGroup icon={CalendarDays} title="ช่วงเวลาที่ต้องการดู">
        <PeriodSelector value={period} onChange={setPeriod} />
      </FormGroup>

      <Card variant="sunk" className="text-[13px] leading-relaxed text-fg-muted">
        ดวงจีน 12 นักษัตรใช้ปีเกิดในการคำนวณ แต่ละนักษัตรมีธาตุประจำตัว (ไม้ ไฟ ดิน โลหะ น้ำ)
        ที่ส่งผลต่อโชคชะตาและบุคลิกภาพ
      </Card>
    </VerticalFormShell>
  );
}
