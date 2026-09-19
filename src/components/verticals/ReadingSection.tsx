import type { CSSProperties, ReactNode } from "react";
import { Check, TriangleAlert, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export type ReadingSectionProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  /** Position in the stack; drives the 40ms fade-up stagger. */
  index?: number;
  className?: string;
};

/** One titled block of deterministic reading text: gold lucide icon + Trirong h2. */
export function ReadingSection({ icon: Icon, title, children, index = 0, className }: ReadingSectionProps) {
  const style: CSSProperties = { animationDelay: `${index * 40}ms` };
  return (
    <Card className={cn("animate-fade-up motion-safe-fade space-y-2", className)} style={style}>
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-fg">
        <Icon className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
        {title}
      </h2>
      <div className="text-base leading-relaxed text-fg">{children}</div>
    </Card>
  );
}

export type ReadingListMarker = "dot" | "check" | "alert" | "number";

export type ReadingListProps = {
  items: string[];
  marker?: ReadingListMarker;
  className?: string;
};

function Marker({ marker, index }: { marker: ReadingListMarker; index: number }) {
  if (marker === "check") return <Check className="h-4 w-4" strokeWidth={2} />;
  if (marker === "alert") return <TriangleAlert className="h-4 w-4" strokeWidth={1.5} />;
  if (marker === "number") {
    return <span className="text-[13px] font-bold tabular-nums">{index + 1}.</span>;
  }
  return <span className="block h-1.5 w-1.5 rounded-pill bg-gold" />;
}

/** Bullet list for strengths / challenges / steps, with gold markers. */
export function ReadingList({ items, marker = "dot", className }: ReadingListProps) {
  const Tag = marker === "number" ? "ol" : "ul";
  return (
    <Tag className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <li key={`${index}-${item.slice(0, 12)}`} className="flex items-start gap-2.5">
          <span
            className="mt-[7px] flex h-4 w-4 shrink-0 items-center justify-center text-gold"
            aria-hidden="true"
          >
            <Marker marker={marker} index={index} />
          </span>
          <span className="min-w-0 flex-1">{item}</span>
        </li>
      ))}
    </Tag>
  );
}
