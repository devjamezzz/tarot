import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { STEP_LABELS } from "./constants";

export function StepProgress({ step }: { step: number }) {
  return (
    <ol className="mb-6 flex items-center gap-1" aria-label={`ขั้นตอนที่ ${step} จาก ${STEP_LABELS.length}`}>
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n <= step;
        return (
          <li
            key={label}
            aria-current={n === step ? "step" : undefined}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <div className={cn("h-1.5 w-full rounded-pill transition-colors", done ? "bg-gold" : "bg-sunk")} />
            <span className={cn("text-[13px]", done ? "text-fg" : "text-fg-muted")}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function StepHeader({ icon: Icon, title, caption }: { icon: LucideIcon; title: string; caption: string }) {
  return (
    <div className="mb-2 text-center">
      <Icon className="mx-auto mb-2 size-8 text-gold" strokeWidth={1.5} aria-hidden="true" />
      <h2 className="font-display text-[22px] font-semibold leading-snug text-fg">{title}</h2>
      <p className="mt-1 text-sm text-fg-muted">{caption}</p>
    </div>
  );
}
