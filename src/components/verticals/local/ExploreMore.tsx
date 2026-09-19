"use client";

import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { cn } from "@/lib/cn";

export interface ExploreMoreProps {
  /** Heading above the feature grid; defaults to "ลองดูดวงแบบอื่น". */
  title?: string;
  lineLabel?: string;
  className?: string;
}

/**
 * The same closer /horoscope uses — "ลองดูดวงแบบอื่น" grid + LINE CTA — for
 * entry pages that would otherwise end after one card.
 */
export function ExploreMore({ title, lineLabel = "เพิ่มเพื่อน LINE", className }: ExploreMoreProps) {
  return (
    <section className={cn("mt-8 space-y-6", className)} data-testid="explore-more">
      <FeatureMenu title={title} />
      <div>
        <p className="mb-3 text-center text-[13px] leading-relaxed text-fg-muted">
          มีคำถามเพิ่มเติม? คุยกับหมอดูได้โดยตรงทาง LINE
        </p>
        <LineCtaButton label={lineLabel} />
      </div>
    </section>
  );
}
