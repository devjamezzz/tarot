"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Lightbulb, ListChecks, Sparkles, TrendingUp, TriangleAlert } from "lucide-react";
import { ReadingResultShell } from "@/components/reading/ReadingResultShell";
import { Card } from "@/components/ui/Card";
import {
  generateSpecializedReading,
  type SpecializedReadingInput,
} from "@/lib/horoscope/specialized";
import { getZodiacThaiName } from "@/lib/horoscope/zodiac";
import { SITE_URL } from "@/lib/site";
import { ReadingList, ReadingSection } from "./ReadingSection";
import { ResultActions } from "./ResultActions";
import { ResultError, ResultLoading } from "./ResultStates";
import {
  DOMAIN_ICONS,
  SPECIALIZED_FORM_HREF,
  SPECIALIZED_LABEL,
  specializedResultHref,
} from "./SpecializedForm";
import { useEngineReading } from "./useEngineReading";
import {
  DOMAIN_LABELS,
  PERIOD_LABELS,
  formatPeriodRange,
  isReadingDomain,
  isTimePeriod,
  isZodiacSign,
} from "./readingMeta";

const TITLE = "ดวงเฉพาะด้านของคุณ";

/** /specialized/result?sign=&domain=&period= */
export function SpecializedResult() {
  const searchParams = useSearchParams();
  const signParam = searchParams.get("sign");
  const domainParam = searchParams.get("domain");
  const periodParam = searchParams.get("period");

  const valid = isZodiacSign(signParam) && isReadingDomain(domainParam) && isTimePeriod(periodParam);
  const params = useMemo<SpecializedReadingInput | null>(
    () =>
      isZodiacSign(signParam) && isReadingDomain(domainParam) && isTimePeriod(periodParam)
        ? { zodiacSign: signParam, domain: domainParam, period: periodParam, date: new Date() }
        : null,
    [signParam, domainParam, periodParam]
  );
  const { status, reading, error } = useEngineReading(params, generateSpecializedReading);

  if (status === "invalid" || !valid) {
    return (
      <ResultError
        label={SPECIALIZED_LABEL}
        title={TITLE}
        message="กรุณาเลือกด้าน ราศี และช่วงเวลาก่อนดูดวง"
        backHref={SPECIALIZED_FORM_HREF}
        backLabel="กลับไปเลือกใหม่"
      />
    );
  }
  if (status === "loading") {
    return <ResultLoading label={SPECIALIZED_LABEL} title={TITLE} backHref={SPECIALIZED_FORM_HREF} />;
  }
  if (status === "error" || !reading) {
    return (
      <ResultError
        label={SPECIALIZED_LABEL}
        title={TITLE}
        message={error}
        backHref={SPECIALIZED_FORM_HREF}
        backLabel="ลองใหม่"
      />
    );
  }

  const signName = getZodiacThaiName(signParam);
  const domainLabel = DOMAIN_LABELS[domainParam];
  const periodLabel = PERIOD_LABELS[periodParam];
  const range = formatPeriodRange(periodParam, reading.dateRange.start, reading.dateRange.end);
  const DomainIcon = DOMAIN_ICONS[domainParam];
  const lineText = [
    `ดวง${domainLabel} ${periodLabel} ราศี${signName} (${range}) จาก REFFORTUNE`,
    "อยากให้หมอดูช่วยขยายความเพิ่มเติม",
    `${SITE_URL}${specializedResultHref(signParam, domainParam, periodParam)}`,
  ].join("\n");

  return (
    <ReadingResultShell
      label={SPECIALIZED_LABEL}
      title={TITLE}
      caption={`ราศี${signName} · ${domainLabel} · ${periodLabel}`}
      backHref={SPECIALIZED_FORM_HREF}
      computed={
        <div className="space-y-3">
          <Card data-testid="result-hero" className="animate-fade-up motion-safe-fade text-center">
            <DomainIcon className="mx-auto h-9 w-9 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <h2 className="mt-3 font-display text-[22px] font-semibold text-fg">ราศี{signName}</h2>
            <p className="mt-1 text-sm text-fg">{domainLabel}</p>
            <p className="mt-1 text-[13px] text-fg-muted">
              {periodLabel} · {range}
            </p>
          </Card>

          <p className="eyebrow pt-2">ความหมายตามตำรา</p>
          <ReadingSection icon={Sparkles} title="คำทำนาย" index={0}>
            {reading.prediction}
          </ReadingSection>
          <ReadingSection icon={TrendingUp} title="โอกาส" index={1}>
            <ReadingList items={reading.opportunities} />
          </ReadingSection>
          <ReadingSection icon={TriangleAlert} title="อุปสรรค" index={2}>
            <ReadingList items={reading.challenges} marker="alert" />
          </ReadingSection>
          <ReadingSection icon={ListChecks} title="สิ่งที่ควรทำ" index={3}>
            <ReadingList items={reading.actionItems} marker="number" />
          </ReadingSection>
          <ReadingSection icon={Lightbulb} title="คำแนะนำ" index={4}>
            {reading.advice}
          </ReadingSection>
        </div>
      }
      cta={
        <ResultActions
          lineText={lineText}
          links={[
            { href: SPECIALIZED_FORM_HREF, label: "ดูด้านอื่น" },
            { href: "/", label: "กลับหน้าหลัก" },
          ]}
        />
      }
      trust={{
        computedFrom: `โหราศาสตร์ราศี${signName} ด้าน${domainLabel} ช่วง${periodLabel} ตามตำราพื้นฐาน`,
        confidence: "ต่ำ",
        aiUsed: false,
      }}
    />
  );
}
