"use client";

import { Type } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import type { LuckyElementsResult } from "@/lib/thai-astrology/luckyElements";
import { MAX_CUSTOM_TEXT } from "./constants";
import { StepHeader } from "./StepProgress";

interface StepCustomizeProps {
  luckyElements: LuckyElementsResult | null;
  selectedElements: string[];
  onToggleElement: (id: string) => void;
  customText: string;
  onTextChange: (value: string) => void;
}

export function StepCustomize({
  luckyElements,
  selectedElements,
  onToggleElement,
  customText,
  onTextChange,
}: StepCustomizeProps) {
  const preview = customText.trim();

  return (
    <div className="space-y-5">
      <StepHeader icon={Type} title="ปรับแต่งภาพ" caption="เลือกองค์ประกอบและข้อความ (ไม่บังคับ)" />

      {luckyElements ? (
        <div>
          <p className="text-sm font-semibold text-fg">องค์ประกอบมงคลสำหรับคุณ</p>
          <p className="mb-3 text-[13px] text-fg-muted">คำนวณจากวัน/เดือน/ปีเกิด</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="องค์ประกอบมงคล">
            {luckyElements.elements.map((el) => (
              <Chip key={el.id} selected={selectedElements.includes(el.id)} onClick={() => onToggleElement(el.id)}>
                {el.label}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <Label htmlFor="wallpaper-custom-text">เพิ่มข้อความในภาพ</Label>
        <p className="mb-3 mt-1 text-[13px] text-fg-muted">ข้อความเล็ก ๆ ใต้รูปเหมือนลายเซ็นศิลปิน (ไม่บังคับ)</p>
        <div className="relative">
          <Input
            id="wallpaper-custom-text"
            type="text"
            value={customText}
            maxLength={MAX_CUSTOM_TEXT}
            onChange={(e) => onTextChange(e.target.value.slice(0, MAX_CUSTOM_TEXT))}
            placeholder={`พิมพ์ข้อความ (สูงสุด ${MAX_CUSTOM_TEXT} ตัว)`}
            className="pr-16"
          />
          <span
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[13px] tabular-nums text-fg-muted"
            aria-live="polite"
          >
            {customText.length}/{MAX_CUSTOM_TEXT}
          </span>
        </div>

        {preview ? (
          <Card variant="sunk" className="mt-3 text-center">
            <p className="font-display text-base italic tracking-wide text-fg">— {preview} —</p>
            <p className="mt-1 text-[13px] text-fg-muted">ตัวอย่างลายเซ็นข้อความ</p>
          </Card>
        ) : null}
      </div>

      <p className="text-center text-[13px] text-fg-muted">ข้ามได้เลย ถ้าไม่ต้องการปรับแต่ง</p>
    </div>
  );
}
