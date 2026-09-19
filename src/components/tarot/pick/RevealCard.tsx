"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { TarotCard } from "@/lib/tarot/types";
import { CARD_ASPECT_CLASS, CARD_BACK_LARGE_SRC } from "@/lib/tarot/pick/assets";
import { FLIP_DURATION_MS } from "@/lib/tarot/pick/revealTiming";
import { TarotCardFace } from "./TarotCardFace";

/** 3D flip (brief §1.4). */
const FLIP_DURATION_S = FLIP_DURATION_MS / 1000;

/** The art box is 115% of the frame, so request a little more than the frame width. */
export const REVEAL_IMAGE_SIZES = "(min-width: 640px) 160px, 36vw";

function CardBack() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[10px] border border-gold bg-surface">
      <Image
        src={CARD_BACK_LARGE_SRC}
        alt=""
        aria-hidden
        fill
        sizes={REVEAL_IMAGE_SIZES}
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}

export type RevealCardProps = {
  card: TarotCard;
  index: number;
  /** Thai position label from the spread, e.g. "อดีต". */
  position: string;
  flipped: boolean;
  /** prefers-reduced-motion: crossfade instead of the 3D flip. */
  reduced: boolean;
  widthClass: string;
  /** Dense rows (≥ 5 cards): Thai name only, so 64px columns stay readable. */
  compact: boolean;
  /** Tap-to-open ahead of the automatic sequence. */
  onFlip: (index: number) => void;
  /** The front is fully visible (animation settled). */
  onFlipComplete: (index: number) => void;
};

export function RevealCard({
  card,
  index,
  position,
  flipped,
  reduced,
  widthClass,
  compact,
  onFlip,
  onFlipComplete,
}: RevealCardProps) {
  const nameTh = card.nameTh ?? card.name;

  // No flip animation under reduced motion — the crossfade counts as settled at once.
  useEffect(() => {
    if (reduced && flipped) onFlipComplete(index);
  }, [reduced, flipped, index, onFlipComplete]);

  return (
    <li className={cn("flex flex-col items-center", widthClass)}>
      <button
        type="button"
        data-testid="reveal-card"
        aria-label={`เปิดไพ่ตำแหน่ง ${position}`}
        aria-pressed={flipped}
        aria-disabled={flipped || undefined}
        onClick={() => {
          if (!flipped) onFlip(index);
        }}
        className={cn(
          "relative block w-full touch-manipulation select-none rounded-[10px] perspective-[900px]",
          CARD_ASPECT_CLASS,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          !flipped &&
            "transition-transform duration-[180ms] ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0"
        )}
      >
        {reduced ? (
          flipped ? (
            <TarotCardFace card={card} sizes={REVEAL_IMAGE_SIZES} className="motion-safe-fade shadow-gold-glow" />
          ) : (
            <CardBack />
          )
        ) : (
          <motion.div
            className="absolute inset-0 transform-3d"
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: FLIP_DURATION_S, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={() => {
              if (flipped) onFlipComplete(index);
            }}
          >
            <div className="absolute inset-0 backface-hidden [-webkit-backface-visibility:hidden]">
              <CardBack />
            </div>
            <div className="absolute inset-0 rotate-y-180 backface-hidden [-webkit-backface-visibility:hidden]">
              <TarotCardFace card={card} sizes={REVEAL_IMAGE_SIZES} className="shadow-gold-glow" />
            </div>
          </motion.div>
        )}
      </button>

      <span aria-hidden className="mt-3 h-px w-6 bg-gold" />
      <span className="mt-1.5 break-words text-center text-[13px] leading-tight text-fg-muted">
        {position}
      </span>
      {flipped ? (
        <span className="motion-safe-fade animate-fade-up mt-1 flex flex-col items-center text-center">
          <span
            className={cn(
              "font-display font-semibold leading-tight text-fg",
              compact ? "text-[15px]" : "text-base"
            )}
          >
            {nameTh}
          </span>
          {!compact && card.nameTh ? (
            <span className="text-[13px] leading-tight text-fg-subtle">{card.name}</span>
          ) : null}
        </span>
      ) : null}
    </li>
  );
}
