"use client";

import Link from "next/link";
import { ChevronRight, MessageSquareText, Tag, WalletCards, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { useConfigStore } from "@/store/useConfigStore";
import { cn } from "@/lib/cn";

interface Fact {
  icon: LucideIcon;
  text: string;
}

const FACTS: Fact[] = [
  { icon: MessageSquareText, text: "ตอบเป็นข้อความทาง LINE ไม่ต้องโทร" },
  { icon: WalletCards, text: "จ่ายครั้งเดียวต่อแพ็ก ไม่มีรายเดือน" },
];

/** Lowest paid price among the admin-editable packages, in the same "฿45" form /pricing shows. */
function useStartingPrice(): string | null {
  const packages = useConfigStore((state) => state.packages);
  const cheapest = packages.reduce<{ label: string; value: number } | null>((best, pkg) => {
    const label = pkg.price.trim();
    const value = Number(label.replace(/[^\d.]/g, ""));
    if (!label || !Number.isFinite(value) || value <= 0) return best;
    return best && best.value <= value ? best : { label, value };
  }, null);
  return cheapest?.label ?? null;
}

/**
 * "ส่งไพ่ให้หมอดูเรฟ" panel: gold-bordered card with
 * the LINE CTA first and a link to the package list. Sits in the desktop rail
 * under the daily widgets / popular list so the column is never left empty.
 */
export function ConsultTeaser({ className }: { className?: string }) {
  const startingPrice = useStartingPrice();
  const facts = startingPrice ? [...FACTS, { icon: Tag, text: `เริ่มต้น ${startingPrice} ต่อคำถาม` }] : FACTS;

  return (
    <section aria-labelledby="consult-teaser-title" className={cn("animate-fade-up", className)}>
      <Card className="space-y-4 border-gold shadow-[var(--glow-soft)]" data-testid="consult-teaser">
        <div>
          <p className="eyebrow">หมอดูตัวจริง</p>
          <h2
            id="consult-teaser-title"
            className="mt-1 text-balance font-display text-[22px] font-semibold leading-snug text-fg"
          >
            อยากรู้ลึกกว่าที่ไพ่บอก ส่งให้หมอดูเรฟอ่านต่อ
          </h2>
        </div>

        <ul className="space-y-1.5 text-[13px] text-fg-muted">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <Icon className="size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>

        <LineCtaButton label="ทักหมอดูทาง LINE" size="default" />

        <Link
          href="/pricing"
          className="-ml-3 inline-flex h-11 items-center gap-1 rounded-pill px-3 text-sm font-medium text-gold hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          ดูแพ็กเกจและราคาทั้งหมด
          <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </Card>
    </section>
  );
}
