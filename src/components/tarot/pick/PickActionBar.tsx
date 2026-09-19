"use client";

import { RefreshCcw, Sparkles, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type PickStage = "pick" | "reveal";

export type PickActionBarProps = {
  stage: PickStage;
  /** Pick stage: every slot of the spread is filled. */
  canReveal: boolean;
  /** Reveal stage: navigating to the result (auto-advance or the button). */
  submitting: boolean;
  onShuffle: () => void;
  onReveal: () => void;
  onBackToPick: () => void;
  /** Reveal stage: open every card that is still face down and go to the result now. */
  onDone: () => void;
};

/**
 * Sticky bar that sits above the BottomTabBar (56px + safe-area).
 * Ghost + gold buttons share one flex row with min-w-0 so both stay inside
 * a 390px viewport; the ghost collapses to its icon on narrow screens.
 *
 * In the reveal stage the cards open by themselves and the page moves on
 * when the last one settles, so the gold button is a shortcut that is never
 * gated on flips — its label only promises the navigation it performs.
 */
export function PickActionBar({
  stage,
  canReveal,
  submitting,
  onShuffle,
  onReveal,
  onBackToPick,
  onDone,
}: PickActionBarProps) {
  return (
    <div className="sticky above-tabbar z-40 -mx-4 mt-6 border-t border-line-faint bg-bg/90 px-4 pb-3 pt-3 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        {stage === "pick" ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onShuffle}
              aria-label="สับใหม่"
              className="shrink-0 max-[359px]:w-12 max-[359px]:px-0"
            >
              <RefreshCcw className="text-gold" strokeWidth={1.5} aria-hidden />
              <span className="max-[359px]:sr-only">สับใหม่</span>
            </Button>
            <Button
              type="button"
              variant="gold"
              size="lg"
              data-testid="pick-submit"
              disabled={!canReveal}
              onClick={onReveal}
              className="min-w-0 flex-1 px-4"
            >
              <Sparkles strokeWidth={1.5} aria-hidden />
              เปิดไพ่
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={onBackToPick}
              disabled={submitting}
              aria-label="เลือกไพ่ใหม่"
              className="shrink-0 max-sm:w-12 max-sm:px-0"
            >
              <Undo2 className="text-gold" strokeWidth={1.5} aria-hidden />
              <span className="max-sm:sr-only">เลือกใหม่</span>
            </Button>
            <Button
              type="button"
              variant="gold"
              size="lg"
              data-testid="reveal-done"
              disabled={submitting}
              aria-busy={submitting || undefined}
              onClick={onDone}
              className="min-w-0 flex-1 px-4"
            >
              {submitting ? "กำลังเปิดผล…" : "ดูไพ่ที่เปิด"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
