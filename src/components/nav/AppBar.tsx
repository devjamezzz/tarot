import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export interface AppBarProps {
  /** Page title — rendered as the Trirong h1. */
  title: React.ReactNode;
  /** Gold eyebrow label above the title (e.g. "ไพ่ทาโรต์"). */
  label?: React.ReactNode;
  /** 13px muted line under the title (e.g. "3 ใบ · ความรัก · 19 ก.ย. 2569"). */
  caption?: React.ReactNode;
  backHref?: string;
  right?: React.ReactNode;
  className?: string;
  /** Larger title on desktop (40px). */
  largeTitle?: boolean;
}

export function AppBar({
  title,
  label,
  caption,
  backHref,
  right,
  className,
  largeTitle = false,
}: AppBarProps) {
  return (
    <header
      className={cn(
        "flex items-start justify-between gap-3 px-5 pt-6 pb-3",
        largeTitle && "pb-4",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="ย้อนกลับ"
            className={cn(
              "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-pill",
              "border border-line bg-surface text-fg transition-colors hover:bg-sunk",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            )}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </Link>
        ) : null}
        <div className="min-w-0">
          {label ? <p className="eyebrow mb-1">{label}</p> : null}
          <h1
            className={cn(
              "font-display text-[30px] font-semibold leading-tight text-fg [text-wrap:balance]",
              largeTitle && "md:text-[40px]"
            )}
          >
            {title}
          </h1>
          {caption ? (
            <p className="mt-1 text-[13px] leading-snug text-fg-muted">{caption}</p>
          ) : null}
        </div>
      </div>
      {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
    </header>
  );
}
