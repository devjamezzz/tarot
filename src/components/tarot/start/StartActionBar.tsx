"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SpreadDef } from "@/lib/tarot/spreads";

export const START_CTA_LABEL = "ไปเลือกไพ่";
export const START_CTA_BUSY_LABEL = "กำลังไปเลือกไพ่…";

export interface StartActionBarProps {
  /** The spread the button will open /tarot/pick with. */
  spread: SpreadDef;
  submitting: boolean;
  onStart: () => void;
}

/**
 * Sticky gold CTA above the BottomTabBar (56px + safe-area) — the same
 * container as PickActionBar so the start and pick pages share one rhythm.
 * The label names the spread it will open; it truncates instead of clipping
 * on 360–390px screens.
 */
export function StartActionBar({ spread, submitting, onStart }: StartActionBarProps) {
  return (
    <div className="sticky above-tabbar z-40 -mx-4 mt-6 border-t border-line-faint bg-bg/90 px-4 pb-3 pt-3 backdrop-blur-md">
      <Button
        type="button"
        variant="gold"
        size="lg"
        data-testid="start-submit"
        disabled={submitting}
        aria-busy={submitting || undefined}
        onClick={onStart}
        className="w-full min-w-0 px-4"
      >
        <Sparkles strokeWidth={1.5} aria-hidden />
        <span className="min-w-0 truncate">
          {submitting ? START_CTA_BUSY_LABEL : `${START_CTA_LABEL} · ${spread.titleTh}`}
        </span>
      </Button>
    </div>
  );
}
