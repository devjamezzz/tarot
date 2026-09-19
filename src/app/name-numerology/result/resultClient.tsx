"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  Compass,
  Heart,
  Lightbulb,
  Star,
  ThumbsUp,
  TriangleAlert,
  User,
} from "lucide-react";
import { ReadingResultShell } from "@/components/reading/ReadingResultShell";
import { Card } from "@/components/ui/Card";
import {
  NAME_NUMEROLOGY_FORM_HREF,
  NAME_NUMEROLOGY_LABEL,
  nameNumerologyResultHref,
} from "@/components/verticals/NameNumerologyForm";
import { ReadingList, ReadingSection } from "@/components/verticals/ReadingSection";
import { ResultActions } from "@/components/verticals/ResultActions";
import { ResultError, ResultLoading } from "@/components/verticals/ResultStates";
import { useEngineReading } from "@/components/verticals/useEngineReading";
import { getBaselineNameNumerology } from "@/lib/name-numerology/engine";
import type { NameNumerologyInput, NameNumerologyReading } from "@/lib/name-numerology/types";
import { SITE_URL } from "@/lib/site";

const TITLE = "ผลการวิเคราะห์ชื่อ";

async function runNameNumerology(input: NameNumerologyInput): Promise<NameNumerologyReading> {
  return getBaselineNameNumerology(input);
}

function ScoreTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-card border border-line-faint bg-sunk px-3 py-3 text-center">
      <p className="text-[13px] text-fg-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold leading-none text-gold tabular-nums">{value}</p>
    </div>
  );
}

/** /name-numerology/result?firstName=&lastName= */
export default function ResultClient() {
  const searchParams = useSearchParams();
  const firstName = (searchParams.get("firstName") ?? "").trim();
  const lastName = (searchParams.get("lastName") ?? "").trim();

  const params = useMemo<NameNumerologyInput | null>(
    () => (firstName && lastName ? { firstName, lastName } : null),
    [firstName, lastName]
  );
  const { status, reading, error } = useEngineReading(params, runNameNumerology);

  if (status === "invalid") {
    return (
      <ResultError
        label={NAME_NUMEROLOGY_LABEL}
        title={TITLE}
        message="กรุณากรอกชื่อและนามสกุลก่อนดูผล"
        backHref={NAME_NUMEROLOGY_FORM_HREF}
        backLabel="กลับไปกรอกชื่อ"
      />
    );
  }
  if (status === "loading") {
    return <ResultLoading label={NAME_NUMEROLOGY_LABEL} title={TITLE} backHref={NAME_NUMEROLOGY_FORM_HREF} />;
  }
  if (status === "error" || !reading) {
    return (
      <ResultError
        label={NAME_NUMEROLOGY_LABEL}
        title={TITLE}
        message={error}
        backHref={NAME_NUMEROLOGY_FORM_HREF}
        backLabel="กลับไปกรอกใหม่"
      />
    );
  }

  const fullName = `${reading.firstName} ${reading.lastName}`;
  const lineText = [
    `เลขศาสตร์ชื่อ "${fullName}" เลขชะตา ${reading.scores.destiny} จาก REFFORTUNE`,
    "อยากให้หมอดูช่วยขยายความเพิ่มเติม",
    `${SITE_URL}${nameNumerologyResultHref(reading.firstName, reading.lastName)}`,
  ].join("\n");

  return (
    <ReadingResultShell
      label={NAME_NUMEROLOGY_LABEL}
      title={TITLE}
      caption={`${fullName} · เลขชะตา ${reading.scores.destiny}`}
      backHref={NAME_NUMEROLOGY_FORM_HREF}
      computed={
        <div className="space-y-3">
          <Card data-testid="result-hero" className="animate-fade-up motion-safe-fade">
            <h2 className="text-center font-display text-[22px] font-semibold text-fg">{fullName}</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <ScoreTile label="เลขชื่อ" value={reading.scores.firstName} />
              <ScoreTile label="เลขนามสกุล" value={reading.scores.lastName} />
              <ScoreTile label="เลขชื่อเต็ม" value={reading.scores.fullName} />
              <ScoreTile label="เลขชะตา" value={reading.scores.destiny} />
            </div>
          </Card>

          <p className="eyebrow pt-2">ความหมายตามตำรา</p>
          <ReadingSection icon={User} title="บุคลิกภาพ" index={0}>
            {reading.interpretation.personality}
          </ReadingSection>
          <ReadingSection icon={ThumbsUp} title="จุดแข็ง" index={1}>
            <ReadingList items={reading.interpretation.strengths} marker="check" />
          </ReadingSection>
          <ReadingSection icon={TriangleAlert} title="จุดที่ควรพัฒนา" index={2}>
            <ReadingList items={reading.interpretation.weaknesses} marker="alert" />
          </ReadingSection>
          <ReadingSection icon={Compass} title="เส้นทางชีวิต" index={3}>
            {reading.interpretation.lifePath}
          </ReadingSection>
          <ReadingSection icon={Briefcase} title="การงาน" index={4}>
            {reading.interpretation.career}
          </ReadingSection>
          <ReadingSection icon={Heart} title="ความสัมพันธ์" index={5}>
            {reading.interpretation.relationships}
          </ReadingSection>
          <ReadingSection icon={Star} title="เลขมงคลของคุณ" index={6}>
            <div className="flex flex-wrap gap-2">
              {reading.luckyNumbers.map((number) => (
                <span
                  key={number}
                  className="inline-flex h-10 min-w-10 items-center justify-center rounded-pill border border-gold px-3 text-sm font-bold tabular-nums text-gold"
                >
                  {number}
                </span>
              ))}
            </div>
          </ReadingSection>
          <ReadingSection icon={Lightbulb} title="คำแนะนำ" index={7}>
            {reading.advice}
          </ReadingSection>
        </div>
      }
      cta={
        <ResultActions
          lineText={lineText}
          links={[
            { href: NAME_NUMEROLOGY_FORM_HREF, label: "วิเคราะห์ชื่อใหม่" },
            { href: "/", label: "กลับหน้าหลัก" },
          ]}
        />
      }
      trust={{
        computedFrom: `เลขศาสตร์จากตัวอักษรในชื่อและนามสกุล "${fullName}" ตามตำราเลขศาสตร์ไทย`,
        confidence: "ปานกลาง",
        aiUsed: false,
      }}
    />
  );
}
