"use client";

import Image from "next/image";
import { ChevronLeft, Flame } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { LuckyDigit, LuckyDigitCount } from "@/lib/lucky-numbers/engine";
import { EASE_OUT, LUCKY_BACK_IMAGE } from "./constants";
import { SemicircleDeck } from "./SemicircleDeck";

interface PickStageProps {
  count: LuckyDigitCount;
  picked: LuckyDigit[];
  deck: LuckyDigit[];
  pickingIndex: number | null;
  onPick: (idx: number) => void;
  onChangeCount: () => void;
}

export function PickStage({ count, picked, deck, pickingIndex, onPick, onChangeCount }: PickStageProps) {
  const reduce = useReducedMotion();
  const current = Math.min(picked.length + 1, count);

  return (
    <section className="mt-4 space-y-5">
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.2 : 0.4, ease: EASE_OUT }}
      >
        <Card className="relative overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" onClick={onChangeCount}>
              <ChevronLeft strokeWidth={1.5} />
              เปลี่ยนจำนวน
            </Button>
            <p
              aria-live="polite"
              className="font-sans text-sm font-bold tracking-[0.12em] tabular-nums text-gold"
            >
              หยิบใบที่ {current} / {count}
            </p>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-card border border-gold/40 bg-gold-soft px-4 py-3 text-sm leading-relaxed text-fg">
            <Flame className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <p>
              หลับตา หายใจเข้าลึก ๆ ระลึกถึง<strong className="text-gold">เทวดาประจำตัว</strong>หรือ
              <strong className="text-gold">สิ่งศักดิ์สิทธิ์ที่คุณนับถือ</strong> น้อมจิตขอพร ขอเลขนำโชค
              แล้วแตะใบที่รู้สึก &ldquo;ใช่&rdquo; ที่สุด
            </p>
          </div>

          <ol className="mt-4 flex justify-center gap-2" aria-label="ไพ่ที่หยิบแล้ว">
            {Array.from({ length: count }).map((_, i) => {
              const filled = i < picked.length;
              return (
                <li
                  key={i}
                  aria-label={filled ? `ใบที่ ${i + 1} หยิบแล้ว` : `ใบที่ ${i + 1} ยังไม่ได้หยิบ`}
                  className={cn(
                    "relative h-16 w-12 overflow-hidden rounded-[10px] border transition-[border-color,box-shadow]",
                    filled ? "border-gold shadow-gold-glow" : "border-line-faint bg-sunk"
                  )}
                >
                  {filled ? (
                    <Image src={LUCKY_BACK_IMAGE} alt="" fill sizes="48px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[13px] tabular-nums text-fg-subtle">
                      {i + 1}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </Card>
      </motion.div>

      <SemicircleDeck roundKey={picked.length} deck={deck} pickingIndex={pickingIndex} onPick={onPick} />
    </section>
  );
}
