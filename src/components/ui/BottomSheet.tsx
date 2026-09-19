"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Bottom sheet above the tab bar (z-[10000]). Closes on backdrop tap or
 * Escape; focuses the panel on open. Plain React, no portal dependencies.
 */
export function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center">
      <button
        type="button"
        aria-label="ปิด"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 motion-safe-fade"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-[640px] rounded-t-sheet border-t border-line bg-surface shadow-card outline-none",
          "max-h-[85dvh] overflow-y-auto px-5 pt-3",
          className
        )}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)" }}
      >
        <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-pill bg-line" />
        <div className="mb-4 flex items-start justify-between gap-3">
          {title ? (
            <h2 id={titleId} className="font-display text-[22px] font-semibold leading-snug text-fg">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            aria-label="ปิด"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-line text-fg-muted transition-colors hover:bg-sunk hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
