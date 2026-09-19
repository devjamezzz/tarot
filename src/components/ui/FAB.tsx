"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { LINE_OA_URL } from "@/lib/site";

export interface FABProps {
  className?: string;
  onClick?: () => void;
  /** Defaults to the LINE OA add-friend link when neither href nor onClick is given. */
  href?: string;
  label?: string;
  icon?: React.ReactNode;
}

/**
 * Floating action button — the site-wide "add LINE friend" CTA.
 * Keeps LINE green (the one colour outside the palette).
 *
 * @example
 * <FAB label="เพิ่มเพื่อน LINE" />
 */
export function FAB({
  className,
  onClick,
  href,
  label = "เพิ่มเพื่อน LINE",
  icon,
}: FABProps) {
  const content = (
    <>
      <span className="shrink-0">
        {icon ?? <MessageCircle className="h-6 w-6" strokeWidth={1.5} />}
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </>
  );

  const baseClasses = cn(
    "fixed right-5 z-40 above-tabbar mb-4",
    "flex items-center gap-2 rounded-pill px-5 py-3",
    "bg-line-green text-white shadow-[var(--shadow-fab)]",
    "hover:bg-[#05B04D] active:scale-95",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    className
  );

  if (onClick && !href) {
    return (
      <button type="button" onClick={onClick} className={baseClasses}>
        {content}
      </button>
    );
  }

  return (
    <a
      href={href ?? LINE_OA_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClasses}
    >
      {content}
    </a>
  );
}
