"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChartBar,
  Gem,
  Heart,
  Lightbulb,
  Sparkles,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";
import { ReadingResultShell } from "@/components/reading/ReadingResultShell";
import { Card } from "@/components/ui/Card";
import { SITE_URL } from "@/lib/site";
import { calculateThaiCompatibility } from "@/lib/thai-astrology/engine";
import {
  THAI_DAY_MEANINGS,
  THAI_YEAR_ANIMAL_MEANINGS,
  type ThaiCompatibilityInput,
  type ThaiCompatibilityReading,
} from "@/lib/thai-astrology/types";
import {
  COMPATIBILITY_FORM_HREF,
  COMPATIBILITY_LABEL,
  compatibilityResultHref,
} from "./CompatibilityForm";
import { ReadingList, ReadingSection } from "./ReadingSection";
import { ResultActions } from "./ResultActions";
import { ResultError, ResultLoading } from "./ResultStates";
import { useEngineReading } from "./useEngineReading";
import { parseIsoDate } from "./readingMeta";
import { THAI_ELEMENT_LABELS, compatibilityLabel } from "./thaiAstrologyLabels";

const TITLE = "ผลความเข้ากันของคุณ";

async function runCompatibility(input: ThaiCompatibilityInput): Promise<ThaiCompatibilityReading> {
  return calculateThaiCompatibility(input);
}

function Person({ label, person }: { label: string; person: ThaiCompatibilityReading["person1"] }) {
  const animal = THAI_YEAR_ANIMAL_MEANINGS[person.yearAnimal];
  return (
    <div className="min-w-0">
      <p className="text-[13px] text-fg-muted">{label}</p>
      <p className="font-display text-lg font-semibold text-fg">{THAI_DAY_MEANINGS[person.day].name}</p>
      <p className="text-[13px] text-fg-muted">
        ปี{animal.name} ({animal.animal})
      </p>
    </div>
  );
}

function ScoreMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="font-bold tabular-nums text-gold">{value}%</span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-sunk"
      >
        <div className="h-full rounded-pill bg-gold" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/** /compatibility/result?date1=YYYY-MM-DD&date2=YYYY-MM-DD */
