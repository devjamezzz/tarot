import Link from "next/link";
import { Check, ChevronRight, Crown } from "lucide-react";
import type { PackageConfig } from "@/lib/packages/defaults";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { badgeFor, getPackageDetails, isFreePackage, lineInquiryText } from "./packageDetails";
import { PriceTag } from "./PriceTag";

const MAX_FEATURES = 4;

export function PackageBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-pill border border-gold bg-gold-soft px-2.5 py-1 text-[13px] font-bold text-gold">
      <Crown className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
      {label}
    </span>
  );
}

/** One package on /pricing — server-safe (no hooks). */
export function PackageCard({ pkg, style }: { pkg: PackageConfig; style?: React.CSSProperties }) {
  const badge = badgeFor(pkg);
  const details = getPackageDetails(pkg.id);
  const free = isFreePackage(pkg);
  const detailHref = `/pricing/${pkg.id}`;
  const features = pkg.features.slice(0, MAX_FEATURES);
  const extra = pkg.features.length - features.length;
  const titleId = `pricing-pkg-${pkg.id}`;

  return (
    <Card
      className="animate-fade-up flex flex-col gap-4"
      style={style}
      data-testid="pricing-package-card"
      aria-labelledby={titleId}
      role="article"
    >
      <div className="flex flex-col gap-1.5">
        {badge ? (
          <div>
            <PackageBadge label={badge} />
          </div>
        ) : details?.tagline ? (
          <p className="eyebrow">{details.tagline}</p>
        ) : null}
        <h2 id={titleId} className="font-display text-[22px] font-semibold leading-snug text-fg">
          {pkg.name}
        </h2>
        <p className="text-[13px] text-fg-muted">{pkg.description}</p>
      </div>

      {pkg.detail ? <p className="text-[15px] leading-relaxed text-fg">{pkg.detail}</p> : null}

      {features.length > 0 ? (
        <ul className="space-y-1.5" aria-label="สิ่งที่ได้รับ">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-fg-muted">
              <Check className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
          {extra > 0 ? (
            <li className="pl-6 text-[13px] text-fg-subtle">และอีก {extra} รายการ</li>
          ) : null}
        </ul>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 border-t border-line-faint pt-4">
        <PriceTag pkg={pkg} />
        {free && pkg.href ? (
          <Button asChild variant="gold" size="lg" className="w-full">
            <Link href={pkg.href}>ลองเลย ฟรี</Link>
          </Button>
        ) : (
          <LineCtaButton label="สอบถาม/จองทาง LINE" text={lineInquiryText(pkg)} />
        )}
        <Button asChild variant="ghost" className="w-full">
          <Link href={detailHref} aria-label={`ดูรายละเอียด ${pkg.name}`}>
            ดูรายละเอียด
            <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
