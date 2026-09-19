import type { Metadata } from "next";
import { Suspense } from "react";
import { COMPATIBILITY_FORM_HREF, COMPATIBILITY_LABEL } from "@/components/verticals/CompatibilityForm";
import { CompatibilityResult } from "@/components/verticals/CompatibilityResult";
import { ResultLoading } from "@/components/verticals/ResultStates";

export const metadata: Metadata = {
  title: "ผลความเข้ากันของคุณ — REFFORTUNE",
  robots: { index: false },
};

export default function ThaiCompatibilityResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading
          label={COMPATIBILITY_LABEL}
          title="ผลความเข้ากันของคุณ"
          backHref={COMPATIBILITY_FORM_HREF}
        />
      }
    >
      <CompatibilityResult />
    </Suspense>
  );
}
