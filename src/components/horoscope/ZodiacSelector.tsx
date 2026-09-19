'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { ZodiacSign } from '@/lib/horoscope/types';
import { getAllZodiacSigns } from '@/lib/horoscope/zodiac';
import { zodiacRangeLabel } from '@/components/verticals/readingMeta';

export interface ZodiacSelectorProps {
  value?: ZodiacSign;
  onChange?: (sign: ZodiacSign) => void;
  className?: string;
}

/** Variation selector-15 keeps the zodiac glyph as text, never a colour emoji. */
const TEXT_PRESENTATION = '︎';

/**
 * 12-sign grid. Each cell is a toggle button (aria-pressed) showing the glyph in
 * gold, the Thai name, and the sign's date window so people can find theirs.
 */
export function ZodiacSelector({ value, onChange, className }: ZodiacSelectorProps) {
  const allSigns = getAllZodiacSigns();

  return (
    <div
      role="group"
      aria-label="เลือกราศี"
      data-testid="zodiac-selector"
      className={cn('grid grid-cols-3 gap-2 sm:grid-cols-4', className)}
    >
      {allSigns.map((zodiac) => {
        const isSelected = value === zodiac.sign;

        return (
          <button
            key={zodiac.sign}
            type="button"
            onClick={() => onChange?.(zodiac.sign)}
            aria-pressed={isSelected}
            className={cn(
              'flex min-h-[92px] flex-col items-center justify-center gap-1 rounded-card border px-2 py-3 text-center',
              'transition-[background-color,border-color,box-shadow,transform] duration-150 motion-safe:active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              isSelected
                ? 'border-gold bg-gold-soft shadow-gold-glow'
                : 'border-line bg-surface hover:bg-sunk'
            )}
          >
            <span aria-hidden="true" className="font-display text-2xl leading-none text-gold">
              {zodiac.symbol}
              {TEXT_PRESENTATION}
            </span>
            <span className={cn('text-sm font-semibold', isSelected ? 'text-gold' : 'text-fg')}>
              {zodiac.thaiName}
            </span>
            <span className="text-[13px] leading-tight text-fg-muted">{zodiacRangeLabel(zodiac)}</span>
          </button>
        );
      })}
    </div>
  );
}
