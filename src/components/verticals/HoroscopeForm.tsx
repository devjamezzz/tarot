"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZodiacSelector } from "@/components/horoscope/ZodiacSelector";
import { TimePeriod, type ZodiacSign } from "@/lib/horoscope/types";
import { ReadingType } from "@/lib/reading/types";
import { PERIOD_LABELS } from "./readingMeta";
import { VerticalFormShell } from "./VerticalFormShell";

export const HOROSCOPE_LABEL = "โหราศาสตร์ราศี";

export function horoscopeFormHref(period: TimePeriod): string {
  return `/horoscope/${period}`;
}

export function horoscopeResultHref(period: TimePeriod, sign: ZodiacSign): string {
  return `/horoscope/${period}/result?sign=${sign}`;
}

/** One form for /horoscope/daily, /weekly and /monthly — pick a sign, go to the result. */
export function HoroscopeForm({ period }: { period: TimePeriod }) {
  const router = useRouter();
  const [sign, setSign] = useState<ZodiacSign | undefined>();
  const periodLabel = PERIOD_LABELS[period];

  return (
    <VerticalFormShell
      label={HOROSCOPE_LABEL}
      title={`ดูดวง${periodLabel}`}
      caption="เลือกราศีของคุณ แล้วกดดูดวงได้ทันที"
      backHref="/horoscope"
      privacy={{ featureType: ReadingType.HOROSCOPE, featureName: `ดูดวง${periodLabel}` }}
      submitLabel={`ดูดวง${periodLabel}`}
      submitDisabled={!sign}
      onSubmit={() => {
        if (sign) router.push(horoscopeResultHref(period, sign));
      }}
    >
      <ZodiacSelector value={sign} onChange={setSign} />
      <p className="text-[13px] leading-relaxed text-fg-muted">
        ไม่แน่ใจว่าคุณราศีอะไร? ดูจากช่วงวันเกิดใต้ชื่อราศีได้เลย
      </p>
    </VerticalFormShell>
  );
}
