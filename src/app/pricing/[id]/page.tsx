import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, FileText, Star } from "lucide-react";
import { DEFAULT_PACKAGES } from "@/lib/packages/defaults";
import { PageContainer } from "@/components/ui/PageContainer";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { PackageBadge } from "@/components/pricing/PackageCard";
import { PriceTag } from "@/components/pricing/PriceTag";
import { ConfidenceBar } from "@/components/pricing/ConfidenceBar";
import { BookingSteps } from "@/components/pricing/BookingSteps";
import {
  badgeFor,
  getPackage,
  getPackageDetails,
  isFreePackage,
  lineInquiryText,
} from "@/components/pricing/packageDetails";

interface PricingDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return DEFAULT_PACKAGES.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({ params }: PricingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const pkg = getPackage(id);
  if (!pkg) return { title: "ไม่พบแพ็กเกจ" };
  const details = getPackageDetails(id);
  const price = isFreePackage(pkg) ? "ฟรี" : pkg.price;
  return {
    title: `${pkg.name} — ${price}`,
    description: details?.fullDescription ?? pkg.detail ?? pkg.description,
    alternates: { canonical: `/pricing/${id}` },
  };
}

function ChecklistSection({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: typeof Check;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-6">
      <h2 className="font-display text-[22px] font-semibold leading-snug text-fg">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-fg">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-pill bg-gold-soft text-gold">
              <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function PricingDetailPage({ params }: PricingDetailPageProps) {
  const { id } = await params;
  const pkg = getPackage(id);
  if (!pkg) notFound();

  const details = getPackageDetails(id);
  const badge = badgeFor(pkg);
  const free = isFreePackage(pkg);
  const fullDescription = details?.fullDescription ?? pkg.detail ?? pkg.description;

  return (
    <main data-testid="pricing-detail">
      <PageContainer variant="narrow" className="pb-40">
        <AppBar
          label={details?.tagline ?? "แพ็กเกจ"}
          title={pkg.name}
          caption={pkg.description}
          backHref="/pricing"
        />

        <Card className="space-y-4">
          {badge ? (
            <div>
              <PackageBadge label={badge} />
            </div>
          ) : null}
          <PriceTag pkg={pkg} size="lg" />
          <ConfidenceBar compact className="border-t border-line-faint pt-3" />
        </Card>

        <Card variant="sunk" className="mt-4">
          <p className="text-[15px] leading-relaxed text-fg">{fullDescription}</p>
        </Card>

        <ChecklistSection title="รายละเอียดที่จะได้รับ" items={pkg.features} icon={Check} />
        <ChecklistSection title="รวมในแพ็กเกจ" items={details?.includes ?? []} icon={Star} />

        {details ? (
          <Card variant="sunk" className="mt-6 grid grid-cols-2 gap-4" data-testid="pricing-delivery">
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[13px] text-fg-muted">ระยะเวลาทำงาน</p>
                <p className="text-sm font-bold text-fg">{details.deliveryTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[13px] text-fg-muted">รูปแบบที่ได้รับ</p>
                <p className="text-sm font-bold text-fg">{details.format}</p>
              </div>
            </div>
          </Card>
        ) : null}

        <BookingSteps className="mt-6" />
      </PageContainer>

      <div
        className="above-tabbar pointer-events-none fixed inset-x-0 z-30 bg-gradient-to-t from-bg via-bg/95 to-transparent px-4 pb-3 pt-8"
        data-testid="pricing-detail-cta"
      >
        <div className="pointer-events-auto mx-auto w-full max-w-[640px]">
          {free && pkg.href ? (
            <Button asChild variant="gold" size="lg" className="w-full">
              <Link href={pkg.href}>เริ่มเลย ฟรี</Link>
            </Button>
          ) : (
            <LineCtaButton label="จองแพ็กเกจนี้ทาง LINE" text={lineInquiryText(pkg)} />
          )}
        </div>
      </div>
    </main>
  );
}
