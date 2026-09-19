import type { Metadata } from "next";
import { Suspense } from "react";
import {
  NAME_NUMEROLOGY_FORM_HREF,
  NAME_NUMEROLOGY_LABEL,
} from "@/components/verticals/NameNumerologyForm";
import { ResultLoading } from "@/components/verticals/ResultStates";
import ResultClient from "./resultClient";

export const metadata: Metadata = {
  title: "ผลการวิเคราะห์ชื่อ — REFFORTUNE",
  robots: { index: false },
};

export default function NameNumerologyResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading
          label={NAME_NUMEROLOGY_LABEL}
          title="ผลการวิเคราะห์ชื่อ"
          backHref={NAME_NUMEROLOGY_FORM_HREF}
        />
      }
    >
      <ResultClient />
    </Suspense>
  );
}
