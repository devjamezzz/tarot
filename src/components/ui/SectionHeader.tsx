import * as React from "react";
import { cn } from "@/lib/cn";

export interface SectionHeaderProps {
  title: React.ReactNode;
  /** Gold eyebrow label rendered above the title. */
  label?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, label, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {label ? <p className="eyebrow mb-1">{label}</p> : null}
        <h2 className="font-display text-[22px] font-semibold leading-snug text-fg">{title}</h2>
      </div>
      {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
    </div>
  );
}
