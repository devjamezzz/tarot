import * as React from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export interface StepsCardProps {
  /** Gold eyebrow above the title, e.g. "วิธีเล่น". */
  label: string;
  title: string;
  steps: ReadonlyArray<string>;
  className?: string;
}

/**
 * Short numbered "how it works" list that sits under a vertical's entry card,
 * so the mobile fold never ends on a single card with half a screen of empty space.
 */
export function StepsCard({ label, title, steps, className }: StepsCardProps) {
  return (
    <Card variant="sunk" className={cn("mt-4", className)} data-testid="steps-card">
      <p className="eyebrow">{label}</p>
      <h2 className="mt-1 font-display text-lg font-semibold leading-snug text-fg">{title}</h2>
      <ol className="mt-3 space-y-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-gold/60 bg-gold-soft font-sans text-[13px] font-semibold tabular-nums text-gold"
            >
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-fg">{step}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}
