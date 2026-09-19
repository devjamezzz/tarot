import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LINE_OA_URL } from "@/lib/site";

export interface DeepReadStep {
  id: string;
  title: string;
  /** Blurred teaser behind the lock — engine text, never AI. */
  preview: string;
  cta: string;
  href: string;
  external?: boolean;
}

/**
 * Track-B ladder (brief §2.4-6). Config-gated by `toggles.showAiReading`;
 * there is no price and no paywall copy — every step is a plain link.
 */
export function buildDeepReadSteps(input: { returnTo: string; previews: string[] }): DeepReadStep[] {
  const [first = "", second = first, third = second] = input.previews;
  return [
    {
      id: "birthdate",
      title: "ความหมายเชิงลึกของแต่ละใบ",
      preview: first,
      cta: "ใส่วันเกิดเพื่อปลดล็อก",
      href: "/astrology",
    },
    {
      id: "login",
      title: "คำแนะนำเฉพาะสำหรับคุณ",
      preview: second,
      cta: "เข้าสู่ระบบด้วย LINE",
      href: `/login?returnTo=${encodeURIComponent(input.returnTo)}`,
    },
    {
      id: "ask",
      title: "ถามหมอดูต่อจากไพ่ชุดนี้",
      preview: third,
      cta: "ถามหมอดูต่อ",
      href: LINE_OA_URL,
      external: true,
    },
  ];
}

export function DeepReadLadder({ steps }: { steps: DeepReadStep[] }) {
  return (
    <section data-testid="deep-read-ladder" aria-labelledby="deep-read-title" className="space-y-3">
      <div>
        <p className="eyebrow">อ่านลึก</p>
        <h2 id="deep-read-title" className="mt-1 font-display text-[22px] font-semibold text-fg">
          อ่านไพ่ชุดนี้ให้ลึกขึ้น
        </h2>
      </div>

      {steps.map((step) => (
        <Card key={step.id} className="relative min-h-[188px] overflow-hidden" data-testid={`deep-read-${step.id}`}>
          <p aria-hidden="true" className="select-none text-base leading-[1.65] text-fg-muted blur-sm">
            {step.preview}
          </p>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/60 p-4 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-pill border border-gold bg-gold-soft">
              <Lock className="size-5 text-gold" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="font-display text-lg font-semibold text-fg">{step.title}</p>
            <Button asChild variant="gold">
              {step.external ? (
                <a href={step.href} target="_blank" rel="noopener noreferrer">
                  {step.cta}
                </a>
              ) : (
                <Link href={step.href}>{step.cta}</Link>
              )}
            </Button>
          </div>
        </Card>
      ))}
    </section>
  );
}
