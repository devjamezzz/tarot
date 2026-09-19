import type { Metadata } from "next";
import { Suspense } from "react";
import {
  CHINESE_ZODIAC_FORM_HREF,
  CHINESE_ZODIAC_LABEL,
} from "@/components/verticals/ChineseZodiacForm";
import { ChineseZodiacResult } from "@/components/verticals/ChineseZodiacResult";
import { ResultLoading } from "@/components/verticals/ResultStates";

export const metadata: Metadata = {
  title: "ดวงจีนของคุณ — REFFORTUNE",
  robots: { index: false },
};

export default function ChineseZodiacResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading label={CHINESE_ZODIAC_LABEL} title="ดวงจีนของคุณ" backHref={CHINESE_ZODIAC_FORM_HREF} />
      }
    >
      <ChineseZodiacResult />
    </Suspense>
  );
}
