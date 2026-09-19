"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { InlineError } from "./ErrorDisplay";

export interface BirthDateValue {
  day: number;
  month: number;
  /** Always stored as a CE (ค.ศ.) year regardless of the era shown. */
  year: number;
}

export type BirthEra = "BE" | "CE";

export interface BirthDateFieldProps {
  value: BirthDateValue | null;
  onChange: (value: BirthDateValue | null) => void;
  defaultEra?: BirthEra;
  label?: string;
  required?: boolean;
  className?: string;
  /** Prefix for the three field ids; a stable id is generated when omitted. */
  id?: string;
}

export const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
] as const;

const BE_OFFSET = 543;
const MIN_CE_YEAR = 1900;
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const selectClass = cn(
  "h-12 w-full rounded-xl border border-line bg-sunk px-3 text-base text-fg outline-none",
  "focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40",
  "invalid:text-fg-subtle"
);

function toEraYear(ce: number, era: BirthEra): number {
  return era === "BE" ? ce + BE_OFFSET : ce;
}

function isRealDate(day: number, month: number, ce: number): boolean {
  const d = new Date(ce, month - 1, day);
  return d.getFullYear() === ce && d.getMonth() === month - 1 && d.getDate() === day;
}

export function BirthDateField({
  value,
  onChange,
  defaultEra = "BE",
  label = "วันเกิด",
  required = false,
  className,
  id,
}: BirthDateFieldProps) {
  const autoId = React.useId();
  const baseId = id ?? `birthdate${autoId}`;
  const [era, setEra] = React.useState<BirthEra>(defaultEra);
  const [draft, setDraft] = React.useState({ day: "", month: "", year: "" });

  // Render from the controlled value when present, else from the partial draft.
  const shown = value
    ? { day: String(value.day), month: String(value.month), year: String(toEraYear(value.year, era)) }
    : draft;

  const maxCeYear = new Date().getFullYear();

  const commit = (next: { day: string; month: string; year: string }, nextEra: BirthEra) => {
    setDraft(next);
    const day = Number(next.day);
    const month = Number(next.month);
    const yearInput = Number(next.year);
    if (!next.day || !next.month || !/^\d{4}$/.test(next.year)) {
      onChange(null);
      return;
    }
    const ce = nextEra === "BE" ? yearInput - BE_OFFSET : yearInput;
    if (ce < MIN_CE_YEAR || ce > maxCeYear || !isRealDate(day, month, ce)) {
      onChange(null);
      return;
    }
    onChange({ day, month, year: ce });
  };

  const switchEra = (nextEra: BirthEra) => {
    if (nextEra === era) return;
    const current = Number(shown.year);
    const converted = /^\d{4}$/.test(shown.year)
      ? String(nextEra === "BE" ? current + BE_OFFSET : current - BE_OFFSET)
      : shown.year;
    setEra(nextEra);
    setDraft({ ...shown, year: converted });
  };

  const allFilled = Boolean(shown.day && shown.month && /^\d{4}$/.test(shown.year));
  const showInvalid = allFilled && value === null;

  return (
    <fieldset className={cn("space-y-2", className)}>
      <legend className="mb-2 text-sm font-medium text-fg">
        {label}
        {required ? <span className="ml-1 text-danger" aria-hidden="true">*</span> : null}
      </legend>

      <div className="grid grid-cols-[1fr_1.6fr_1.2fr] gap-2">
        <div>
          <label htmlFor={`${baseId}-day`} className="mb-1 block text-xs text-fg-muted">วัน</label>
          <select
            id={`${baseId}-day`}
            value={shown.day}
            required={required}
            onChange={(e) => commit({ ...shown, day: e.target.value }, era)}
            className={selectClass}
          >
            <option value="">วัน</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${baseId}-month`} className="mb-1 block text-xs text-fg-muted">เดือน</label>
          <select
            id={`${baseId}-month`}
            value={shown.month}
            required={required}
            onChange={(e) => commit({ ...shown, month: e.target.value }, era)}
            className={selectClass}
          >
            <option value="">เดือน</option>
            {THAI_MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${baseId}-year`} className="mb-1 block text-xs text-fg-muted">
            ปี ({era === "BE" ? "พ.ศ." : "ค.ศ."})
          </label>
          <input
            id={`${baseId}-year`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            required={required}
            value={shown.year}
            placeholder={era === "BE" ? "เช่น 2540" : "เช่น 1997"}
            onChange={(e) => commit({ ...shown, year: e.target.value.replace(/\D/g, "") }, era)}
            className={cn(selectClass, "placeholder:text-fg-subtle")}
          />
        </div>
      </div>

      <div role="radiogroup" aria-label="รูปแบบปี" className="inline-flex rounded-pill border border-line p-1">
        {(["BE", "CE"] as const).map((option) => {
          const active = era === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => switchEra(option)}
              className={cn(
                "min-h-11 rounded-pill px-4 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                active ? "bg-gold-soft text-gold" : "text-fg-muted hover:text-fg"
              )}
            >
              {option === "BE" ? "พ.ศ." : "ค.ศ."}
            </button>
          );
        })}
      </div>

      {showInvalid ? <InlineError message="วันเกิดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" /> : null}
    </fieldset>
  );
}
