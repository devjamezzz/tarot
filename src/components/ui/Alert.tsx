import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-surface text-fg",
  success: "border-success/40 bg-success/10 text-fg",
  warning: "border-warning/40 bg-warning/10 text-fg",
  danger: "border-danger/40 bg-danger/10 text-fg",
  info: "border-info/40 bg-info/10 text-fg",
};

export function Alert({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: Tone }) {
  return (
    <div
      className={cn("rounded-card border p-4 text-sm", tones[tone], className)}
      {...props}
    />
  );
}
