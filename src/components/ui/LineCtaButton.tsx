import * as React from "react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";
import { LINE_OA_URL, lineMessageUrl } from "@/lib/site";

export interface LineCtaButtonProps {
  label?: string;
  /** Pre-filled message; opens LINE's share sheet via lineMessageUrl(text). */
  text?: string;
  /** Explicit target; wins over `text`. Defaults to LINE_OA_URL. */
  href?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}

function LineGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.64 2 11.1c0 3.98 3.53 7.32 8.3 7.98.32.07.76.21.87.49.1.25.07.65.03.9l-.14.84c-.04.25-.2.98.86.53 1.06-.44 5.7-3.36 7.78-5.75C21.15 14.5 22 12.9 22 11.1 22 6.64 17.52 3 12 3z" />
    </svg>
  );
}

/** Primary LINE CTA — full width, LINE green, with the LINE bubble glyph. */
export function LineCtaButton({
  label = "ส่งไพ่ให้หมอดูทาง LINE",
  text,
  href,
  className,
  size = "lg",
}: LineCtaButtonProps) {
  const target = href ?? (text ? lineMessageUrl(text) : LINE_OA_URL);

  return (
    <Button asChild variant="line" size={size} className={cn("w-full", className)}>
      <a href={target} target="_blank" rel="noopener noreferrer" data-testid="line-cta">
        <LineGlyph />
        {label}
      </a>
    </Button>
  );
}
