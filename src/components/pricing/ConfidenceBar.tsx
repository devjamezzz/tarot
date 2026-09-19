import { BadgeCheck, CalendarOff } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Confidence bar under the price (brief §2.8). Only verified claims:
 * one-time payment, no hidden monthly charge. No refund promise here —
 * the policy is unconfirmed with the owner.
 */
const ITEMS = [
  { icon: BadgeCheck, text: "จ่ายครั้งเดียว" },
  { icon: CalendarOff, text: "ไม่มีรายเดือนแอบเก็บ" },
] as const;

export function ConfidenceBar({
  className,
  compact = false,
}: {
  className?: string;
  /** Plain inline row (no sunk box) for use inside a card. */
  compact?: boolean;
}) {
  return (
    <ul
      data-testid="pricing-confidence"
      aria-label="เงื่อนไขการชำระเงิน"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-fg-muted",
        !compact && "rounded-card border border-line-faint bg-sunk px-4 py-3",
        className
      )}
    >
      {ITEMS.map(({ icon: Icon, text }) => (
        <li key={text} className="inline-flex items-center gap-1.5">
          <Icon className="size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}
