"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase, Clover, Coins, Heart, HeartPulse, Lightbulb } from "lucide-react";
import { ReadingResultShell } from "@/components/reading/ReadingResultShell";
import { Card } from "@/components/ui/Card";
import { generateHoroscope } from "@/lib/horoscope/engine";
import type { HoroscopeInput, TimePeriod } from "@/lib/horoscope/types";
import { getZodiacMetadata } from "@/lib/horoscope/zodiac";
import { SITE_URL } from "@/lib/site";
import { HOROSCOPE_LABEL, horoscopeFormHref, horoscopeResultHref } from "./HoroscopeForm";
import { ReadingSection } from "./ReadingSection";
import { ResultActions } from "./ResultActions";
import { ResultError, ResultLoading } from "./ResultStates";
import { useEngineReading } from "./useEngineReading";
import {
  PERIOD_LABELS,
  WESTERN_ELEMENT_LABELS,
  confidenceFromScore,
  formatPeriodRange,
  isZodiacSign,
  zodiacRangeLabel,
} from "./readingMeta";

const TEXT_PRESENTATION = "︎";

/** One result view for daily / weekly / monthly; the engine is deterministic and client-side. */
export function HoroscopeResult({ period }: { period: TimePeriod }) {
  const searchParams = useSearchParams();
  const signParam = searchParams.get("sign");
  const periodLabel = PERIOD_LABELS[period];
  const title = `ดวง${periodLabel}ของคุณ`;
  const formHref = horoscopeFormHref(period);

  const params = useMemo<HoroscopeInput | null>(
    () => (isZodiacSign(signParam) ? { zodiacSign: signParam, period, date: new Date() } : null),
    [signParam, period]
  );
  const { status, reading, error } = useEngineReading(params, generateHoroscope);

  if (status === "invalid") {
    return (
      <ResultError
        label={HOROSCOPE_LABEL}
        title={title}
        message="กรุณาเลือกราศีก่อนดูดวง"
        backHref={formHref}
        backLabel="กลับไปเลือกราศี"
      />
    );
  }
  if (status === "loading") {
    return <ResultLoading label={HOROSCOPE_LABEL} title={title} backHref={formHref} />;
  }
  if (status === "error" || !reading) {
    return (
      <ResultError
        label={HOROSCOPE_LABEL}
        title={title}
        message={error}
        backHref={formHref}
        backLabel="ลองใหม่"
      />
    );
  }

  const meta = getZodiacMetadata(reading.zodiacSign);
  const range = formatPeriodRange(period, reading.dateRange.start, reading.dateRange.end);
  const resultUrl = `${SITE_URL}${horoscopeResultHref(period, reading.zodiacSign)}`;
  const lineText = [
    `ดวง${periodLabel} ราศี${meta.thaiName} (${range}) จาก REFFORTUNE`,
    "อยากให้หมอดูช่วยขยายความเพิ่มเติม",
    resultUrl,
  ].join("\n");

  return (
    <ReadingResultShell
      label={HOROSCOPE_LABEL}
      title={title}
      caption={`ราศี${meta.thaiName} · ${range}`}
      backHref={formHref}
      computed={
        <div className="space-y-3">
          <Card data-testid="result-hero" className="animate-fade-up motion-safe-fade text-center">
            <p aria-hidden="true" className="font-display text-5xl leading-none text-gold">
              {meta.symbol}
              {TEXT_PRESENTATION}
            </p>
            <h2 className="mt-3 font-display text-[22px] font-semibold text-fg">ราศี{meta.thaiName}</h2>
            <p className="mt-1 text-[13px] text-fg-muted">
              {zodiacRangeLabel(meta)} · ธาตุ{WESTERN_ELEMENT_LABELS[meta.element]}
            </p>
            <p className="mt-1 text-sm text-fg">{range}</p>
          </Card>

          <p className="eyebrow pt-2">ความหมายตามตำรา</p>
          <ReadingSection icon={Heart} title="ความรัก" index={0}>
            {reading.aspects.love}
          </ReadingSection>
          <ReadingSection icon={Briefcase} title="การงาน" index={1}>
            {reading.aspects.career}
          </ReadingSection>
          <ReadingSection icon={Coins} title="การเงิน" index={2}>
            {reading.aspects.finance}
          </ReadingSection>
          <ReadingSection icon={HeartPulse} title="สุขภาพ" index={3}>
            {reading.aspects.health}
          </ReadingSection>
          <ReadingSection icon={Clover} title="เลขและสีมงคล" index={4}>
            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-[13px] text-fg-muted">เลขมงคล</dt>
                <dd className="mt-1 font-bold tracking-[.12em] text-gold tabular-nums">
                  {reading.luckyNumbers.join(" ")}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-fg-muted">สีมงคล</dt>
                <dd className="mt-1">{reading.luckyColors.join(", ")}</dd>
              </div>
            </dl>
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
            { href: formHref, label: "ดูราศีอื่น" },
            { href: "/horoscope", label: "ช่วงเวลาอื่น" },
          ]}
        />
      }
      trust={{
        computedFrom: `โหราศาสตร์ราศี${meta.thaiName} ช่วง${periodLabel} ตามตำราพื้นฐาน`,
        confidence: confidenceFromScore(reading.confidence),
        aiUsed: false,
      }}
    />
  );
}
