"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import type { LuckyDigitCount } from "@/lib/lucky-numbers/engine";
import { EASE_OUT, PICK_CHOICES } from "./constants";

export function CountChooser({ onChoose }: { onChoose: (count: LuckyDigitCount) => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.5, ease: EASE_OUT }}
    >
      <Card className="mt-4 space-y-5">
        <div>
          <h2 className="font-display text-[22px] font-semibold leading-snug text-fg">เลือกจำนวนหลักก่อนเปิดไพ่</h2>
          <p className="mt-1 text-sm text-fg-muted">
            คุณจะหยิบไพ่จาก 10 ใบ (เลข 0-9) ทีละใบ ครบจำนวนแล้วจึงเปิดเผยผลพร้อมกัน
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3" role="group" aria-label="จำนวนหลัก">
          {PICK_CHOICES.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => onChoose(choice)}
              className="flex min-h-[96px] flex-col items-center justify-center gap-1 rounded-card border border-line bg-sunk text-fg transition-[transform,border-color,box-shadow] hover:border-gold hover:shadow-gold-glow active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg motion-reduce:transition-none"
            >
              <span className="font-sans text-3xl font-bold tabular-nums text-gold">{choice}</span>
              <span className="text-[13px] text-fg-muted">หลัก</span>
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
