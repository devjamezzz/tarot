"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Download, RefreshCw, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { ReadingResultShell } from "@/components/reading/ReadingResultShell";
import { Toast, useToast } from "@/components/verticals/local/Toast";
import { formatThaiDate } from "@/lib/format/thaiDate";
import { cn } from "@/lib/cn";
import type { LuckyDigitAnalysis } from "@/lib/lucky-numbers/engine";
import { EASE_OUT, LUCKY_BACK_IMAGE, REVEAL_STAGGER_MS, luckyDigitImage } from "./constants";
import { SHARE_CARD_BG, ShareCard } from "./ShareCard";

interface LuckyResultProps {
  analysis: LuckyDigitAnalysis;
  onReset: () => void;
}

function FlipCard({ digit, flipped, reduce }: { digit: number; flipped: boolean; reduce: boolean }) {
  const back = (
    <div className="absolute inset-0 overflow-hidden rounded-[10px] border border-gold/40 shadow-card [backface-visibility:hidden]">
      <Image src={LUCKY_BACK_IMAGE} alt="" fill sizes="96px" className="object-cover" />
    </div>
  );
  const face = (
    <div className="absolute inset-0 overflow-hidden rounded-[10px] border border-gold shadow-gold-glow [backface-visibility:hidden] [transform:rotateY(180deg)] motion-reduce:[transform:none]">
      <Image src={luckyDigitImage(digit)} alt={`ไพ่เลข ${digit}`} fill sizes="96px" className="object-cover" />
    </div>
  );

  if (reduce) {
    return (
      <div className="relative h-32 w-20 sm:h-36 sm:w-24">
        <div key={flipped ? "face" : "back"} className="motion-safe-fade absolute inset-0">
          {flipped ? face : back}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-32 w-20 [perspective:900px] sm:h-36 sm:w-24">
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {back}
        {face}
      </motion.div>
    </div>
  );
}

/** Result stage: cards flip one by one, then meanings, share and LINE CTA. */
export function LuckyResult({ analysis, onReset }: LuckyResultProps) {
  const reduce = useReducedMotion() ?? false;
  const toast = useToast();
  const shareableRef = useRef<HTMLDivElement>(null);
  const [revealCount, setRevealCount] = useState(0);
  const [busy, setBusy] = useState<null | "share" | "download">(null);
  const readAt = useMemo(() => formatThaiDate(new Date()), []);

  // Auto-reveal cards one-by-one once we land on the result stage.
  useEffect(() => {
    const stagger = reduce ? 250 : REVEAL_STAGGER_MS;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= analysis.digits.length; i += 1) {
      timers.push(setTimeout(() => setRevealCount(i), i * stagger));
    }
    return () => timers.forEach(clearTimeout);
  }, [analysis, reduce]);

  const allRevealed = revealCount >= analysis.digits.length;
  const fileName = `reffortune-lucky-${analysis.combined}.png`;

  async function generateImage(): Promise<string | null> {
    if (!shareableRef.current) return null;
    return toPng(shareableRef.current, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: SHARE_CARD_BG,
      cacheBust: true,
    });
  }

  function triggerDownload(dataUrl: string) {
    const link = document.createElement("a");
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  }

  async function handleDownload() {
    setBusy("download");
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) return;
      triggerDownload(dataUrl);
      toast.show("บันทึกรูปแล้ว");
    } catch {
      toast.show("ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setBusy(null);
    }
  }

  async function handleShare() {
    setBusy("share");
    try {
      const dataUrl = await generateImage();
      if (!dataUrl) return;

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };

      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({
          title: "ไพ่เลขมงคลของฉัน — REFFORTUNE",
          text: `เลขมงคลที่ฉันหยิบได้: ${analysis.combined}`,
          files: [file],
        });
        return;
      }

      // No file sharing on this device: save the image instead.
      triggerDownload(dataUrl);
      toast.show("บันทึกรูปแล้ว");
    } catch {
      // User cancelled the share sheet — nothing to report.
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <ReadingResultShell
        label="เลขมงคล"
        title="ชุดเลขมงคลของคุณ"
        caption={`${analysis.count} หลัก · ${readAt}`}
        backHref="/explore"
        computed={
          <div className="space-y-4">
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0.2 : 0.45, ease: EASE_OUT }}
            >
              <Card>
                <p className="eyebrow">ไพ่ที่คุณหยิบ</p>
                <p className="mt-1 text-sm text-fg-muted" aria-live="polite">
                  {allRevealed
                    ? `ผลรวม ${analysis.sum} · เลขราก ${analysis.root}`
                    : `เปิดแล้ว ${revealCount} / ${analysis.digits.length} ใบ`}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  {analysis.digits.map((d, i) => {
                    const flipped = i < revealCount;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <FlipCard digit={d} flipped={flipped} reduce={reduce} />
                        <span
                          className={cn(
                            "text-[13px] text-fg-muted transition-opacity duration-300",
                            flipped ? "opacity-100" : "opacity-0"
                          )}
                        >
                          ใบที่ {i + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {allRevealed ? (
                    <motion.p
                      key="combined"
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: reduce ? 0.2 : 0.5 }}
                      className="mt-6 text-center font-sans text-4xl font-bold tracking-[0.3em] tabular-nums text-gold"
                      aria-label={`เลขมงคล ${analysis.combined}`}
                    >
                      {analysis.combined}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </Card>
            </motion.div>

            {allRevealed ? (
              <Card className="motion-safe-fade animate-fade-up">
                <p className="eyebrow">ความหมายตามตำรา</p>
                <p className="mt-2 text-base leading-[1.65] text-fg">{analysis.reading}</p>
                <ul className="mt-4 space-y-3">
                  {analysis.meanings.map((m, i) => (
                    <li key={`${m.digit}-${i}`} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-gold bg-gold-soft font-sans text-base font-bold tabular-nums text-gold">
                        {m.digit}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-fg">{m.keywordTh}</p>
                        <p className="text-[13px] leading-relaxed text-fg-muted">{m.reasonTh}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>
        }
        cta={
          allRevealed ? (
            <div className="motion-safe-fade animate-fade-up flex flex-col gap-3">
              <LineCtaButton
                label="ส่งเลขให้หมอดูทาง LINE"
                text={`เลขมงคลที่ฉันหยิบได้: ${analysis.combined} (ผลรวม ${analysis.sum} เลขราก ${analysis.root})`}
              />
              <div className="grid grid-cols-3 gap-2">
                <Button variant="ghost" className="px-2" disabled={busy !== null} onClick={handleShare}>
                  <Share2 strokeWidth={1.5} />
                  แชร์รูป
                </Button>
                <Button variant="ghost" className="px-2" disabled={busy !== null} onClick={handleDownload}>
                  <Download strokeWidth={1.5} />
                  บันทึกรูป
                </Button>
                <Button variant="ghost" className="px-2" onClick={onReset}>
                  <RefreshCw strokeWidth={1.5} />
                  เริ่มใหม่
                </Button>
              </div>
            </div>
          ) : null
        }
        trust={{
          computedFrom: "ไพ่ที่คุณหยิบเอง ผลรวมและเลขรากตามหลักเลขศาสตร์",
          confidence: "ปานกลาง",
          aiUsed: false,
        }}
      />

      {/* Off-screen share template — rendered once all flips have happened so html-to-image captures the final state. */}
      {allRevealed ? <ShareCard ref={shareableRef} analysis={analysis} /> : null}
      <Toast message={toast.message} />
    </>
  );
}
