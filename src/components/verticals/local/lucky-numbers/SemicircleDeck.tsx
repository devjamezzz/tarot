"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { LuckyDigit } from "@/lib/lucky-numbers/engine";
import { EASE_OUT, LUCKY_BACK_IMAGE } from "./constants";

interface SemicircleDeckProps {
  roundKey: number;
  deck: LuckyDigit[];
  pickingIndex: number | null;
  onPick: (idx: number) => void;
}

// Half-circle (top hemisphere): spread from -75° to +75°.
const ANGLE_RANGE = 150;
const START_ANGLE = -ANGLE_RANGE / 2;

function deckLayoutForWidth(width: number) {
  const w = Math.max(280, Math.min(width, 460));
  // Card width clamps so 10 cards stay touch-friendly without overlapping.
  const cardW = Math.round(Math.max(48, Math.min(72, w / 6.2)));
  const cardH = Math.round(cardW * 1.55);
  // Keep the outermost card inside the container.
  const safeHalfWidth = w / 2 - cardW * 0.55;
  const radius = Math.round(
    Math.max(110, Math.min(safeHalfWidth / Math.sin((75 * Math.PI) / 180), 210))
  );
  // Container height fits the arc plus card body comfortably.
  const height = Math.max(290, radius + cardH * 0.45 + 30);
  return { radius, cardW, cardH, height };
}

/** Face-down fan of 10 cards that responds to viewport width. */
export function SemicircleDeck({ roundKey, deck, pickingIndex, onPick }: SemicircleDeckProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ radius, cardW, cardH, height }, setLayout] = useState(() => deckLayoutForWidth(360));

  useEffect(() => {
    const measure = () => {
      const w = containerRef.current?.clientWidth ?? 360;
      setLayout(deckLayoutForWidth(w));
    };
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const step = ANGLE_RANGE / (deck.length - 1);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-md">
      <div className="relative mx-auto w-full" style={{ height }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`fan-${roundKey}`}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            transition={{ duration: reduce ? 0.2 : 0.4, ease: EASE_OUT }}
            className="absolute inset-0"
          >
            {deck.map((digit, idx) => {
              const angle = START_ANGLE + step * idx;
              const isPicking = pickingIndex === idx;
              const isOther = pickingIndex !== null && !isPicking;

              return (
                <div
                  key={`${roundKey}-${idx}`}
                  className="absolute bottom-0 left-1/2"
                  style={{
                    transform: `translateX(-50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`,
                    transformOrigin: "50% 100%",
                  }}
                >
                  <motion.button
                    type="button"
                    onClick={() => onPick(idx)}
                    disabled={pickingIndex !== null}
                    aria-label={`ไพ่ใบที่ ${idx + 1}`}
                    aria-pressed={isPicking}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.85 }}
                    animate={{
                      opacity: isOther ? 0.18 : 1,
                      y: !reduce && isPicking ? -42 : 0,
                      scale: !reduce && isPicking ? 1.18 : 1,
                      filter: isPicking ? "brightness(1.4)" : "brightness(1)",
                    }}
                    transition={{
                      duration: reduce ? 0.2 : 0.55,
                      delay: !reduce && pickingIndex === null ? 0.03 * idx : 0,
                      ease: EASE_OUT,
                    }}
                    whileHover={!reduce && pickingIndex === null ? { y: -10, scale: 1.06 } : undefined}
                    className="relative block rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    style={{ width: cardW, height: cardH }}
                    data-digit-index={idx}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute -inset-2 rounded-sheet opacity-0 blur-md transition-opacity duration-500",
                        isPicking && "opacity-100"
                      )}
                      style={{
                        background:
                          "radial-gradient(circle at 50% 50%, rgba(226,196,138,0.65) 0%, rgba(110,76,122,0.35) 45%, transparent 75%)",
                      }}
                    />
                    <span className="relative block h-full w-full overflow-hidden rounded-[10px] border border-gold/40 shadow-card">
                      <Image
                        src={LUCKY_BACK_IMAGE}
                        alt=""
                        fill
                        sizes={`${cardW}px`}
                        className="object-cover"
                        priority={idx < 5}
                      />
                    </span>
                  </motion.button>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-2 text-center text-[13px] text-fg-muted">
        แตะใบที่รู้สึกว่า &ldquo;ใช่&rdquo; ที่สุด
      </p>
    </div>
  );
}
