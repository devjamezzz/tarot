import type { ReactNode } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { AppBar } from "@/components/nav/AppBar";
import { AiTypingDots } from "@/components/ui/AiTypingDots";
import { TrustPanel, type TrustConfidence } from "./TrustPanel";

export type ReadingResultShellProps = {
  /** Gold eyebrow above the title, e.g. "ทาโรต์". */
  label: string;
  /** Trirong h1, e.g. "ไพ่ของคุณ". */
  title: string;
  /** 13px caption under the title, e.g. "3 ใบ · ความรัก · 19 ก.ย. 2569". */
  caption?: string;
  /** Deterministic result — always rendered first. */
  computed: ReactNode;
  /** AI section; omit (or leave undefined) when hidden by config or unavailable. */
  ai?: ReactNode;
  /** Replaces the AI section with typing dots while Gemini is working. */
  aiLoading?: boolean;
  /** Primary + secondary actions (LINE CTA first). */
  cta: ReactNode;
  trust: {
    computedFrom: string;
    confidence: TrustConfidence;
    aiUsed?: boolean;
  };
  backHref?: string;
  /** Anything after the trust panel (upsell ladder, related links, …). */
  children?: ReactNode;
};

/**
 * Standard result layout every vertical adopts:
 * app bar → computed → AI (or typing dots) → CTA → trust panel → children.
 */
export function ReadingResultShell({
  label,
  title,
  caption,
  computed,
  ai,
  aiLoading = false,
  cta,
  trust,
  backHref,
  children,
}: ReadingResultShellProps) {
  return (
    <PageContainer variant="narrow">
      <AppBar label={label} title={title} caption={caption} backHref={backHref} />

      <section data-testid="result-computed" className="mt-4">
        {computed}
      </section>

      {aiLoading ? (
        <section data-testid="result-ai" className="mt-6">
          <AiTypingDots />
        </section>
      ) : ai ? (
        <section data-testid="result-ai" className="mt-6">
          {ai}
        </section>
      ) : null}

      <section data-testid="result-cta" className="mt-6 flex flex-col gap-3">
        {cta}
      </section>

      <TrustPanel
        className="mt-6"
        computedFrom={trust.computedFrom}
        confidence={trust.confidence}
        aiUsed={trust.aiUsed}
      />

      {children ? <div className="mt-6">{children}</div> : null}
    </PageContainer>
  );
}
