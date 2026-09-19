import Image from "next/image";
import type { Orientation, TarotCard } from "@/lib/tarot/types";
import { cn } from "@/lib/cn";
import { cardNameTh, orientationTh } from "./labels";

export interface CardFigureProps {
  card: TarotCard;
  orientation?: Orientation;
  /** Gold eyebrow above the name, e.g. "ไพ่ราศี". */
  label?: string;
  /** Hide the English name under the Thai one. */
  hideEnglish?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * A tarot card image with its Thai name — the one way every page shows a
 * drawn card (gold frame, 10px radius, name strip below).
 */
export function CardFigure({
  card,
  orientation = "upright",
  label,
  hideEnglish = false,
  priority = false,
  sizes = "(max-width: 640px) 45vw, 220px",
  className,
}: CardFigureProps) {
  const nameTh = cardNameTh(card);
  const reversed = orientation === "reversed";

  return (
    <figure className={cn("w-full", className)}>
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[10px] border border-gold/60 bg-sunk shadow-card">
        {card.image ? (
          <Image
            src={card.image}
            alt={`ไพ่${nameTh}${reversed ? " (กลับหัว)" : ""}`}
            fill
            sizes={sizes}
            priority={priority}
            className={cn("object-cover", reversed && "rotate-180")}
          />
        ) : null}
      </div>
      <figcaption className="mt-2 text-center">
        {label ? <p className="eyebrow">{label}</p> : null}
        <p className="font-display text-base font-semibold leading-snug text-fg">{nameTh}</p>
        {!hideEnglish && card.nameTh ? (
          <p className="text-[13px] text-fg-muted">{card.name}</p>
        ) : null}
        {reversed ? (
          <span className="mt-1 inline-flex rounded-pill border border-warning/40 bg-warning/10 px-2 py-0.5 text-[13px] text-warning">
            {orientationTh("reversed")}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
