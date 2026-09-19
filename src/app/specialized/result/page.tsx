import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultLoading } from "@/components/verticals/ResultStates";
import { SPECIALIZED_FORM_HREF, SPECIALIZED_LABEL } from "@/components/verticals/SpecializedForm";
import { SpecializedResult } from "@/components/verticals/SpecializedResult";

export const metadata: Metadata = {
  title: "ดวงเฉพาะด้านของคุณ — REFFORTUNE",
  robots: { index: false },
};

export default function SpecializedResultPage() {
  return (
    <Suspense
      fallback={
        <ResultLoading label={SPECIALIZED_LABEL} title="ดวงเฉพาะด้านของคุณ" backHref={SPECIALIZED_FORM_HREF} />
      }
    >
      <SpecializedResult />
    </Suspense>
  );
}
