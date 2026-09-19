import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { DEFAULT_PACKAGES } from "@/lib/packages/defaults";
import { PageContainer } from "@/components/ui/PageContainer";
import { AppBar } from "@/components/nav/AppBar";
import { Card } from "@/components/ui/Card";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { PackageCard } from "@/components/pricing/PackageCard";
import { ConfidenceBar } from "@/components/pricing/ConfidenceBar";
import { BookingSteps } from "@/components/pricing/BookingSteps";
import { cheapestPriceBaht } from "@/components/pricing/packageDetails";
import { getPricingContextLine } from "@/components/pricing/pricingContext";

const cheapest = cheapestPriceBaht(DEFAULT_PACKAGES);
const startingAt = cheapest === null ? "" : ` เริ่มต้น ${cheapest} บาท`;

export const metadata: Metadata = {
  title: "ราคาบริการดูดวง — แพ็กเกจดูดวงออนไลน์",
  description: `ราคาบริการดูดวงกับ REFFORTUNE ทั้งแบบคุยสายและพิมพ์ตอบ${startingAt} จ่ายครั้งเดียว ไม่มีรายเดือน เลือกแพ็กที่เหมาะกับคุณ`,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "ราคาบริการดูดวง — REFFORTUNE",
    description: `เปรียบเทียบแพ็กเกจดูดวงออนไลน์${startingAt} จองผ่าน LINE`,
    url: "/pricing",
  },
};

type PricingPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const STAGGER_MS = 30;

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const contextLine = getPricingContextLine(params.source, params.reason);

  return (
    <main data-testid="pricing-page">
      <PageContainer variant="narrow">
        <AppBar
          label="แพ็กเกจ"
          title="แพ็กเกจดูดวงกับหมอดู"
          caption="ราคาเดียวกับหน้าแรก · จองผ่าน LINE"
          backHref="/"
        />

        {contextLine ? (
          <Card
            variant="sunk"
            role="status"
            data-testid="pricing-context"
            className="mb-4 flex items-start gap-3 border-gold/40"
          >
            <MessageCircle className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <p className="text-sm leading-relaxed text-fg">{contextLine}</p>
          </Card>
        ) : null}

        <ConfidenceBar />

        <ul className="mt-5 space-y-4" aria-label="รายการแพ็กเกจ">
          {DEFAULT_PACKAGES.map((pkg, index) => (
            <li key={pkg.id}>
              <PackageCard pkg={pkg} style={{ animationDelay: `${index * STAGGER_MS}ms` }} />
            </li>
          ))}
        </ul>

        <BookingSteps className="mt-6" />

        <Card className="mt-6 space-y-3" data-testid="pricing-consult">
          <p className="eyebrow">ยังไม่แน่ใจ</p>
          <h2 className="font-display text-[22px] font-semibold leading-snug text-fg">
            ให้หมอดูช่วยเลือกแพ็กเกจที่เหมาะกับคุณ
          </h2>
          <p className="text-sm leading-relaxed text-fg-muted">
            ทักมาเล่าสั้นๆ ว่าอยากถามเรื่องอะไร หมอดูจะแนะนำแพ็กเกจที่คุ้มที่สุดให้ก่อนตัดสินใจ
          </p>
          <LineCtaButton
            label="ปรึกษาก่อนทาง LINE"
            text="สวัสดี อยากปรึกษาว่าควรเลือกแพ็กเกจดูดวงแบบไหนดี"
          />
        </Card>
      </PageContainer>
    </main>
  );
}
