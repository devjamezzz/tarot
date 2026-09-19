"use client";

import {
  ChevronRight,
  Columns2,
  Columns3,
  Grid3X3,
  LayoutGrid,
  Square,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { SpreadDef } from "@/lib/tarot/spreads";

const COUNT_ICONS: Record<number, LucideIcon> = {
  1: Square,
  2: Columns2,
  3: Columns3,
  4: LayoutGrid,
  5: LayoutGrid,
  10: Grid3X3,
};

export interface SpreadCardProps {
  spread: SpreadDef;
  /** The spread the sticky CTA will use — gold border + tint. */
  selected?: boolean;
  /** Small gold line above the title, e.g. "แนะนำสำหรับเรื่องความรัก". */
  badge?: string;
  /** Navigation to /tarot/pick is in flight for this spread. */
  busy?: boolean;
  onSelect: (spreadId: string) => void;
}

/** A named spread as a full-width button card (title, description, "N ใบ"); tapping it goes to /tarot/pick. */
export function SpreadCard({ spread, selected = false, badge, busy = false, onSelect }: SpreadCardProps) {
  const Icon = COUNT_ICONS[spread.count] ?? LayoutGrid;

  return (
    <Card interactive className={cn("p-0 md:p-0", selected && "border-gold")}>
      <button
        type="button"
        data-testid="spread-card"
        data-spread={spread.id}
        aria-current={selected ? "true" : undefined}
        aria-busy={busy || undefined}
        onClick={() => onSelect(spread.id)}
        className={cn(
          "flex w-full items-start gap-4 rounded-card p-4 text-left md:p-5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          selected && "bg-gold-soft",
          busy && "opacity-70"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border bg-sunk text-gold",
            selected ? "border-gold shadow-gold-glow" : "border-line"
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>

        <span className="min-w-0 flex-1">
          {badge ? <span className="mb-1 block text-[12px] font-bold text-gold">{badge}</span> : null}
          <span className="flex items-start justify-between gap-2">
            <span className="font-display text-lg font-semibold leading-snug text-fg">{spread.titleTh}</span>
            <span className="shrink-0 rounded-pill border border-line px-2 py-0.5 text-[13px] tabular-nums text-fg-muted">
              {spread.count} ใบ
            </span>
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-fg-muted">{spread.descriptionTh}</span>
          <span className="mt-2 line-clamp-1 block text-[13px] text-fg-subtle">
            {spread.positionsTh.join(" · ")}
          </span>
        </span>

        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </Card>
  );
}
