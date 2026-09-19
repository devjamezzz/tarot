"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/cn";

export interface HeartSaveProps {
  saved: boolean;
  onToggle?: () => void;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export function HeartSave({
  saved,
  onToggle,
  className,
  label,
  disabled,
}: HeartSaveProps) {
  const aria = label ?? (saved ? "เอาออกจากที่บันทึก" : "บันทึก");

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={aria}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-pill",
        "border border-line bg-surface text-fg",
        "transition-colors hover:bg-sunk disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className
      )}
    >
      <Heart
        className={cn("h-[18px] w-[18px]", saved ? "text-gold" : "text-fg-muted")}
        fill={saved ? "currentColor" : "none"}
        strokeWidth={1.5}
      />
    </button>
  );
}
