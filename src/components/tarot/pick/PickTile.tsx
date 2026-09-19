"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";
import type { TarotCard } from "@/lib/tarot/types";
import { CARD_ASPECT_CLASS, CARD_BACK_GRID_SRC } from "@/lib/tarot/pick/assets";

/** Deal-in stagger between tiles on mount (brief §1.4: 30ms/ใบ). */
export const PICK_STAGGER_MS = 30;
/** "สับใหม่": the old hand is swept off the table for this long before the new one is dealt. */
export const SHUFFLE_GATHER_MS = 380;

/**
 * Cards drop onto the table from the deck, one after another; on reshuffle
 * they riffle away — neighbours swing opposite ways — before the new hand
 * deals in (the grid re-keys on the seed, so `hidden` → `shown` replays).
 */
const DEAL: Variants = {
  hidden: { opacity: 0, y: -28, rotate: -6, scale: 0.9 },
  shown: (index: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut", delay: (index * PICK_STAGGER_MS) / 1000 },
  }),
  gather: (index: number) => ({
    opacity: 0,
    x: index % 2 ? 32 : -32,
    y: -12,
    rotate: index % 2 ? 8 : -8,
    scale: 0.88,
    transition: { duration: 0.28, ease: "easeIn", delay: (index % 8) * 0.012 },
  }),
};

/** prefers-reduced-motion: a 200ms crossfade only (brief §1.4). */
const CROSSFADE: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  gather: { opacity: 0.35, transition: { duration: 0.2, ease: "easeOut" } },
};

export type PickTileProps = {
  card: TarotCard;
  /** 0-based position in the grid (drives the stagger + aria-label). */
  index: number;
  /** 1-based selection order; 0 when not selected. */
  order: number;
  /** Count reached and this tile is not part of the selection. */
  dimmed: boolean;
  /** The table is being swept for a reshuffle. */
  gathering: boolean;
  reduced: boolean;
  /** Column width from the grid. */
  className?: string;
  onToggle: (cardId: string) => void;
};

export function PickTile({
  card,
  index,
  order,
  dimmed,
  gathering,
  reduced,
  className,
  onToggle,
}: PickTileProps) {
  const selected = order > 0;

  return (
    <motion.li
      className={cn("relative", className)}
      custom={index}
      variants={reduced ? CROSSFADE : DEAL}
      initial="hidden"
      animate={gathering ? "gather" : "shown"}
    >
      <button
        type="button"
        data-testid="pick-card"
        aria-pressed={selected}
        aria-label={`ไพ่ใบที่ ${index + 1}`}
        aria-disabled={dimmed || undefined}
        onClick={() => onToggle(card.id)}
        className={cn(
          "relative block w-full touch-manipulation select-none overflow-hidden rounded-[10px] border bg-surface shadow-[0_4px_12px_rgba(0,0,0,0.35)]",
          CARD_ASPECT_CLASS,
          "transition-[transform,box-shadow,border-color,opacity] duration-[180ms] ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          selected
            ? "z-10 -translate-y-3 border-gold shadow-gold-glow motion-reduce:translate-y-0"
            : "border-line hover:-translate-y-1 hover:border-gold/60 motion-reduce:hover:translate-y-0",
          dimmed && "opacity-40 saturate-50"
        )}
      >
        <Image
          src={CARD_BACK_GRID_SRC}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 640px) 112px, 22vw"
          className="object-cover"
          draggable={false}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[3px] rounded-[8px] shadow-[inset_0_0_0_1px_rgba(226,196,138,0.14)]"
        />
        {selected ? (
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-bg/30"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-pill bg-gold-strong text-[13px] font-bold tabular-nums text-bg shadow-card">
              {order}
            </span>
          </span>
        ) : null}
      </button>
    </motion.li>
  );
}
