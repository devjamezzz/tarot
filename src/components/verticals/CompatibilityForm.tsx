"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Users } from "lucide-react";
import { BirthDateField, type BirthDateValue } from "@/components/ui/BirthDateField";
import { Card } from "@/components/ui/Card";
import { ReadingType } from "@/lib/reading/types";
import { FormGroup } from "./FormGroup";
import { toIsoDate } from "./readingMeta";
import { describeBirthDate } from "./thaiAstrologyLabels";
import { VerticalFormShell } from "./VerticalFormShell";

export const COMPATIBILITY_LABEL = "ดูดวงความรัก";
export const COMPATIBILITY_FORM_HREF = "/compatibility";

export function compatibilityResultHref(date1: string, date2: string): string {
  const params = new URLSearchParams({ date1, date2 });
  return `/compatibility/result?${params.toString()}`;
}

function BirthPreview({ value }: { value: BirthDateValue | null }) {
  return (
    <p className="min-h-5 text-[13px] text-gold" aria-live="polite">
      {value ? describeBirthDate(value) : ""}
    </p>
  );
}

/** /compatibility — two birth dates (พ.ศ. by default) → Thai-astrology match. */
export function CompatibilityForm() {
  const router = useRouter();
  const [person1, setPerson1] = useState<BirthDateValue | null>(null);
  const [person2, setPerson2] = useState<BirthDateValue | null>(null);
  const ready = person1 !== null && person2 !== null;

  return (
    <VerticalFormShell
      label={COMPATIBILITY_LABEL}
      title="ดูดวงความเข้ากัน"
      caption="โหราศาสตร์ไทย · วันเกิด นักษัตร และธาตุของทั้งสองคน"
      backHref="/"
      privacy={{ featureType: ReadingType.COMPATIBILITY, featureName: "ดูดวงความรัก" }}
      submitLabel="วิเคราะห์ความเข้ากัน"
      submitDisabled={!ready}
      onSubmit={() => {
        if (person1 && person2) {
          router.push(compatibilityResultHref(toIsoDate(person1), toIsoDate(person2)));
        }
      }}
    >
      <FormGroup
        icon={Users}
        title="วันเกิดของทั้งสองคน"
        hint="ใส่ปีเป็น พ.ศ. ได้เลย หรือสลับเป็น ค.ศ. ตามสะดวก"
      >
        <BirthDateField
          id="person1"
          label="คนที่ 1"
          value={person1}
          onChange={setPerson1}
          required
        />
        <BirthPreview value={person1} />

        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-line-faint" />
          <Heart className="h-5 w-5 text-gold" strokeWidth={1.5} />
          <span className="h-px flex-1 bg-line-faint" />
        </div>

        <BirthDateField
          id="person2"
          label="คนที่ 2"
          value={person2}
          onChange={setPerson2}
          required
        />
        <BirthPreview value={person2} />
      </FormGroup>

      <Card variant="sunk" className="text-[13px] leading-relaxed text-fg-muted">
        การวิเคราะห์ดูจาก<span className="text-fg">วันเกิด</span> <span className="text-fg">นักษัตรปีเกิด</span> และ
        <span className="text-fg">ธาตุประจำตัว</span> ตามตำราโหราศาสตร์ไทย เพื่อให้คำแนะนำที่เหมาะกับความสัมพันธ์ของคุณ
      </Card>
    </VerticalFormShell>
  );
}
