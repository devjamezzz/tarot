import type { LucideIcon } from "lucide-react";
import { ArrowRight, CircleCheck, Eye, Sparkles, Target, TriangleAlert } from "lucide-react";
import type { InterpretationBlock, ReadingBlockType } from "@/lib/reading/types";
import { cn } from "@/lib/cn";

const BLOCK_ICONS: Record<ReadingBlockType, LucideIcon> = {
  summary: Sparkles,
  insight: Eye,
  focus: Target,
  action: CircleCheck,
  warning: TriangleAlert,
  cta: ArrowRight,
};

function blockStyle(block: InterpretationBlock): string {
  if (block.type === "warning" || block.emphasis === "caution") {
    return "border-warning/40 bg-warning/10";
  }

  if (block.type === "summary" || block.emphasis === "positive") {
    return "border-gold bg-gold-soft";
  }

  return "border-line bg-surface";
}

export function ReadingBlocks({
  blocks,
  className,
}: {
  blocks: InterpretationBlock[];
  className?: string;
}) {
  return (
    <section className={cn("grid gap-4 md:grid-cols-2", className)}>
      {blocks.map((block) => {
        const Icon = BLOCK_ICONS[block.type] ?? Sparkles;
        return (
          <article
            key={block.id}
            className={cn("rounded-card border p-5 shadow-card", blockStyle(block))}
          >
            <h3 className="flex items-center gap-2 font-display text-lg text-fg">
              <Icon className="size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              {block.title}
            </h3>
            <p className="mt-2 whitespace-pre-line text-base leading-[1.65] text-fg">{block.body}</p>
            {block.meta ? <p className="mt-3 text-[13px] text-fg-muted">{block.meta}</p> : null}
          </article>
        );
      })}
    </section>
  );
}
