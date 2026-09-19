"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { SpreadCard } from "./SpreadCard";
import type { SpreadChoice } from "./spreadOptions";

export const CHANGE_SPREAD_LABEL = "เปลี่ยนรูปแบบไพ่";
export const HIDE_SPREADS_LABEL = "ซ่อนรูปแบบอื่น";

export interface SpreadSectionProps {
  choice: SpreadChoice;
  /** Badge for the recommended spread, e.g. "แนะนำสำหรับเรื่องความรัก". */
  badge: string;
  pendingSpreadId: string | null;
  onSelect: (spreadId: string) => void;
}

/**
 * "รูปแบบไพ่": the featured spreads stay visible (the current one is
 * highlighted); the rest live under a "เปลี่ยนรูปแบบไพ่" disclosure that
 * expands in place. Every card is one tap to /tarot/pick.
 */
export function SpreadSection({ choice, badge, pendingSpreadId, onSelect }: SpreadSectionProps) {
  const id = useId();
  const headingId = `${id}-heading`;
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const { current, recommendedId, featured, others } = choice;

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="eyebrow">
        รูปแบบไพ่
      </h2>
      <p className="mt-1 text-[13px] text-fg-muted">
        แตะการ์ด หรือปุ่มทองด้านล่าง เพื่อไปเลือกไพ่ด้วยตัวคุณเอง
      </p>

      <div className="mt-3 flex flex-col gap-3" data-testid="spread-featured">
        {featured.map((spread) => (
          <SpreadCard
            key={spread.id}
            spread={spread}
            selected={spread.id === current.id}
            badge={spread.id === recommendedId ? badge : undefined}
            busy={pendingSpreadId === spread.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      {others.length > 0 ? (
        <>
          <button
            type="button"
            data-testid="spread-toggle"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "mx-auto mt-3 flex min-h-11 items-center gap-1.5 rounded-pill px-4 text-[14px] font-medium text-gold transition-colors hover:bg-gold-soft",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            )}
          >
            {open ? HIDE_SPREADS_LABEL : `${CHANGE_SPREAD_LABEL} (อีก ${others.length} แบบ)`}
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>

          <div id={listId} data-testid="spread-list" className="flex flex-col gap-3">
            {open
              ? others.map((spread) => (
                  <SpreadCard
                    key={spread.id}
                    spread={spread}
                    busy={pendingSpreadId === spread.id}
                    onSelect={onSelect}
                  />
                ))
              : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
