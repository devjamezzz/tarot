import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export type FormGroupProps = {
  icon: LucideIcon;
  title: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

/** One card per question on a vertical form: gold icon + Trirong h2 + controls. */
export function FormGroup({ icon: Icon, title, hint, children, className }: FormGroupProps) {
  return (
    <Card className={cn("space-y-3", className)}>
      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-fg">
          <Icon className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
          {title}
        </h2>
        {hint ? <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{hint}</p> : null}
      </div>
      {children}
    </Card>
  );
}
