"use client";

import { cn } from "@/lib/cn";
import type { TarotCard } from "@/lib/tarot/types";
import { RevealCard } from "./RevealCard";

/** Card widths that keep the whole row inside 358px (390px − 2×16px). */
function widthClass(count: number): string {
  if (count <= 3) return "w-[108px] sm:w-[140px]";
  if (count === 4) return "w-[76px] sm:w-[120px]";
  if (count <= 5) return "w-[64px] sm:w-[104px]";
  return "w-[64px] sm:w-[96px]";
}

export type RevealRowProps = {
  cards: TarotCard[];
  /** Thai position labels from the spread, index-aligned with `cards`. */
  positions: string[];
  flipped: boolean[];
  reduced: boolean;
  onFlip: (index: number) => void;
  onFlipComplete: (index: number) => void;
  className?: string;
};

export function RevealRow({
  cards,
  positions,
  flipped,
  reduced,
  onFlip,
  onFlipComplete,
  className,
}: RevealRowProps) {
  const dense = cards.length >= 5;
  const width = widthClass(cards.length);

  return (
    <ul
      role="list"
      data-testid="reveal-row"
      className={cn(
        "flex flex-wrap items-start justify-center",
        dense ? "gap-2 sm:gap-4" : "gap-3 sm:gap-5",
        className
      )}
    >
      {cards.map((card, index) => (
        <RevealCard
          key={card.id}
          card={card}
          index={index}
          position={positions[index] ?? `ตำแหน่งที่ ${index + 1}`}
          flipped={flipped[index] ?? false}
          reduced={reduced}
          widthClass={width}
          compact={dense}
          onFlip={onFlip}
          onFlipComplete={onFlipComplete}
        />
      ))}
    </ul>
  );
}
