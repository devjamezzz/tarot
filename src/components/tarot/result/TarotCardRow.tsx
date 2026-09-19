"use client";

import Image from "next/image";
import type { DrawnCard } from "@/lib/tarot/types";
import { cn } from "@/lib/cn";
import { CARD_ASPECT_CLASS, CARD_BACK_LARGE_SRC } from "@/lib/tarot/pick/assets";
import { ResultCardFace } from "@/components/tarot/result/ResultCardFace";

/** `/tarot/result?reveal=1` — cards arrive face-down and flip in place. */
export const RESULT_REVEAL_QUERY = "reveal";

/** Column layout per card count — static class strings so Tailwind emits them. */
const GRID: Record<number, string> = {
  1: "grid-cols-1 mx-auto max-w-[220px]",
  2: "grid-cols-2 mx-auto max-w-[420px]",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-3 sm:grid-cols-5",
};
const DEFAULT_GRID = "grid-cols-3 sm:grid-cols-5";
/** The face's art box is 115% of the frame, so ask for a little more than the column. */
const IMAGE_SIZES = "(max-width: 640px) 36vw, 220px";
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
/** Gold halo + card shadow (cardArt.CARD_FACE_SHADOW) as a utility for the static row. */
const FACE_SHADOW = "shadow-[0_0_24px_rgba(226,196,138,0.22),0_8px_28px_rgba(0,0,0,0.45)]";

export interface TarotRevealProps {
  /** Which cards are face-up, index-aligned with `cards`. */
  flipped: boolean[];
  /** Another card is mid-flip — taps are ignored. */
  locked: boolean;
  /** prefers-reduced-motion: crossfade instead of the 3D flip. */
  reduced: boolean;
  onFlip: (index: number) => void;
}

export interface TarotCardRowProps {
  cards: DrawnCard[];
  /** Thai position labels from the spread, index-aligned with `cards`. */
  positions: string[];
  /** Omit for a static face-up row; pass to reveal the cards in place. */
  reveal?: TarotRevealProps;
  className?: string;
}

function CardBack() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[10px] border border-gold bg-surface">
      <Image
        src={CARD_BACK_LARGE_SRC}
        alt=""
        aria-hidden="true"
        fill
        sizes={IMAGE_SIZES}
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}

function FlipCard({
  drawn,
  index,
  position,
  reveal,
}: {
  drawn: DrawnCard;
  index: number;
  position: string | undefined;
  reveal: TarotRevealProps;
}) {
  const flipped = reveal.flipped[index] ?? false;
  const inert = flipped || reveal.locked;
  const face = (
    <ResultCardFace
      card={drawn.card}
      reversed={drawn.orientation === "reversed"}
      sizes={IMAGE_SIZES}
      className={cn("shadow-gold-glow", reveal.reduced && "motion-safe-fade")}
    />
  );

  return (
    <button
      type="button"
      data-testid="reveal-card"
      aria-label={`เปิดไพ่ตำแหน่ง ${position ?? index + 1}`}
      aria-pressed={flipped}
      aria-disabled={inert || undefined}
      onClick={() => {
        if (!inert) reveal.onFlip(index);
      }}
      className={cn(
        "relative block w-full touch-manipulation select-none rounded-[10px] perspective-[900px]",
        CARD_ASPECT_CLASS,
        FOCUS_RING,
        !inert &&
          "animate-gold-pulse transition-transform duration-[180ms] ease-out hover:-translate-y-1 motion-reduce:hover:translate-y-0"
      )}
    >
      {reveal.reduced ? (
        flipped ? (
          face
        ) : (
          <CardBack />
        )
      ) : (
        <div
          className={cn(
            "absolute inset-0 transform-3d transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            flipped && "rotate-y-180"
          )}
        >
          <div className="absolute inset-0 backface-hidden [-webkit-backface-visibility:hidden]">
            <CardBack />
          </div>
          <div className="absolute inset-0 rotate-y-180 backface-hidden [-webkit-backface-visibility:hidden]">
            {face}
          </div>
        </div>
      )}
    </button>
  );
}

/**
 * The drawn cards, shown once: position label above, the branded face
 * (ResultCardFace — plum-veiled art, gold ornaments, Thai plate + numeral,
 * no English on the card), Thai name large / English small below. With
 * `reveal` the cards start face-down and flip in place on tap.
 */
export function TarotCardRow({ cards, positions, reveal, className }: TarotCardRowProps) {
  const compact = cards.length > 3;

  return (
    <ul
      data-testid="tarot-card-row"
      className={cn("grid list-none gap-3 p-0", GRID[cards.length] ?? DEFAULT_GRID, className)}
    >
      {cards.map((drawn, index) => {
        const nameTh = drawn.card.nameTh ?? drawn.card.name;
        const reversed = drawn.orientation === "reversed";
        const position = positions[index];
        const showName = reveal ? (reveal.flipped[index] ?? false) : true;

        return (
          <li
            key={`${drawn.card.id}-${index}`}
            data-testid="tarot-card"
            className="flex min-w-0 animate-fade-up flex-col items-center text-center"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {position ? (
              <p className="mb-2 flex flex-col items-center gap-1 text-[13px] font-bold tracking-[0.04em] text-gold">
                <span aria-hidden="true" className="block h-px w-6 bg-gold" />
                {position}
              </p>
            ) : null}

            {reveal ? (
              <FlipCard drawn={drawn} index={index} position={position} reveal={reveal} />
            ) : (
              <div className={cn("relative w-full rounded-[10px]", FACE_SHADOW, CARD_ASPECT_CLASS)}>
                <ResultCardFace
                  card={drawn.card}
                  reversed={reversed}
                  sizes={IMAGE_SIZES}
                  priority={index < 3}
                />
              </div>
            )}

            {showName ? (
              <div className={cn("mt-2", reveal && "motion-safe-fade animate-fade-up")}>
                <h3
                  className={cn(
                    "font-display font-semibold leading-tight text-fg",
                    compact ? "text-base" : "text-lg"
                  )}
                >
                  {nameTh}
                </h3>
                {drawn.card.nameTh ? (
                  <p className="text-[13px] text-fg-muted">{drawn.card.name}</p>
                ) : null}
                {reversed ? (
                  <span className="mt-1 inline-flex items-center rounded-pill border border-gold bg-gold-soft px-2 py-0.5 text-[13px] font-semibold text-gold">
                    กลับหัว
                  </span>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
