"use client";

import { Calendar, Palette } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { BirthDateField, type BirthDateValue } from "@/components/ui/BirthDateField";
import type { AuspiciousColor, AuspiciousColorSet, BirthColorResult } from "@/lib/thai-astrology/colors";
import { ColorSwatch } from "./ColorSwatch";
import { StepHeader } from "./StepProgress";

interface StepBirthProps {
  birth: BirthDateValue | null;
  onBirthChange: (value: BirthDateValue | null) => void;
  birthTime: string;
  onTimeChange: (value: string) => void;
  birthColors: BirthColorResult | null;
  selectedColors: AuspiciousColor[];
  onToggleColor: (color: AuspiciousColor) => void;
  onCalculate: () => void;
}

function colorsOf(set: AuspiciousColorSet): AuspiciousColor[] {
  return [set.primary, set.secondary].filter((c): c is AuspiciousColor => Boolean(c));
}

export function StepBirth({
  birth,
  onBirthChange,
  birthTime,
  onTimeChange,
  birthColors,
  selectedColors,
  onToggleColor,
  onCalculate,
}: StepBirthProps) {
  const groups: AuspiciousColorSet[] = birthColors
    ? [birthColors.dayColors, birthColors.zodiacColors, birthColors.ascendantColors].filter(
        (set): set is AuspiciousColorSet => Boolean(set)
      )
    : [];

  return (
    <div className="space-y-5">
      <StepHeader icon={Calendar} title="กรอกวันเกิดของคุณ" caption="ระบบจะคำนวณสีมงคลจากทักษา ราศี และลัคนา" />

      <Card className="space-y-4">
        <BirthDateField id="wallpaper-birth" value={birth} onChange={onBirthChange} required />
        <div>
          <Label htmlFor="wallpaper-birth-time">เวลาเกิด (ไม่บังคับ — ใช้คำนวณลัคนา)</Label>
          <Input
            id="wallpaper-birth-time"
            type="time"
            value={birthTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="mt-2"
          />
        </div>
        {birth && !birthColors ? (
          <Button type="button" className="w-full" onClick={onCalculate}>
            <Palette strokeWidth={1.5} />
            คำนวณสีมงคล
          </Button>
        ) : null}
      </Card>

      {birthColors ? (
        <div className="space-y-4">
          <p className="text-center text-sm font-semibold text-fg">เลือกสีมงคล 1-2 สี สำหรับวอลเปเปอร์</p>
          {groups.map((set) => (
            <Card key={set.source} variant="sunk">
              <p className="eyebrow">{set.label}</p>
              <div className="mt-3 flex flex-wrap gap-3" role="group" aria-label={set.label}>
                {colorsOf(set).map((c) => (
                  <ColorSwatch
                    key={c.hex}
                    color={c}
                    selected={selectedColors.some((s) => s.hex === c.hex)}
                    onToggle={() => onToggleColor(c)}
                  />
                ))}
              </div>
            </Card>
          ))}
          <p className="text-center text-[13px] text-fg-muted" aria-live="polite">
            {selectedColors.length
              ? `สีที่เลือก: ${selectedColors.map((c) => c.nameTh).join(", ")}`
              : "แตะสีเพื่อเลือก"}
          </p>
        </div>
      ) : null}
    </div>
  );
}
