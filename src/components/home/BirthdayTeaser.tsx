"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { BirthDateField, type BirthDateValue } from "@/components/ui/BirthDateField";
import { TrustPanel } from "@/components/reading/TrustPanel";
import { getBaselineChineseZodiacReading } from "@/lib/chinese-zodiac/baseline";
import { getAnimalMetadata, getElementMetadata } from "@/lib/chinese-zodiac/animals";
import { TimePeriod } from "@/lib/horoscope/types";
import { cn } from "@/lib/cn";

interface Teaser {
  animalName: string;
  elementName: string;
  traits: string[];
  luckyColors: string[];
  overall: string;
}

const MAX_TRAITS = 3;

function computeTeaser(birth: BirthDateValue): Teaser {
  const reading = getBaselineChineseZodiacReading({
    birthYear: birth.year,
    period: TimePeriod.DAILY,
    date: new Date(),
  });
  return {
    animalName: reading.thaiName,
    elementName: getElementMetadata(reading.element).thaiName,
    traits: getAnimalMetadata(reading.animal).traits.slice(0, MAX_TRAITS),
    luckyColors: reading.luckyColors,
    overall: reading.fortune.overall,
  };
}

export function BirthdayTeaser({ className }: { className?: string }) {
  const [birth, setBirth] = useState<BirthDateValue | null>(null);
  const [teaser, setTeaser] = useState<Teaser | null>(null);

  const handleChange = (value: BirthDateValue | null) => {
    setBirth(value);
    setTeaser(value ? computeTeaser(value) : null);
  };

  return (
    <section aria-labelledby="home-birthday-title" className={cn("animate-fade-up", className)}>
      <Card className="space-y-4">
        <div>
          <p className="eyebrow">ดูจากวันเกิด</p>
          <CardTitle id="home-birthday-title" className="mt-1">
            ใส่วันเกิด รู้ปีนักษัตรและธาตุประจำตัวทันที
          </CardTitle>
        </div>

        <BirthDateField id="home-birthdate" value={birth} onChange={handleChange} />

        {teaser ? (
          <div data-testid="home-birthday-result" className="space-y-4 border-t border-line-faint pt-4">
            <span className="inline-flex items-center gap-1 rounded-pill border border-gold bg-gold-soft px-3 py-1 text-xs font-bold text-gold">
              <Sparkles className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
              ตัวอย่างจากวันเกิดเท่านั้น
            </span>

            <div>
              <p className="font-display text-2xl font-semibold text-fg">
                {teaser.animalName} · ธาตุ{teaser.elementName}
              </p>
              <p className="mt-1 text-sm text-fg-muted">
                นิสัยเด่น: {teaser.traits.join(" · ")}
              </p>
              <p className="text-sm text-fg-muted">สีมงคล: {teaser.luckyColors.join(" · ")}</p>
            </div>

            <p className="line-clamp-3 text-sm leading-relaxed text-fg">{teaser.overall}</p>

            <Button asChild variant="gold" className="w-full">
              <Link href="/chinese-zodiac">ดูดวงราศีจีนฉบับเต็ม</Link>
            </Button>

            <TrustPanel
              computedFrom="ปีเกิด ค.ศ. เทียบตำรานักษัตรจีน 12 ปีและธาตุประจำปี (ยังไม่ปรับตามวันตรุษจีน)"
              confidence="ปานกลาง"
            />
          </div>
        ) : (
          <p className="text-[13px] text-fg-muted">
            ใส่วันเกิดครบสามช่อง ระบบจะบอกปีนักษัตร ธาตุ และแนวโน้มวันนี้ให้ทันที ไม่ต้องสมัครสมาชิก
          </p>
        )}
      </Card>
    </section>
  );
}
