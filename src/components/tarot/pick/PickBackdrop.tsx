"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { CARD_ASPECT_CLASS, CARD_BACK_LARGE_SRC } from "@/lib/tarot/pick/assets";

type Ghost = {
  className: string;
  width: number;
  rotate: number;
  /** Float cycle in seconds. */
  duration: number;
};

// Faint card backs drifting behind the table (aitarot ritual backdrop).
const GHOSTS: Ghost[] = [
  { className: "-left-6 top-2", width: 96, rotate: -14, duration: 9 },
  { className: "-right-4 top-16", width: 84, rotate: 12, duration: 11 },
  { className: "left-10 bottom-8", width: 72, rotate: 8, duration: 10 },
  { className: "right-12 bottom-20", width: 90, rotate: -10, duration: 12 },
  { className: "left-[44%] -top-6", width: 64, rotate: 4, duration: 8 },
];

export function PickBackdrop({ reduced }: { reduced: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-x-4 -top-10 -bottom-6 -z-10 overflow-hidden"
    >
      {GHOSTS.map((ghost, i) => (
        <motion.div
          key={i}
          className={cn("absolute opacity-10", CARD_ASPECT_CLASS, ghost.className)}
          style={{ width: ghost.width }}
          initial={{ rotate: ghost.rotate }}
          animate={
            reduced
              ? { rotate: ghost.rotate }
              : { y: [0, -10, 0], rotate: [ghost.rotate, ghost.rotate + 3, ghost.rotate] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: ghost.duration, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Image
            src={CARD_BACK_LARGE_SRC}
            alt=""
            fill
            sizes="96px"
            className="rounded-[10px] object-cover"
            draggable={false}
          />
        </motion.div>
      ))}
    </div>
  );
}
