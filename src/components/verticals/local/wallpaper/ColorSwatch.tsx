import { cn } from "@/lib/cn";
import type { AuspiciousColor } from "@/lib/thai-astrology/colors";

export function ColorSwatch({
  color,
  selected,
  onToggle,
}: {
  color: AuspiciousColor;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={`สี${color.nameTh}`}
      className="flex min-w-[56px] flex-col items-center gap-1.5 rounded-card p-1 transition-transform active:scale-[.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg motion-reduce:transition-none"
    >
      <span
        className={cn(
          "block h-12 w-12 rounded-pill border border-line-faint shadow-card transition-[transform,box-shadow,opacity] motion-reduce:transition-none",
          selected ? "scale-110 ring-2 ring-gold ring-offset-2 ring-offset-surface" : "opacity-80 hover:opacity-100"
        )}
        style={{ backgroundColor: color.hex }}
        aria-hidden="true"
      />
      <span className={cn("text-[13px]", selected ? "text-gold" : "text-fg-muted")}>{color.nameTh}</span>
    </button>
  );
}