export function CompatibilityResult() {
  const searchParams = useSearchParams();
  const date1 = searchParams.get("date1");
  const date2 = searchParams.get("date2");

  const params = useMemo<ThaiCompatibilityInput | null>(() => {
    const first = parseIsoDate(date1);
    const second = parseIsoDate(date2);
    return first && second ? { person1: { birthDate: first }, person2: { birthDate: second } } : null;
  }, [date1, date2]);
  const { status, reading, error } = useEngineReading(params, runCompatibility);

  if (status === "invalid") {
    return (
      <ResultError
        label={COMPATIBILITY_LABEL}
        title={TITLE}
        message="กรุณาระบุวันเกิดของทั้งสองคนก่อนวิเคราะห์"
        backHref={COMPATIBILITY_FORM_HREF}
        backLabel="กลับไปใส่วันเกิด"
      />
    );
  }
  if (status === "loading") {
    return <ResultLoading label={COMPATIBILITY_LABEL} title={TITLE} backHref={COMPATIBILITY_FORM_HREF} />;
  }
  if (status === "error" || !reading || !date1 || !date2) {
    return (
      <ResultError
        label={COMPATIBILITY_LABEL}
        title={TITLE}
        message={error}
        backHref={COMPATIBILITY_FORM_HREF}
        backLabel="ลองใหม่"
      />
    );
  }

  const score = reading.overallScore;
  const scoreLabel = compatibilityLabel(score);
  const element1 = THAI_ELEMENT_LABELS[reading.person1.element];
  const element2 = THAI_ELEMENT_LABELS[reading.person2.element];
  const day1 = THAI_DAY_MEANINGS[reading.person1.day].name;
  const day2 = THAI_DAY_MEANINGS[reading.person2.day].name;
  const lineText = [
    `ดูดวงความเข้ากัน ${day1} × ${day2} ได้ ${score}% (${scoreLabel}) จาก REFFORTUNE`,
    "อยากให้หมอดูช่วยขยายความเพิ่มเติม",
    `${SITE_URL}${compatibilityResultHref(date1, date2)}`,
  ].join("\n");

  return (
    <ReadingResultShell
      label={COMPATIBILITY_LABEL}
      title={TITLE}
      caption={`${day1} × ${day2} · ธาตุ${element1} + ธาตุ${element2}`}
      backHref={COMPATIBILITY_FORM_HREF}
      computed={
        <div className="space-y-3">
          <Card data-testid="result-hero" className="animate-fade-up motion-safe-fade">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <Person label="คนที่ 1" person={reading.person1} />
              <Heart className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <Person label="คนที่ 2" person={reading.person2} />
            </div>

            <div className="mt-5 text-center">
              <p
                data-testid="compat-score"
                className="font-display text-5xl font-semibold leading-none text-gold tabular-nums"
              >
                {score}
                <span className="text-2xl">%</span>
              </p>
              <p className="mt-2 text-base font-semibold text-fg">{scoreLabel}</p>
              <div
                role="meter"
                aria-label="คะแนนความเข้ากันโดยรวม"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={score}
                className="mx-auto mt-3 h-2 w-full max-w-xs overflow-hidden rounded-pill bg-sunk"
              >
                <div className="h-full rounded-pill bg-gold" style={{ width: `${score}%` }} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[13px]">
                <span className="rounded-pill border border-gold bg-gold-soft px-3 py-1 text-gold">ธาตุ{element1}</span>
                <span className="text-fg-muted" aria-hidden="true">×</span>
                <span className="rounded-pill border border-gold bg-gold-soft px-3 py-1 text-gold">ธาตุ{element2}</span>
              </div>
            </div>
          </Card>

          <p className="eyebrow pt-2">ความหมายตามตำรา</p>
          <ReadingSection icon={Sparkles} title="สรุปภาพรวม" index={0}>
            {reading.interpretation.summary}
          </ReadingSection>
          <ReadingSection icon={ChartBar} title="คะแนนรายด้าน" index={1}>
            <div className="space-y-3">
              <ScoreMeter label="ความเข้ากันของวันเกิด" value={reading.scores.dayCompatibility} />
              <ScoreMeter label="ความเข้ากันของนักษัตร" value={reading.scores.animalCompatibility} />
              <ScoreMeter label="ความเข้ากันของธาตุ" value={reading.scores.elementCompatibility} />
            </div>
          </ReadingSection>
          <ReadingSection icon={ThumbsUp} title="จุดแข็งของความสัมพันธ์" index={2}>
            <ReadingList items={reading.interpretation.strengths} marker="check" />
          </ReadingSection>
          <ReadingSection icon={TriangleAlert} title="ความท้าทาย" index={3}>
            <ReadingList items={reading.interpretation.challenges} marker="alert" />
          </ReadingSection>
          <ReadingSection icon={Lightbulb} title="คำแนะนำ" index={4}>
            {reading.interpretation.advice}
          </ReadingSection>
          <ReadingSection icon={Gem} title="เคล็ดลับเสริมดวง" index={5}>
            <ReadingList items={reading.interpretation.auspicious} />
          </ReadingSection>
        </div>
      }
      cta={
        <ResultActions
          lineText={lineText}
          links={[
            { href: COMPATIBILITY_FORM_HREF, label: "วิเคราะห์คู่อื่น" },
            { href: "/", label: "กลับหน้าหลัก" },
          ]}
        />
      }
      trust={{
        computedFrom: "วันเกิด นักษัตร และธาตุประจำตัวของทั้งสองคน ตามตำราโหราศาสตร์ไทย",
        confidence: "ปานกลาง",
        aiUsed: false,
      }}
    />
  );
}
