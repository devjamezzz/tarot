"use client";

import * as React from "react";
import { Orbit } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { InlineError } from "@/components/ui/ErrorDisplay";
import { BirthDateField, type BirthDateValue } from "@/components/ui/BirthDateField";
import type { BirthInput, ChartSystem } from "@/lib/astrology/types";
import {
  PROVINCES_BY_REGION,
  REGION_NAMES,
  findProvince,
  type ThaiRegion,
} from "@/lib/astrology/thai-provinces";

const REGION_ORDER: ThaiRegion[] = ["central", "east", "north", "northeast", "south", "west"];

export const CHART_SYSTEMS: Array<{ id: ChartSystem; label: string }> = [
  { id: "suriyayatra", label: "สุริยยาตร์ (ไทย)" },
  { id: "lahiri", label: "นิรายนะ (Lahiri)" },
];

const DEFAULT_PROVINCE = "bangkok";
const ICT_OFFSET_HOURS = 7;

export interface ChartFormProps {
  initial?: Partial<BirthInput>;
  initialSystem?: ChartSystem;
  onSubmit: (input: BirthInput, system: ChartSystem) => void;
  className?: string;
}

const selectClass = cn(
  "h-12 w-full rounded-xl border border-line bg-sunk px-3 text-base text-fg outline-none",
  "focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40"
);

function initialBirth(initial?: Partial<BirthInput>): BirthDateValue | null {
  if (initial?.year && initial?.month && initial?.day) {
    return { year: initial.year, month: initial.month, day: initial.day };
  }
  return null;
}

export function ChartForm({ initial, initialSystem = "suriyayatra", onSubmit, className }: ChartFormProps) {
  const [birth, setBirth] = React.useState<BirthDateValue | null>(() => initialBirth(initial));
  const [hour, setHour] = React.useState(String(initial?.hour ?? 6));
  const [minute, setMinute] = React.useState(String(initial?.minute ?? 20));
  const [provinceId, setProvinceId] = React.useState(DEFAULT_PROVINCE);
  const [system, setSystem] = React.useState<ChartSystem>(initialSystem);
  const [error, setError] = React.useState("");

  const hourNum = Number(hour);
  const minuteNum = Number(minute);
  const timeValid =
    hour !== "" &&
    minute !== "" &&
    Number.isInteger(hourNum) &&
    hourNum >= 0 &&
    hourNum <= 23 &&
    Number.isInteger(minuteNum) &&
    minuteNum >= 0 &&
    minuteNum <= 59;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birth) {
      setError("กรุณากรอกวันเกิดให้ครบ");
      return;
    }
    if (!timeValid) {
      setError("กรุณาใส่เวลาเกิดเป็นชั่วโมง 0-23 และนาที 0-59");
      return;
    }
    const province = findProvince(provinceId);
    if (!province) {
      setError("กรุณาเลือกจังหวัดที่เกิด");
      return;
    }
    setError("");
    onSubmit(
      {
        year: birth.year,
        month: birth.month,
        day: birth.day,
        hour: hourNum,
        minute: minuteNum,
        timezoneHours: ICT_OFFSET_HOURS,
        latitude: province.latitude,
        longitude: province.longitude,
      },
      system
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)} noValidate>
      <div>
        <p className="mb-2 text-sm font-medium text-fg">ระบบคำนวณ</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="ระบบคำนวณ">
          {CHART_SYSTEMS.map((s) => (
            <Chip key={s.id} selected={system === s.id} onClick={() => setSystem(s.id)}>
              {s.label}
            </Chip>
          ))}
        </div>
      </div>

      <BirthDateField id="chart-birth" value={birth} onChange={setBirth} required />

      <div>
        <p className="mb-2 text-sm font-medium text-fg">เวลาเกิด</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="chart-hour" className="mb-1 text-xs text-fg-muted">
              ชั่วโมง
            </Label>
            <Input
              id="chart-hour"
              type="number"
              inputMode="numeric"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => setHour(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="chart-minute" className="mb-1 text-xs text-fg-muted">
              นาที
            </Label>
            <Input
              id="chart-minute"
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
            />
          </div>
        </div>
        <p className="mt-1 text-[13px] text-fg-subtle">เวลามาตรฐาน ICT (UTC+7)</p>
      </div>

      <div>
        <Label htmlFor="chart-province" className="mb-2">
          จังหวัดที่เกิด
        </Label>
        <select
          id="chart-province"
          value={provinceId}
          onChange={(e) => setProvinceId(e.target.value)}
          className={selectClass}
        >
          {REGION_ORDER.map((region) => (
            <optgroup key={region} label={REGION_NAMES[region]}>
              {PROVINCES_BY_REGION[region].map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <p className="mt-1 text-[13px] text-fg-subtle">77 จังหวัด · ใช้พิกัดของอำเภอเมือง</p>
      </div>

      {error ? <InlineError message={error} /> : null}

      <Button type="submit" size="lg" className="w-full">
        <Orbit strokeWidth={1.5} />
        คำนวณดวงชะตา
      </Button>
    </form>
  );
}
