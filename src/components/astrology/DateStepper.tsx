"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { THAI_MONTHS_SHORT, toBuddhistYear } from "@/lib/format/thaiDate";

export interface DateValue {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export interface DateStepperProps {
  value: DateValue;
  onChange: (v: DateValue) => void;
  className?: string;
}

type Field = "year" | "month" | "day" | "hour";

const FIELD_TH: Record<Field, string> = {
  year: "ปี",
  month: "เดือน",
  day: "วัน",
  hour: "ชั่วโมง",
};

function stepLabel(field: Field, delta: number): string {
  const unit = FIELD_TH[field];
  return delta < 0 ? `ย้อน ${Math.abs(delta)} ${unit}` : `เพิ่ม ${delta} ${unit}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function clampDay(year: number, month: number, day: number): number {
  const max = daysInMonth(year, month);
  return Math.min(Math.max(1, day), max);
}

const BTN_CLASS = cn(
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-line bg-surface text-fg-muted",
  "transition-colors hover:bg-sunk hover:text-fg active:scale-95 motion-reduce:transition-none",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
);

function StepperGroup({
  label,
  field,
  canDouble,
  onShift,
}: {
  label: React.ReactNode;
  field: Field;
  canDouble?: boolean;
  onShift: (field: Field, delta: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label={FIELD_TH[field]}
      className="flex items-center gap-1 rounded-card border border-line-faint bg-sunk px-1.5 py-1.5"
    >
      {canDouble ? (
        <button type="button" aria-label={stepLabel(field, -12)} onClick={() => onShift(field, -12)} className={BTN_CLASS}>
          <ChevronsLeft className="size-4" strokeWidth={1.5} />
        </button>
      ) : null}
      <button type="button" aria-label={stepLabel(field, -1)} onClick={() => onShift(field, -1)} className={BTN_CLASS}>
        <ChevronLeft className="size-4" strokeWidth={1.5} />
      </button>
      <div className="min-w-[3.5rem] text-center text-sm font-bold tabular-nums text-fg" aria-live="polite">
        {label}
      </div>
      <button type="button" aria-label={stepLabel(field, 1)} onClick={() => onShift(field, 1)} className={BTN_CLASS}>
        <ChevronRight className="size-4" strokeWidth={1.5} />
      </button>
      {canDouble ? (
        <button type="button" aria-label={stepLabel(field, 12)} onClick={() => onShift(field, 12)} className={BTN_CLASS}>
          <ChevronsRight className="size-4" strokeWidth={1.5} />
        </button>
      ) : null}
    </div>
  );
}

export function DateStepper({ value, onChange, className }: DateStepperProps) {
  function shift(field: Field, delta: number) {
    const v = { ...value };
    if (field === "year") {
      v.year += delta;
    } else if (field === "month") {
      let m = v.month + delta;
      while (m < 1) {
        m += 12;
        v.year -= 1;
      }
      while (m > 12) {
        m -= 12;
        v.year += 1;
      }
      v.month = m;
    } else if (field === "day") {
      const date = new Date(v.year, v.month - 1, v.day);
      date.setDate(date.getDate() + delta);
      v.year = date.getFullYear();
      v.month = date.getMonth() + 1;
      v.day = date.getDate();
    } else {
      const totalMin = v.hour * 60 + v.minute + delta * 60;
      const dayDelta = Math.floor(totalMin / 1440);
      const rem = ((totalMin % 1440) + 1440) % 1440;
      if (dayDelta !== 0) {
        const date = new Date(v.year, v.month - 1, v.day);
        date.setDate(date.getDate() + dayDelta);
        v.year = date.getFullYear();
        v.month = date.getMonth() + 1;
        v.day = date.getDate();
      }
      v.hour = Math.floor(rem / 60);
      v.minute = rem % 60;
    }
    v.day = clampDay(v.year, v.month, v.day);
    onChange(v);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="eyebrow text-center">วันที่ทำนาย (ดวงจร)</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <StepperGroup label={`${toBuddhistYear(value.year)}`} field="year" canDouble onShift={shift} />
        <StepperGroup label={THAI_MONTHS_SHORT[value.month - 1]} field="month" canDouble onShift={shift} />
        <StepperGroup label={`${value.day}`} field="day" onShift={shift} />
        <StepperGroup
          label={`${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}`}
          field="hour"
          onShift={shift}
        />
      </div>
    </div>
  );
}
