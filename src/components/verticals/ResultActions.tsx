import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { cn } from "@/lib/cn";

export type ResultLink = { href: string; label: string };

export type ResultActionsProps = {
  /** Pre-filled LINE message (result summary + link). */
  lineText: string;
  links: ResultLink[];
};

export const LINE_RESULT_LABEL = "ส่งผลให้หมอดูทาง LINE";

/** CTA block for every engine-only vertical: LINE first, then ghost links back into the flow. */
export function ResultActions({ lineText, links }: ResultActionsProps) {
  return (
    <>
      <LineCtaButton label={LINE_RESULT_LABEL} text={lineText} />
      <div className={cn("grid gap-3", links.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
        {links.map((link) => (
          <Button key={link.href} asChild variant="ghost" size="lg" className="min-w-0 px-3">
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </div>
    </>
  );
}
