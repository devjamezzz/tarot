import type { Metadata } from "next";
import { Suspense } from "react";
import { HOROSCOPE_LABEL } from "@/components/verticals/HoroscopeForm";
import { HoroscopeResult } from "@/components/verticals/HoroscopeResult";
import { ResultLoading } from "@/components/verticals/ResultStates";
import { TimePeriod } from "@/lib/horoscope/types";

export const metadata: Metadata = {
  title: "ดวงรายวันของคุณ — REFFORTUNE",
  robots: { index: false },
};

export default function HoroscopeResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading label={HOROSCOPE_LABEL} title="ดวงรายวันของคุณ" backHref="/horoscope/daily" />
      }
    >
      <HoroscopeResult period={TimePeriod.DAILY} />
    </Suspense>
  );
}
