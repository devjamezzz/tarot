"use client";

import { Download, Lock, Share2, Sparkles } from "lucide-react";
import { AiTypingDots } from "@/components/ui/AiTypingDots";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrustPanel } from "@/components/reading/TrustPanel";
import { timeUntilTomorrow } from "./storage";

interface StepResultProps {
  isGenerating: boolean;
  error: string | null;
  image: string | null;
  topicLabel: string;
  colorNames: string[];
  luckyNumber: number | null;
  alreadyGenerated: boolean;
  canShare: boolean;
  onRetry: () => void;
  /** Leave the error state and return to the style step. */
  onBack: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export function StepResult({
  isGenerating,
  error,
  image,
  topicLabel,
  colorNames,
  luckyNumber,
  alreadyGenerated,
  canShare,
  onRetry,
  onBack,
  onDownload,
  onShare,
}: StepResultProps) {
  if (isGenerating) {
    return (
      <Card className="flex flex-col items-center gap-4 py-8" data-testid="wallpaper-generating">
        <Skeleton className="aspect-[9/16] w-full max-w-[200px]" />
        <AiTypingDots label="กำลังสร้างวอลเปเปอร์เสริมดวง…" />
        <p className="text-[13px] text-fg-muted">ใช้เวลาประมาณครึ่งนาที กรุณาอย่าปิดหน้านี้</p>
      </Card>
    );
  }

  if (error && !image) {
    return (
      <ErrorDisplay
        error={{ code: "WALLPAPER_ERROR", message: error, type: "api", retryable: true }}
        onRetry={onRetry}
        onDismiss={onBack}
      />
    );
  }

  if (!image) return null;

  return (
    <div className="space-y-5" data-testid="wallpaper-result">
      <figure className="mx-auto w-full max-w-[280px]">
        <div className="aspect-[9/16] overflow-hidden rounded-card border border-gold/60 bg-sunk shadow-card">
          {/* Generated image is a data URL, which next/image cannot optimise. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={`วอลเปเปอร์เสริมดวง${topicLabel}`} className="h-full w-full object-cover" />
        </div>
      </figure>

      <Card>
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <p className="font-display text-lg font-semibold text-fg">วอลเปเปอร์เสริมดวง{topicLabel}</p>
        </div>
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-fg-muted">
          {colorNames.length ? (
            <div className="flex gap-1">
              <dt>สีมงคล:</dt>
              <dd className="text-fg">{colorNames.join(", ")}</dd>
            </div>
          ) : null}
          {luckyNumber != null ? (
            <div className="flex gap-1">
              <dt>เลขมงคล:</dt>
              <dd className="tabular-nums text-fg">{luckyNumber}</dd>
            </div>
          ) : null}
        </dl>
      </Card>

      <div className="flex flex-col gap-3">
        <LineCtaButton
          label="ปรึกษาหมอดูทาง LINE"
          text={`ฉันเพิ่งสร้างวอลเปเปอร์เสริมดวง${topicLabel} อยากขอคำแนะนำเพิ่มเติม`}
        />
        <div className={canShare ? "grid grid-cols-2 gap-3" : "grid gap-3"}>
          <Button onClick={onDownload}>
            <Download strokeWidth={1.5} />
            ดาวน์โหลด
          </Button>
          {canShare ? (
            <Button variant="ghost" onClick={onShare}>
              <Share2 strokeWidth={1.5} />
              แชร์
            </Button>
          ) : null}
        </div>
      </div>

      {alreadyGenerated ? (
        <Card variant="sunk" className="text-center">
          <Lock className="mx-auto mb-2 size-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-sm font-medium text-fg">สร้างวอลเปเปอร์วันนี้แล้ว</p>
          <p className="mt-1 text-[13px] text-fg-muted">กลับมาสร้างใหม่ได้อีกใน {timeUntilTomorrow()}</p>
        </Card>
      ) : null}

      <TrustPanel
        computedFrom="สีมงคลจากทักษา ราศี และลัคนาของวันเกิด · เลขมงคลตามหมวดที่เลือก"
        confidence="ปานกลาง"
        aiUsed
      />
    </div>
  );
}
