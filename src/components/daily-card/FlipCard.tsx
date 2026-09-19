"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { DrawnCard } from "@/lib/tarot/types";

/** Local asset so the card back renders on preview deploys too. */
const BACK_IMAGE = "/card/backcard.png";
export const FLIP_DURATION_MS = 600;
export const CROSSFADE_DURATION_MS = 200;

export interface FlipCardProps {
  drawn: DrawnCard;
  flipped: boolean;
  onFlip: () => void;
}

const FACE_CLASS = "absolute inset-0 overflow-hidden rounded-[10px] border border-gold bg-surface";

/** Single tarot card: 3D flip on tap; opacity crossfade under reduced motion. */
export function FlipCard({ drawn, flipped, onFlip }: FlipCardProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const cardName = drawn.card.nameTh ?? drawn.card.name;
  const faceTransition = { duration: CROSSFADE_DURATION_MS / 1000 };

  return (
    <div className="flex justify-center" style={{ perspective: 1200 }}>
      <motion.button
        type="button"
        data-testid="daily-card-flip"
        onClick={onFlip}
        disabled={flipped}
        aria-pressed={flipped}
        aria-label={flipped ? `ไพ่ประจำวันของคุณคือ ${cardName}` : "แตะเพื่อเปิดไพ่ประจำวัน"}
        className={cn(
          "relative h-[310px] w-[200px] rounded-[10px] disabled:cursor-default",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          flipped ? "shadow-gold-glow" : "shadow-card animate-gold-pulse"
        )}
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={reducedMotion ? undefined : { rotateY: flipped ? 180 : 0 }}
        whileHover={!flipped && !reducedMotion ? { y: -6 } : undefined}
        whileTap={!flipped && !reducedMotion ? { scale: 0.98 } : undefined}
        transition={{ duration: FLIP_DURATION_MS / 1000, ease: "easeInOut" }}
      >
        {/* Back face */}
        <motion.div
          className={FACE_CLASS}
          style={{ backfaceVisibility: "hidden" }}
          initial={false}
          animate={reducedMotion ? { opacity: flipped ? 0 : 1 } : undefined}
          transition={faceTransition}
          aria-hidden={flipped}
        >
          <Image src={BACK_IMAGE} alt="หลังไพ่ทาโรต์" fill sizes="200px" priority className="object-cover" />
          {!flipped ? (
            <span className="absolute inset-x-0 bottom-4 flex justify-center">
              <span className="rounded-pill bg-gold-strong px-3 py-1 text-[13px] font-bold text-[color:var(--bg)]">
                แตะเพื่อเปิด
              </span>
            </span>
          ) : null}
        </motion.div>

        {/* Front face */}
        <motion.div
          className={FACE_CLASS}
          style={{
            backfaceVisibility: "hidden",
            transform: reducedMotion ? undefined : "rotateY(180deg)",
          }}
          initial={false}
          animate={reducedMotion ? { opacity: flipped ? 1 : 0 } : undefined}
          transition={faceTransition}
          aria-hidden={!flipped}
        >
          {drawn.card.image ? (
            <Image
              src={drawn.card.image}
              alt={`ไพ่ ${cardName}`}
              fill
              sizes="200px"
              className={cn("object-cover", drawn.orientation === "reversed" && "rotate-180")}
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-sunk px-4 text-center font-display text-lg text-gold">
              {cardName}
            </span>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
