import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookMarked } from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { arcanaLabelTh, cardNameTh } from "@/components/library/labels";

export const metadata: Metadata = {
  title: "ห้องสมุดไพ่ทาโรต์ 78 ใบ — ความหมายครบทุกใบ",
  description:
    "ค้นหาความหมายไพ่ทาโรต์ทั้ง 78 ใบ ไพ่ชุดหลักและไพ่ชุดรอง พร้อมคีย์เวิร์ดตั้งตรงและกลับหัว แนวทางเชิงปฏิบัติ เข้าใจง่าย",
  alternates: { canonical: "/library" },
  openGraph: {
    title: "ห้องสมุดไพ่ทาโรต์ 78 ใบ — REFFORTUNE",
    description: "ค้นหาความหมายไพ่ทาโรต์ทุกใบ พร้อมแนวทางเชิงปฏิบัติ",
    url: "/library",
  },
};

export default function TarotLibraryPage() {
  return (
    <PageContainer variant="wide">
      <AppBar
        label="ห้องสมุด"
        title="ไพ่ทาโรต์ 78 ใบ"
        caption="ค้นหาความหมายไพ่แต่ละใบแบบรวดเร็ว พร้อมแนวทางเชิงปฏิบัติ"
        backHref="/explore"
        right={
          <Link href="/library/saved" className={buttonVariants({ size: "sm" })}>
            <BookMarked strokeWidth={1.5} />
            คลังของฉัน
          </Link>
        }
      />

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {TAROT_DECK.map((card) => {
          const nameTh = cardNameTh(card);
          return (
            <li key={card.id}>
              <Link
                href={`/library/${card.id}`}
                className="block h-full rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Card interactive className="flex h-full flex-col p-3 md:p-3">
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[10px] border border-gold/40 bg-sunk">
                    {card.image ? (
                      <Image
                        src={card.image}
                        alt={`ไพ่${nameTh}`}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="mt-3 text-[13px] text-fg-subtle">{arcanaLabelTh(card)}</p>
                  <h2 className="font-display text-base font-semibold leading-snug text-fg">{nameTh}</h2>
                  <p className="text-[13px] text-fg-muted">{card.name}</p>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-fg-muted">{card.meaningUpright}</p>
                </Card>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageContainer>
  );
}
