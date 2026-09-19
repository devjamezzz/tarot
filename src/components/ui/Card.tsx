import * as React from "react";
import { cn } from "@/lib/cn";

type CardVariant = "default" | "sunk" | "glass";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  /** Adds the hover lift; cards are static by default. */
  interactive?: boolean;
};

const variants: Record<CardVariant, string> = {
  default:
    "border border-line bg-surface shadow-card inset-ring-1 inset-ring-[rgba(226,196,138,0.08)]",
  sunk: "border border-line-faint bg-sunk",
  glass: "border-[color:var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl",
};

export function Card({
  className,
  variant = "default",
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card p-4 md:p-5",
        variants[variant],
        interactive &&
          "transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] active:translate-y-0",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("font-display text-lg font-semibold text-fg", className)}
      {...props}
    />
  );
}

export function CardDesc({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-fg-muted", className)} {...props} />;
}
