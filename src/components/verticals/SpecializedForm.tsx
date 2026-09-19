"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, CalendarDays, Heart, Star, Target, type LucideIcon } from "lucide-react";
import { PeriodSelector } from "@/components/horoscope/PeriodSelector";
import { ZodiacSelector } from "@/components/horoscope/ZodiacSelector";
import { cn } from "@/lib/cn";
import { ReadingDomain } from "@/lib/horoscope/specialized";
import { TimePeriod, type ZodiacSign } from "@/lib/horoscope/types";
import { ReadingType } from "@/lib/reading/types";
import { FormGroup } from "./FormGroup";
import { DOMAIN_LABELS } from "./readingMeta";
import { VerticalFormShell } from "./VerticalFormShell";

export const SPECIALIZED_LABEL = "ดูดวงเฉพาะด้าน";
export const SPECIALIZED_FORM_HREF = "/specialized";

export function specializedResultHref(sign: ZodiacSign, domain: ReadingDomain, period: TimePeriod): string {
  const params = new URLSearchParams({ sign, domain, period });
  return `/specialized/result?${params.toString()}`;
}

export const DOMAIN_ICONS: Record<ReadingDomain, LucideIcon> = {
  [ReadingDomain.FINANCE_CAREER]: Briefcase,
  [ReadingDomain.LOVE_RELATIONSHIPS]: Heart,
};

const DOMAIN_OPTIONS: ReadonlyArray<{ value: ReadingDomain; desc: string }> = [
  { value: ReadingDomain.FINANCE_CAREER, desc: "การงาน รายได้ และโอกาสทางอาชีพ" },
  { value: ReadingDomain.LOVE_RELATIONSHIPS, desc: "ความรัก ความสัมพันธ์ และชีวิตคู่" },
];

/** /specialized — domain → sign → period. */
export function SpecializedForm() {
  const router = useRouter();
  const [domain, setDomain] = useState<ReadingDomain>(ReadingDomain.FINANCE_CAREER);
  const [sign, setSign] = useState<ZodiacSign | undefined>();
  const [period, setPeriod] = useState<TimePeriod>(TimePeriod.DAILY);

  return (
    <VerticalFormShell
      label={SPECIALIZED_LABEL}
      title="ดูดวงเจาะลึกเฉพาะด้าน"
      caption="เลือกด้านที่อยากรู้ ราศี และช่วงเวลา"
      backHref="/"
      privacy={{ featureType: ReadingType.SPECIALIZED, featureName: "ดูดวงเฉพาะด้าน" }}
      submitLabel="ดูดวงเฉพาะด้าน"
      submitDisabled={!sign}
      onSubmit={() => {
        if (sign) router.push(specializedResultHref(sign, domain, period));
      }}
    >
      <FormGroup icon={Target} title="เลือกด้านที่สนใจ">
        <div role="group" aria-label="เลือกด้านที่สนใจ" data-testid="domain-selector" className="space-y-2">
          {DOMAIN_OPTIONS.map((option) => {
            const selected = domain === option.value;
            const Icon = DOMAIN_ICONS[option.value];
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setDomain(option.value)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-card border p-4 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  selected ? "border-gold bg-gold-soft shadow-gold-glow" : "border-line bg-surface hover:bg-sunk"
                )}
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-base font-semibold", selected ? "text-gold" : "text-fg")}>
                    {DOMAIN_LABELS[option.value]}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-fg-muted">{option.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </FormGroup>

      <FormGroup icon={Star} title="เลือกราศีของคุณ">
        <ZodiacSelector value={sign} onChange={setSign} />
      </FormGroup>

      <FormGroup icon={CalendarDays} title="เลือกช่วงเวลา">
        <PeriodSelector value={period} onChange={setPeriod} />
      </FormGroup>
    </VerticalFormShell>
  );
}
