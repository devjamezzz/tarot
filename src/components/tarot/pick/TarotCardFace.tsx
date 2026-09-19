"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";
import type { TarotCard } from "@/lib/tarot/types";
import { cardFaceArt, type CardFaceArt } from "@/lib/tarot/pick/assets";
import { cardNumeralTh } from "@/lib/tarot/pick/cardFace";

/**
 * REF FORTUNE card front. The art is the engraved face set (gold strokes on
 * plum — lib/tarot/pick/assets.ts) framed like the back: gold border, inner
 * hairline with a star in each corner, a Thai numeral medallion at the head
 * and a Trirong title plate at the foot. Nothing on the card is English.
 * Fills its positioned parent; give the parent the card aspect ratio (brief
 * §1.5-3). Reused by the result page.
 *
 * A card whose image is not one of the shipped scans falls back to CSS
 * recolouring of that image, with its caption band cropped below the frame.
 */

/** Fallback only: art box taller than the frame so a baked caption band falls below it. */
const FALLBACK_ART_HEIGHT_PCT = 115;
const FALLBACK_ART_ORIGIN_Y_PCT = 50 / (FALLBACK_ART_HEIGHT_PCT / 100);
const FALLBACK_FILTER = "sepia(0.4) saturate(0.72) brightness(0.8) contrast(1.1)";
const FALLBACK_TINT = "linear-gradient(rgba(27,18,38,0.14), rgba(27,18,38,0.14))";

/** Opaque foot under the title plate + a soft darkening toward the frame. */
const OVERLAY = [
  "linear-gradient(to top, #1B1226 0%, rgba(27,18,38,0.94) 15%, rgba(27,18,38,0.6) 27%, rgba(27,18,38,0) 42%)",
  "radial-gradient(115% 85% at 50% 36%, rgba(27,18,38,0) 50%, rgba(27,18,38,0.45) 100%)",
].join(", ");

const STAR_PATH =
  "M8 0c.6 4.4 3.6 7.4 8 8-4.4.6-7.4 3.6-8 8-.6-4.4-3.6-7.4-8-8 4.4-.6 7.4-3.6 8-8Z";
/** Just inside the 5px hairline at every size the stars are shown. */
const CORNERS = [
  "left-[7%] top-[4.5%]",
  "right-[7%] top-[4.5%]",
  "left-[7%] bottom-[4.5%]",
  "right-[7%] bottom-[4.5%]",
];

export type TarotCardFaceProps = {
  card: TarotCard;
  /** `sizes` for next/image — the frame's rendered width. */
  sizes: string;
  reversed?: boolean;
  /** Above-the-fold usage (result page); the reveal row loads eagerly instead. */
  priority?: boolean;
  className?: string;
};

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={cn("fill-current", className)}>
      <path d={STAR_PATH} />
    </svg>
  );
}

/** Inner hairline + corner stars, mirroring the back. Stars only from 88px wide. */
function Frame() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-[5px] rounded-[7px] border border-gold/45 shadow-[inset_0_0_0_1px_rgba(226,196,138,0.08)]"
      />
      {CORNERS.map((position) => (
        <Star
          key={position}
          className={cn("absolute hidden h-[6cqw] w-[6cqw] text-gold/80 @min-[88px]:block", position)}
        />
      ))}
    </>
  );
}

function Medallion({ numeral }: { numeral: string | null }) {
  return (
    <span
      aria-hidden
      className="absolute left-1/2 top-[4.5%] hidden h-[22cqw] w-[22cqw] -translate-x-1/2 items-center justify-center rounded-pill border border-gold bg-bg/85 font-display text-[10.5cqw] font-semibold leading-none text-gold shadow-card @min-[88px]:flex"
    >
      {numeral ?? <Star className="h-[9cqw] w-[9cqw]" />}
    </span>
  );
}

function TitlePlate({ name }: { name: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-[12%] pb-[6%]">
      <span aria-hidden className="mb-[3%] flex w-[60%] items-center gap-[4%]">
        <span className="h-px flex-1 bg-gold/70" />
        <span className="h-[1.4cqw] min-h-[3px] w-[1.4cqw] min-w-[3px] rotate-45 bg-gold" />
        <span className="h-px flex-1 bg-gold/70" />
      </span>
      <span className="break-words text-center font-display text-[clamp(9px,11.5cqw,16px)] font-semibold leading-[1.15] text-gold [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
        {name}
      </span>
    </div>
  );
}

function Art({
  art,
  alt,
  sizes,
  priority,
  reversed,
}: {
  art: CardFaceArt;
  alt: string;
  sizes: string;
  priority: boolean;
  reversed: boolean;
}) {
  const box = art.engraved
    ? { className: cn("absolute inset-0", reversed && "rotate-180"), style: undefined }
    : {
        className: "absolute inset-x-0 top-0",
        style: {
          height: `${FALLBACK_ART_HEIGHT_PCT}%`,
          transform: reversed ? "rotate(180deg)" : undefined,
          transformOrigin: `50% ${FALLBACK_ART_ORIGIN_Y_PCT}%`,
        },
      };

  return (
    <div className={box.className} style={box.style}>
      <Image
        src={art.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "eager"}
        className={cn("object-cover", !art.engraved && "object-top")}
        style={art.engraved ? undefined : { filter: FALLBACK_FILTER }}
        draggable={false}
      />
    </div>
  );
}

export function TarotCardFace({
  card,
  sizes,
  reversed = false,
  priority = false,
  className,
}: TarotCardFaceProps) {
  const nameTh = card.nameTh ?? card.name;
  const art = cardFaceArt(card.image);

  return (
    <div
      data-testid="tarot-card-face"
      className={cn(
        "@container absolute inset-0 overflow-hidden rounded-[10px] border border-gold bg-bg",
        className
      )}
    >
      {art ? (
        <Art
          art={art}
          alt={`ไพ่${nameTh}${reversed ? " กลับหัว" : ""}`}
          sizes={sizes}
          priority={priority}
          reversed={reversed}
        />
      ) : null}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: art?.engraved === false ? `${FALLBACK_TINT}, ${OVERLAY}` : OVERLAY }}
      />
      <Frame />
      <Medallion numeral={cardNumeralTh(card)} />
      <TitlePlate name={nameTh} />
    </div>
  );
}

/**
 * Warms the browser cache for the faces the reveal row is about to flip, so
 * the front is already painted when the 3D turn shows it. Visually hidden;
 * `sizes` must match the reveal row so next/image requests the same URL.
 */
export function TarotFacePreload({ cards, sizes }: { cards: TarotCard[]; sizes: string }) {
  return (
    <div aria-hidden className="sr-only">
      {cards.map((card) => {
        const art = cardFaceArt(card.image);
        return art ? (
          <div key={card.id} className="relative h-px w-px">
            <Image src={art.src} alt="" fill sizes={sizes} loading="eager" />
          </div>
        ) : null;
      })}
    </div>
  );
}
