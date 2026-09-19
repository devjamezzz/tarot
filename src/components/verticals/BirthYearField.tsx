"use client";

import * as React from "react";
import { InlineError } from "@/components/ui/ErrorDisplay";
import { cn } from "@/lib/cn";
import { BUDDHIST_YEAR_OFFSET } from "@/lib/format/thaiDate";

export type BirthYearEra = "BE" | "CE";

export interface BirthYearFieldProps {
  /** CE year, or null while empty / out of range. */
  value: number | null;
  onChange: (ceYear: number | null) => void;
  defaultEra?: BirthYearEra;
  label?: string;
  id?: string;
  className?: string;
}

const MIN_CE_YEAR = 1900;
const FOUR_DIGITS = /^\d{4}$/;

const inputClass = cn(
  "h-12 w-full rounded-xl border border-line bg-sunk px-4 text-base text-fg outline-none",
  "placeholder:text-fg-subtle focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/40"
);

function toEra(ce: number, era: BirthYearEra): number {
  return era === "BE" ? ce + BUDDHIST_YEAR_OFFSET : ce;
}

/**
 * Year-only birth input (พ.ศ. by default, ค.ศ. toggle) for verticals whose
 * engine needs just the year — mirrors BirthDateField's look and behaviour.
 */
export function BirthYearField({
  value,
  onChange,
  defaultEra = "BE",
  label = "ปีเกิด",
  id,
  className,
}: BirthYearFieldProps) {
  const autoId = React.useId();
  const inputId = id ?? `birthyear${autoId}`;
  const [era, setEra] = React.useState<BirthYearEra>(defaultEra);
  const [draft, setDraft] = React.useState("");
  const maxCeYear = new Date().getFullYear();

  const shown = value !== null ? String(toEra(value, era)) : draft;

  const commit = (next: string, nextEra: BirthYearEra) => {
    setDraft(next);
    if (!FOUR_DIGITS.test(next)) {
      onChange(null);
      return;
    }
    const ce = nextEra === "BE" ? Number(next) - BUDDHIST_YEAR_OFFSET : Number(next);
    onChange(ce >= MIN_CE_YEAR && ce <= maxCeYear ? ce : null);
  };

  const switchEra = (nextEra: BirthYearEra) => {
    if (nextEra === era) return;
    const converted = FOUR_DIGITS.test(shown)
      ? String(nextEra === "BE" ? Number(shown) + BUDDHIST_YEAR_OFFSET : Number(shown) - BUDDHIST_YEAR_OFFSET)
      : shown;
    setEra(nextEra);
    setDraft(converted);
  };

  const showInvalid = FOUR_DIGITS.test(shown) && value === null;
  const rangeHint =
    era === "BE"
      ? `พ.ศ. ${toEra(MIN_CE_YEAR, "BE")} – ${toEra(maxCeYear, "BE")}`
      : `ค.ศ. ${MIN_CE_YEAR} – ${maxCeYear}`;

  return (
    <div className={cn("space-y-2", className)} data-testid="birth-year-field">
      <label htmlFor={inputId} className="block text-sm font-medium text-fg">
        {label} ({era === "BE" ? "พ.ศ." : "ค.ศ."})
      </label>
      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        value={shown}
        placeholder={era === "BE" ? "เช่น 2540" : "เช่น 1997"}
        aria-invalid={showInvalid || undefined}
        aria-describedby={`${inputId}-hint`}
        onChange={(event) => commit(event.target.value.replace(/\D/g, ""), era)}
        className={inputClass}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div role="radiogroup" aria-label="รูปแบบปี" className="inline-flex rounded-pill border border-line p-0.5">
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
                  "h-9 rounded-pill px-4 text-[13px] font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                  active ? "bg-gold-soft text-gold" : "text-fg-muted hover:text-fg"
                )}
              >
                {option === "BE" ? "พ.ศ." : "ค.ศ."}
              </button>
            );
          })}
        </div>
        <p id={`${inputId}-hint`} className="text-[13px] text-fg-muted">
          {rangeHint}
        </p>
      </div>
      {showInvalid ? <InlineError message="ปีเกิดอยู่นอกช่วงที่รองรับ กรุณาตรวจสอบอีกครั้ง" /> : null}
    </div>
  );
}
