"use client";

import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import type { TarotCard } from "@/lib/tarot/types";
import { CARD_ASPECT_CLASS } from "@/lib/tarot/pick/assets";
import { PICK_GRID_SIZE } from "@/lib/tarot/pick/seededShuffle";
import { PickTile } from "./PickTile";

/**
 * The table: 4 across on mobile (tile ≈ 84px at 390px, wide enough for the
 * back's emblem to read), 5 across from 640px. Flex-wrap rather than grid so
 * the short last row of 30 sits centred instead of hugging the left edge.
 */
const TABLE_CLASS = "flex flex-wrap justify-center gap-2 sm:gap-3";
/** 4 columns with an 8px gap; 5 columns with a 12px gap. */
const TILE_CLASS = "w-[calc(25%_-_6px)] sm:w-[calc(20%_-_9.6px)]";

export function PickGridSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(TABLE_CLASS, className)}>
      <p role="status" className="sr-only">
        กำลังเตรียมไพ่…
      </p>
      {Array.from({ length: PICK_GRID_SIZE }, (_, i) => (
        <Skeleton key={i} className={cn(TILE_CLASS, CARD_ASPECT_CLASS, "rounded-[10px]")} />
      ))}
    </div>
  );
}

export type PickGridProps = {
  /** `null` until the per-visit seed is available on the client. */
  cards: TarotCard[] | null;
  /** Re-keys the grid so a reshuffle replays the deal-in stagger. */
  seed: number | null;
  /** Card ids in selection order. */
  selectedIds: string[];
  max: number;
  /** "สับใหม่" pressed: sweep the current hand away before the new one deals in. */
  shuffling: boolean;
  reduced: boolean;
  onToggle: (cardId: string) => void;
  className?: string;
};

export function PickGrid({
  cards,
  seed,
  selectedIds,
  max,
  shuffling,
  reduced,
  onToggle,
  className,
}: PickGridProps) {
  if (!cards) return <PickGridSkeleton className={className} />;

  const full = selectedIds.length >= max;

  return (
    <ul
      key={seed}
      role="list"
      data-testid="pick-grid"
      aria-busy={shuffling || undefined}
      className={cn(TABLE_CLASS, className)}
    >
      {cards.map((card, index) => {
        const order = selectedIds.indexOf(card.id) + 1;
        return (
          <PickTile
            key={card.id}
            card={card}
            index={index}
            order={order}
            dimmed={full && order === 0}
            gathering={shuffling}
            reduced={reduced}
            className={TILE_CLASS}
            onToggle={onToggle}
          />
        );
      })}
    </ul>
  );
}
