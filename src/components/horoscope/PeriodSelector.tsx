'use client';

import * as React from 'react';
import { CalendarDays, CalendarRange, Sun, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { TimePeriod } from '@/lib/horoscope/types';

export interface PeriodSelectorProps {
  value?: TimePeriod;
  onChange?: (period: TimePeriod) => void;
  className?: string;
}

export interface PeriodOption {
  period: TimePeriod;
  thaiName: string;
  thaiDesc: string;
  icon: LucideIcon;
}

export const PERIOD_OPTIONS: ReadonlyArray<PeriodOption> = [
  { period: TimePeriod.DAILY, thaiName: 'รายวัน', thaiDesc: 'ดูดวงวันนี้', icon: Sun },
  { period: TimePeriod.WEEKLY, thaiName: 'รายสัปดาห์', thaiDesc: 'ดูดวงสัปดาห์นี้', icon: CalendarRange },
  { period: TimePeriod.MONTHLY, thaiName: 'รายเดือน', thaiDesc: 'ดูดวงเดือนนี้', icon: CalendarDays },
];

/**
 * Daily / weekly / monthly toggle. Three equal cells so every label fits at
 * 390px; the zodiac choice is kept by the parent when the period changes.
 */
export function PeriodSelector({ value, onChange, className }: PeriodSelectorProps) {
  return (
    <div
      role="group"
      aria-label="เลือกช่วงเวลา"
      data-testid="period-selector"
      className={cn('grid grid-cols-3 gap-2', className)}
    >
      {PERIOD_OPTIONS.map((option) => {
        const isSelected = value === option.period;
        const Icon = option.icon;

        return (
          <button
            key={option.period}
            type="button"
            onClick={() => onChange?.(option.period)}
            aria-pressed={isSelected}
            className={cn(
              'flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-card border px-2 py-3 text-center',
              'transition-[background-color,border-color,box-shadow,transform] duration-150 motion-safe:active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              isSelected
                ? 'border-gold bg-gold-soft shadow-gold-glow'
                : 'border-line bg-surface hover:bg-sunk'
            )}
          >
            <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <span className={cn('text-sm font-semibold', isSelected ? 'text-gold' : 'text-fg')}>
              {option.thaiName}
            </span>
            <span className="text-[13px] leading-tight text-fg-muted">{option.thaiDesc}</span>
          </button>
        );
      })}
    </div>
  );
}
