import * as React from "react";
import { cn } from "@/lib/cn";

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  size?: "sm" | "md";
  leadingIcon?: React.ReactNode;
};

const sizes: Record<NonNullable<ChipProps["size"]>, string> = {
  sm: "min-h-11 px-3 text-xs",
  md: "h-11 px-4 text-sm",
};

export function Chip({
  className,
  selected = false,
  size = "md",
  leadingIcon,
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-pill border font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        sizes[size],
        selected
          ? "border-gold bg-gold-soft text-gold"
          : "border-line bg-transparent text-fg hover:bg-sunk",
        className
      )}
      {...props}
    >
      {leadingIcon ? (
        <span className="inline-flex shrink-0 [&_svg]:size-4" aria-hidden="true">
          {leadingIcon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
