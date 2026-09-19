"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type EsiimsiPhase = "idle" | "shaking" | "revealed";

// ข้อยกเว้นสีเฉพาะภาพประกอบ: กระบอกแดง-ทองของศาลเจ้า (brief §1.5 ข้อ 6)
// พื้นหลังยังเป็น --bg ของระบบ ไม่มีพื้นดำ
const CUP_GRADIENT = "bg-gradient-to-br from-[#7f1d1d] via-[#b91c1c] to-[#450a0a]";
const BAMBOO_GRADIENT = "bg-gradient-to-b from-[#d4a373] to-[#8b4513]";

const STICK_COUNT = 18;
const SHAKE = {
  x: [0, -10, 12, -14, 9, -7, 11, -8, 5, 0],
  rotate: [0, -7, 8, -10, 6, -5, 7, -6, 3, 0],
};
const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * ตราทองหน้ากระบอก — วาดเป็น SVG ในไฟล์ แทนอักษรจีนเดิมที่ฟอนต์ Trirong/Playfair
 * ไม่มี glyph (บางเครื่องแสดงเป็นกล่องเปล่า) เพื่อให้เห็นเหมือนกันทุกอุปกรณ์
 */
function CupEmblem() {
  return (
    <svg
      viewBox="0 0 96 96"
      className="h-[84px] w-[84px] text-gold drop-shadow-[0_0_14px_rgba(226,196,138,0.45)]"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <circle cx="48" cy="48" r="44" strokeWidth="2.5" />
      <circle cx="48" cy="48" r="37" strokeWidth="1" opacity="0.55" />
      {PETALS.map((deg) => (
        <path
          key={deg}
          d="M48 17C56 27 57 39 48 48C39 39 40 27 48 17Z"
          strokeWidth="1.6"
          fill="currentColor"
          fillOpacity="0.16"
          transform={`rotate(${deg} 48 48)`}
        />
      ))}
      <circle cx="48" cy="48" r="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export type EsiimsiCylinderProps = {
  phase: EsiimsiPhase;
  /** หมายเลขติ้วที่หลุดออกมา (แสดงเมื่อ phase = revealed) */
  number: number | null;
  /** prefers-reduced-motion: ไม่เขย่า ไม่เด้ง ใช้ crossfade แทน */
  reduced: boolean;
  className?: string;
};

export function EsiimsiCylinder({ phase, number, reduced, className }: EsiimsiCylinderProps) {
  const shaking = phase === "shaking" && !reduced;
  const revealed = phase === "revealed" && number !== null;

  return (
    <div
      aria-hidden="true"
      className={cn("relative mx-auto h-[330px] w-[240px] select-none", className)}
    >
      <motion.div
        className="absolute inset-0"
        animate={shaking ? SHAKE : { x: 0, rotate: 0, scale: revealed && !reduced ? 0.86 : 1 }}
        transition={
          shaking
            ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.35, ease: "easeOut" }
        }
        style={{ originY: 1 }}
      >
        {/* ติ้วในกระบอก (ส่วนที่โผล่พ้นปาก) */}
        <div className="absolute bottom-[120px] left-1/2 z-10 flex -translate-x-1/2 items-end">
          {Array.from({ length: STICK_COUNT }, (_, i) => (
            <motion.div
              key={i}
              className={cn("-ml-[3px] h-36 w-1.5 rounded-pill border-b border-black/30", BAMBOO_GRADIENT)}
              style={{ rotate: (i - (STICK_COUNT - 1) / 2) * 4, originY: 1, opacity: revealed ? 0.45 : 1 }}
              animate={shaking ? { y: [0, -26, 0] } : { y: 0 }}
              transition={
                shaking
                  ? { duration: 0.2, repeat: Infinity, delay: i * 0.03, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
            />
          ))}
        </div>

        {/* กระบอกแดง-ทอง */}
        <div className="absolute bottom-0 left-1/2 z-20 h-56 w-44 -translate-x-1/2">
          <div
            className={cn(
              "absolute inset-0 overflow-hidden rounded-b-[16px] border-x-4 border-b-8 border-gold-strong/40",
              "shadow-[0_28px_60px_-16px_rgba(0,0,0,0.75)]",
              CUP_GRADIENT
            )}
          >
            <div className="absolute inset-x-0 top-10 flex flex-col items-center">
              <CupEmblem />
              <span className="mt-2 font-display text-[15px] font-semibold leading-none text-gold">
                เซียมซี
              </span>
              <span className="mt-3 h-px w-14 bg-gold/40" />
            </div>
            <div className="absolute left-5 top-0 h-full w-8 -skew-x-12 bg-white/5 blur-md" />
          </div>
          {/* ขอบปากกระบอก */}
          <div className="absolute inset-x-0 top-0 h-7 rounded-pill border-t border-gold/20 bg-black/60 shadow-inner" />
        </div>

        {/* ติ้วที่หลุดออกมา พร้อมเลขใบ */}
        <AnimatePresence>
          {revealed ? (
            <div className="absolute bottom-[190px] left-1/2 z-30 -translate-x-1/2">
              <motion.div
                key={number}
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 150, scaleY: 0.6 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0 }}
                transition={
                  reduced
                    ? { duration: 0.2 }
                    : { type: "spring", stiffness: 240, damping: 18, mass: 0.9 }
                }
                style={{ originY: 1 }}
                className={cn(
                  "flex h-[140px] w-8 flex-col items-center rounded-[10px] border border-gold/60 pt-3",
                  "bg-gradient-to-b from-gold to-gold-strong shadow-[var(--gold-glow)]"
                )}
              >
                <span className="font-display text-2xl font-semibold leading-none text-bg tabular-nums">
                  {number}
                </span>
                <span className="mt-3 w-px flex-1 bg-bg/20" />
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
