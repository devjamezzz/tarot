import * as React from "react";
import { cn } from "@/lib/cn";

export interface SkeletonProps {
  className?: string;
}

/** Loading placeholder: sunk surface with a faint gold shimmer. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden rounded-card bg-sunk", className)}
    >
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-gold/10 to-transparent motion-reduce:hidden" />
    </div>
  );
}
