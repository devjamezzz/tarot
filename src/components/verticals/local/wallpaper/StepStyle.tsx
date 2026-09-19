"use client";

import { Palette } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { AuspiciousColor } from "@/lib/thai-astrology/colors";
import { STYLES, type WallpaperStyle } from "./constants";
import { StepHeader } from "./StepProgress";

interface StepStyleProps {
  selectedStyle: WallpaperStyle;
  onSelectStyle: (style: WallpaperStyle) => void;
  selectedColors: AuspiciousColor[];
  topicLabel: string;
  luckyNumber: number | null;
  elementLabels: string[];
  customText: string;
}

export function StepStyle({
  selectedStyle,
  onSelectStyle,
  selectedColors,
  topicLabel,
  luckyNumber,
  elementLabels,
  customText,
}: StepStyleProps) {
  const styleLabel = STYLES.find((s) => s.id === selectedStyle)?.label ?? "";
  const text = customText.trim();

  return (
    <div className="space-y-5">
      <StepHeader icon={Palette} title="เลือกสไตล์ภาพ" caption="เลือกบรรยากาศของวอลเปเปอร์" />

      <div className="grid grid-cols-2 gap-3" role="group" aria-label="สไตล์ภาพ">
        {STYLES.map((s) => {
          const active = selectedStyle === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectStyle(s.id)}
              aria-pressed={active}
              className={cn(
                "rounded-card border p-5 text-center transition-[border-color,background-color,transform] active:scale-[.97] motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                active ? "border-gold bg-gold-soft" : "border-line bg-surface hover:border-gold/60"
              )}
            >
              <Icon className={cn("mx-auto size-8", active ? "text-gold" : "text-fg-muted")} strokeWidth={1.5} aria-hidden="true" />
              <p className="mt-2 font-display text-base font-semibold text-fg">{s.label}</p>
              <p className="mt-1 text-[13px] text-fg-muted">{s.desc}</p>
            </button>
          );
        })}
      </div>

      <Card variant="sunk">
        <p className="eyebrow">สรุปก่อนสร้าง</p>
        <dl className="mt-2 space-y-2 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <dt className="text-fg-muted">สี:</dt>
            {selectedColors.map((c) => (
              <dd key={c.hex} className="flex items-center gap-1 text-fg">
                <span className="inline-block h-4 w-4 rounded-pill border border-line-faint" style={{ backgroundColor: c.hex }} aria-hidden="true" />
                {c.nameTh}
              </dd>
            ))}
          </div>
          <div className="flex gap-2">
            <dt className="text-fg-muted">เรื่อง:</dt>
            <dd className="text-fg">{topicLabel}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-fg-muted">เลขมงคล:</dt>
            <dd className="tabular-nums text-fg">{luckyNumber ?? "-"}</dd>
          </div>
          {elementLabels.length ? (
            <div className="flex gap-2">
              <dt className="shrink-0 text-fg-muted">องค์ประกอบ:</dt>
              <dd className="text-fg">{elementLabels.join(", ")}</dd>
            </div>
          ) : null}
          {text ? (
            <div className="flex gap-2">
              <dt className="text-fg-muted">ข้อความ:</dt>
              <dd className="font-display italic text-fg">— {text} —</dd>
            </div>
          ) : null}
          <div className="flex gap-2">
            <dt className="text-fg-muted">สไตล์:</dt>
            <dd className="text-fg">{styleLabel}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
