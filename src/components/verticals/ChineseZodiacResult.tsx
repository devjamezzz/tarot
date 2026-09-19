"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase, Coins, Heart, HeartPulse, Lightbulb, Sparkles } from "lucide-react";
import { AnimalDisplay } from "@/components/chinese-zodiac/AnimalDisplay";
import { ReadingResultShell } from "@/components/reading/ReadingResultShell";
import { getElementMetadata } from "@/lib/chinese-zodiac/animals";
import { generateChineseZodiacReading } from "@/lib/chinese-zodiac/engine";
import type { ChineseZodiacInput } from "@/lib/chinese-zodiac/types";
import { toBuddhistYear } from "@/lib/format/thaiDate";
import { SITE_URL } from "@/lib/site";
import {
  CHINESE_ZODIAC_FORM_HREF,
  CHINESE_ZODIAC_LABEL,
  chineseZodiacResultHref,
} from "./ChineseZodiacForm";
import { ReadingSection } from "./ReadingSection";
import { ResultActions } from "./ResultActions";
import { ResultError, ResultLoading } from "./ResultStates";
import { useEngineReading } from "./useEngineReading";
import { PERIOD_LABELS, formatPeriodRange, isTimePeriod } from "./readingMeta";

const TITLE = "ดวงจีนของคุณ";
const MIN_YEAR = 1900;

/** /chinese-zodiac/result?year=CE&period=daily|weekly|monthly */
export function ChineseZodiacResult() {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  const periodParam = searchParams.get("period");

  const params = useMemo<ChineseZodiacInput | null>(() => {
    const birthYear = Number(yearParam);
    const validYear =
      /^\d{4}$/.test(yearParam ?? "") && birthYear >= MIN_YEAR && birthYear <= new Date().getFullYear();
    if (!validYear || !isTimePeriod(periodParam)) return null;
    return { birthYear, period: periodParam, date: new Date() };
  }, [yearParam, periodParam]);
  const { status, reading, error } = useEngineReading(params, generateChineseZodiacReading);

  if (status === "invalid") {
    return (
      <ResultError
        label={CHINESE_ZODIAC_LABEL}
        title={TITLE}
        message="กรุณาระบุปีเกิดและช่วงเวลาก่อนดูดวง"
        backHref={CHINESE_ZODIAC_FORM_HREF}
        backLabel="กลับไประบุปีเกิด"
      />
    );
  }
  if (status === "loading") {
    return <ResultLoading label={CHINESE_ZODIAC_LABEL} title={TITLE} backHref={CHINESE_ZODIAC_FORM_HREF} />;
  }
  if (status === "error" || !reading || !params) {
    return (
      <ResultError
        label={CHINESE_ZODIAC_LABEL}
        title={TITLE}
        message={error}
        backHref={CHINESE_ZODIAC_FORM_HREF}
        backLabel="ลองใหม่"
      />
    );
  }

  const periodLabel = PERIOD_LABELS[reading.period];
  const elementName = getElementMetadata(reading.element).thaiName;
  const range = formatPeriodRange(reading.period, reading.dateRange.start, reading.dateRange.end);
  const lineText = [
    `ดวงจีน${periodLabel} ${reading.thaiName} ธาตุ${elementName} (${range}) จาก REFFORTUNE`,
    "อยากให้หมอดูช่วยขยายความเพิ่มเติม",
    `${SITE_URL}${chineseZodiacResultHref(params.birthYear, params.period)}`,
  ].join("\n");

  return (
    <ReadingResultShell
      label={CHINESE_ZODIAC_LABEL}
      title={TITLE}
      caption={`${reading.thaiName} · ดวง${periodLabel} · ${range}`}
      backHref={CHINESE_ZODIAC_FORM_HREF}
      computed={
        <div className="space-y-3">
          <div data-testid="result-hero">
            <AnimalDisplay animal={reading.animal} element={reading.element} showDetails />
          </div>

          <p className="eyebrow pt-2">ความหมายตามตำรา</p>
          <ReadingSection icon={Sparkles} title="โชคชะตาโดยรวม" index={0}>
            {reading.fortune.overall}
          </ReadingSection>
          <ReadingSection icon={Briefcase} title="การงาน" index={1}>
            {reading.fortune.career}
          </ReadingSection>
          <ReadingSection icon={Coins} title="การเงิน" index={2}>
            {reading.fortune.wealth}
          </ReadingSection>
          <ReadingSection icon={HeartPulse} title="สุขภาพ" index={3}>
            {reading.fortune.health}
          </ReadingSection>
          <ReadingSection icon={Heart} title="ความสัมพันธ์" index={4}>
            {reading.fortune.relationships}
          </ReadingSection>
          <ReadingSection icon={Lightbulb} title="คำแนะนำ" index={5}>
            {reading.advice}
          </ReadingSection>
        </div>
      }
      cta={
        <ResultActions
          lineText={lineText}
          links={[
            { href: CHINESE_ZODIAC_FORM_HREF, label: "ดูช่วงเวลาอื่น" },
            { href: "/", label: "กลับหน้าหลัก" },
          ]}
        />
      }
      trust={{
        computedFrom: `ปีนักษัตรและธาตุจากปีเกิด พ.ศ. ${toBuddhistYear(params.birthYear)} ช่วง${periodLabel}`,
        confidence: "ปานกลาง",
        aiUsed: false,
      }}
    />
  );
}
