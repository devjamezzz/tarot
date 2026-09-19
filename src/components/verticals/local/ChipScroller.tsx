"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type ChipScrollerProps = React.HTMLAttributes<HTMLDivElement>;

const FADE_WIDTH = "3rem";

type Edges = { left: boolean; right: boolean };

/**
 * Horizontal chip strip that bleeds to the page gutter and fades whichever
 * edge still hides content, so a half-visible chip reads as "เลื่อนดูต่อ"
 * instead of a cut-off element. The fade disappears on the side you have
 * scrolled to, so the first/last chip is always shown in full.
 */
export function ChipScroller({ className, children, onScroll, ...props }: ChipScrollerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState<Edges>({ left: false, right: false });

  const measure = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next: Edges = { left: el.scrollLeft > 1, right: el.scrollLeft < max - 1 };
    setEdges((prev) => (prev.left === next.left && prev.right === next.right ? prev : next));
  }, []);

  React.useEffect(() => {
    measure();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    // Thai web fonts swapping in changes chip widths after first paint.
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => observer.disconnect();
  }, [measure]);

  const stops = [
    edges.left ? `transparent, #000 ${FADE_WIDTH}` : "#000",
    edges.right ? `#000 calc(100% - ${FADE_WIDTH}), transparent` : "#000",
  ].join(", ");
  const mask = edges.left || edges.right ? `linear-gradient(to right, ${stops})` : undefined;

  return (
    <div
      ref={ref}
      onScroll={(event) => {
        measure();
        onScroll?.(event);
      }}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className={cn(
        "-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
