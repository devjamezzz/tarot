"use client";

import Link from "next/link";
import { ChevronRight, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NEW_BADGE_LABEL, POPULAR_BADGE_LABEL, type PackageConfig } from "@/lib/packages/defaults";
import { useConfigStore } from "@/store/useConfigStore";
import { cn } from "@/lib/cn";

const MAX_FEATURES = 3;

function badgeFor(pkg: PackageConfig): string | null {
  if (pkg.subtitle === NEW_BADGE_LABEL) return NEW_BADGE_LABEL;
  if (pkg.popular || pkg.subtitle === POPULAR_BADGE_LABEL) return POPULAR_BADGE_LABEL;
  return null;
}

function PackageCard({ pkg }: { pkg: PackageConfig }) {
  const badge = badgeFor(pkg);
  const href = pkg.href ?? `/pricing/${pkg.id}`;
  const features = pkg.features.slice(0, MAX_FEATURES);
  const extra = pkg.features.length - features.length;
  const isFree = pkg.price.trim() === "";

  return (
    <Card interactive className="flex h-full flex-col gap-3" data-testid="home-package-card">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill border border-line bg-sunk text-gold">
          <Sparkles className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          {badge ? (
            <span className="mb-1 inline-flex items-center gap-1 rounded-pill border border-gold bg-gold-soft px-2.5 py-0.5 text-[11px] font-bold text-gold">
              <Crown className="size-3" strokeWidth={1.5} aria-hidden="true" />
              {badge}
            </span>
          ) : null}
          <h3 className="font-display text-lg font-semibold leading-snug text-fg">{pkg.name}</h3>
          <p className="mt-0.5 text-[13px] text-fg-muted">{pkg.description}</p>
        </div>
      </div>

      {pkg.detail ? <p className="text-sm leading-relaxed text-fg">{pkg.detail}</p> : null}

      {features.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5" aria-label="สิ่งที่ได้รับ">
          {features.map((feature) => (
            <li key={feature} className="rounded-pill bg-sunk px-2.5 py-1 text-xs text-fg-muted">
              {feature}
            </li>
          ))}
          {extra > 0 ? (
            <li className="rounded-pill border border-line-faint px-2.5 py-1 text-xs text-fg-subtle">
              +{extra} รายการ
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-auto flex items-end justify-between gap-3 pt-1">
        <div className="min-w-0">
          <p className="font-sans text-2xl font-bold tabular-nums tracking-[0.02em] text-gold">
            {isFree ? "ฟรี" : pkg.price}
          </p>
          {pkg.priceAlt ? <p className="text-xs text-fg-muted">{pkg.priceAlt}</p> : null}
        </div>
        <Button asChild variant="gold">
          <Link href={href}>{isFree ? "ลองเลย" : "เลือกแพ็กนี้"}</Link>
        </Button>
      </div>
    </Card>
  );
}

export function PackageCards({ className }: { className?: string }) {
  const packages = useConfigStore((state) => state.packages);

  return (
    <section aria-labelledby="home-packages-title" className={cn("animate-fade-up", className)}>
      <SectionHeader
        label="หมอดูตัวจริง"
        title={<span id="home-packages-title">แพ็กเกจดูดวงกับหมอดู</span>}
        action={
          <Link
            href="/pricing"
            className="inline-flex h-11 items-center gap-1 rounded-pill px-3 text-sm font-medium text-gold hover:bg-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            ดูทั้งหมด
            <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        }
      />
      <p className="mt-2 text-[13px] text-fg-muted">
        จ่ายครั้งเดียวต่อแพ็ก ราคาเดียวกับหน้าแพ็กเกจ ไม่มีรายเดือน
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
