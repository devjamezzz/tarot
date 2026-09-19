import * as React from "react";
import { cn } from "@/lib/cn";

export interface AiTypingDotsProps {
  label?: string;
  className?: string;
}

/** Three gold typing dots for AI loading states. Static under reduced motion. */
export function AiTypingDots({ label = "กำลังประมวลผล…", className }: AiTypingDotsProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-3 text-sm text-fg-muted", className)}
    >
      <span className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-pill bg-gold animate-typing-dot motion-reduce:animate-none"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </span>
      <span>{label}</span>
    </div>
  );
}
