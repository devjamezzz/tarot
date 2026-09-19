"use client";

import { useRouter } from "next/navigation";
import { PenLine } from "lucide-react";
import { ThaiNameInput, useThaiNameInput } from "@/components/name-numerology/ThaiNameInput";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ReadingType } from "@/lib/reading/types";
import { FormGroup } from "./FormGroup";
import { VerticalFormShell } from "./VerticalFormShell";

export const NAME_NUMEROLOGY_LABEL = "เลขศาสตร์ชื่อ";
export const NAME_NUMEROLOGY_FORM_HREF = "/name-numerology";

export function nameNumerologyResultHref(firstName: string, lastName: string): string {
  const params = new URLSearchParams({ firstName, lastName });
  return `/name-numerology/result?${params.toString()}`;
}

const ABOUT_POINTS = [
  "บุคลิกภาพและลักษณะนิสัย",
  "จุดแข็งและจุดที่ควรพัฒนา",
  "เส้นทางชีวิตและโอกาส",
  "แนวทางการงานที่เหมาะสม",
  "ความสัมพันธ์กับผู้อื่น",
];

/**
 * /name-numerology — Thai first/last name → deterministic name-number reading.
 * Requirements: 6.1, 6.6, 6.7, 9.6
 */
export function NameNumerologyForm() {
  const router = useRouter();
  const nameInput = useThaiNameInput();

  return (
    <VerticalFormShell
      label={NAME_NUMEROLOGY_LABEL}
      title="วิเคราะห์ชื่อด้วยเลขศาสตร์"
      caption="ค้นพบความหมายและพลังของชื่อคุณผ่านเลขศาสตร์ไทย"
      backHref="/"
      privacy={{ featureType: ReadingType.NAME_NUMEROLOGY, featureName: "เลขศาสตร์ชื่อ" }}
      submitLabel="ดูผลการวิเคราะห์"
      submitDisabled={nameInput.showValidation && !nameInput.isValid}
      onSubmit={() => {
        if (nameInput.validate()) {
          router.push(nameNumerologyResultHref(nameInput.firstName.trim(), nameInput.lastName.trim()));
        }
      }}
      secondary={
        <Button type="button" variant="ghost" size="lg" onClick={nameInput.reset} className="shrink-0 px-4">
          ล้างข้อมูล
        </Button>
      }
    >
      <FormGroup icon={PenLine} title="ชื่อ-นามสกุลของคุณ" hint="พิมพ์เป็นภาษาไทย ระบบจะแปลงตัวอักษรเป็นตัวเลขตามตำรา">
        <ThaiNameInput
          firstName={nameInput.firstName}
          lastName={nameInput.lastName}
          onFirstNameChange={nameInput.setFirstName}
          onLastNameChange={nameInput.setLastName}
          showValidation={nameInput.showValidation}
        />
      </FormGroup>

      <Card variant="sunk" className="space-y-2 text-[13px] leading-relaxed text-fg-muted">
        <p className="font-medium text-fg">เกี่ยวกับการวิเคราะห์ชื่อ</p>
        <p>
          เลขศาสตร์ชื่อเป็นศาสตร์โบราณที่แปลงตัวอักษรในชื่อเป็นตัวเลข แล้วอ่านความหมายจากผลรวม
          ผลที่ได้จะบอกถึง
        </p>
        <ul className="ml-4 list-disc space-y-0.5">
          {ABOUT_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </Card>
    </VerticalFormShell>
  );
}
