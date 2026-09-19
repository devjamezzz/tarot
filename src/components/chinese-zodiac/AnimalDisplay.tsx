// Chinese Zodiac Animal Display Component
// Feature: popular-fortune-features
// Displays Chinese zodiac animal with its Han glyph, Thai name, and element

import * as React from "react";
import {
  Coins,
  Droplets,
  Flame,
  Mountain,
  TreeDeciduous,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import {
  ChineseZodiacAnimal,
  ChineseElement,
} from "@/lib/chinese-zodiac/types";
import {
  getAnimalMetadata,
  getElementMetadata,
} from "@/lib/chinese-zodiac/animals";

export interface AnimalDisplayProps {
  animal: ChineseZodiacAnimal;
  element: ChineseElement;
  className?: string;
  showDetails?: boolean; // Show traits and lucky items
}

/** Gold lucide icon per element (replaces the old per-element colour palette). */
const ELEMENT_ICONS: Record<ChineseElement, LucideIcon> = {
  [ChineseElement.WOOD]: TreeDeciduous,
  [ChineseElement.FIRE]: Flame,
  [ChineseElement.EARTH]: Mountain,
  [ChineseElement.METAL]: Coins,
  [ChineseElement.WATER]: Droplets,
};

/** First Han character of "龍 (Lóng)" — shown as the display glyph instead of an emoji. */
function hanGlyph(chineseName: string): string {
  return Array.from(chineseName.trim())[0] ?? "";
}

function DetailRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium text-fg-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="inline-block rounded-pill border border-line-faint bg-sunk px-2.5 py-1 text-[13px] text-fg"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * AnimalDisplay Component
 *
 * Displays Chinese zodiac animal information including:
 * - Han glyph of the animal in gold
 * - Thai name and Chinese name
 * - Element badge with a gold lucide icon
 * - Optional: traits, lucky colours, numbers, directions
 *
 * @example
 * <AnimalDisplay animal={ChineseZodiacAnimal.DRAGON} element={ChineseElement.WOOD} />
 */
export function AnimalDisplay({
  animal,
  element,
  className,
  showDetails = false,
}: AnimalDisplayProps) {
  const animalMeta = getAnimalMetadata(animal);
  const elementMeta = getElementMetadata(element);
  const ElementIcon = ELEMENT_ICONS[element];

  return (
    <Card
      data-testid="animal-display"
      className={cn("animate-fade-up motion-safe-fade", className)}
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-card border border-line-faint bg-sunk font-display text-4xl leading-none text-gold"
        >
          {hanGlyph(animalMeta.chineseName)}
        </div>

        <div className="min-w-0 flex-1">
          <CardTitle className="text-[22px]">{animalMeta.thaiName}</CardTitle>
          <CardDesc className="mt-0.5">{animalMeta.chineseName}</CardDesc>

          <div className="mt-2 inline-flex items-center gap-1.5 rounded-pill border border-gold bg-gold-soft px-3 py-1 text-[13px] font-medium text-gold">
            <ElementIcon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            <span>ธาตุ{elementMeta.thaiName}</span>
            <span className="text-fg-muted">{elementMeta.chineseName}</span>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-3 border-t border-line-faint pt-4">
          <DetailRow label="ลักษณะนิสัย" items={animalMeta.traits} />
          <DetailRow label="สีมงคล" items={animalMeta.luckyColors} />

          <div>
            <p className="mb-1.5 text-[13px] font-medium text-fg-muted">เลขมงคล</p>
            <div className="flex flex-wrap gap-2">
              {animalMeta.luckyNumbers.map((number) => (
                <span
                  key={number}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-gold text-sm font-bold tabular-nums text-gold"
                >
                  {number}
                </span>
              ))}
            </div>
          </div>

          <DetailRow label="ทิศมงคล" items={animalMeta.luckyDirections} />
        </div>
      )}
    </Card>
  );
}
