import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";

export interface DisabledFeatureProps {
  title?: string;
  description: string;
}

/** Shown when a feature toggle (enableTarot / enableLoveTarot) is off. */
export function DisabledFeature({ title = "ปิดปรับปรุงชั่วคราว", description }: DisabledFeatureProps) {
  return (
    <PageContainer variant="narrow">
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-1 text-center">
        <Sparkles className="mb-4 h-10 w-10 text-gold" strokeWidth={1.5} aria-hidden="true" />
        <h1 className="font-display text-[30px] font-semibold leading-tight text-fg">{title}</h1>
        <p className="mt-2 max-w-sm text-fg-muted">{description}</p>
        <Button asChild variant="ghost" className="mt-6">
          <Link href="/">กลับหน้าหลัก</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
