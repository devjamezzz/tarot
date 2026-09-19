import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Layers } from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { getCardById, TAROT_DECK } from "@/lib/tarot/deck";
import { arcanaLabelTh, cardNameTh } from "@/components/library/labels";

export function generateStaticParams() {
  return TAROT_DECK.map((card) => ({ cardId: card.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cardId: string }>;
}): Promise<Metadata> {
  const { cardId } = await params;
  const card = getCardById(cardId);
  if (!card) return {};
  const nameTh = cardNameTh(card);
  const arcanaLabel = arcanaLabelTh(card);
  return {
    title: `${nameTh} (${card.name}) — ความหมายไพ่ทาโรต์ ${arcanaLabel}`,
    description: `ความหมายไพ่${nameTh} (${card.name}) ทั้งตั้งตรงและกลับหัว พร้อมคีย์เวิร์ดและแนวทางเชิงปฏิบัติ — REFFORTUNE`,
    alternates: { canonical: `/library/${cardId}` },
    openGraph: {
      title: `${nameTh} — ไพ่ทาโรต์ REFFORTUNE`,
      description: `เรียนรู้ความหมายไพ่${nameTh} (${arcanaLabel}) ทั้งด้านบวกและด้านท้าทาย`,
      url: `/library/${cardId}`,
    },
  };
}

function KeywordChips({ keywords, tone }: { keywords: string[]; tone: "success" | "danger" }) {
  const cls =
    tone === "success"
      ? "border-success/40 bg-success/10 text-success"
      : "border-danger/40 bg-danger/10 text-danger";
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {keywords.map((kw) => (
        <span key={kw} className={`rounded-pill border px-2.5 py-0.5 text-[13px] ${cls}`}>
          {kw}
        </span>
      ))}
    </div>
  );
}

export default async function TarotCardDetailPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const card = getCardById(cardId);

  if (!card) {
    notFound();
  }

  const nameTh = cardNameTh(card);

  return (
    <PageContainer variant="narrow">
      <AppBar
        label={arcanaLabelTh(card)}
        title={nameTh}
        caption={`${card.name} · หมายเลข ${card.number}`}
        backHref="/library"
      />

      {card.image ? (
        <figure className="mx-auto mt-4 w-[220px]">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[10px] border border-gold/60 bg-sunk shadow-card">
            <Image src={card.image} alt={`ไพ่${nameTh}`} fill sizes="220px" priority className="object-cover" />
          </div>
        </figure>
      ) : null}

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-card border border-line-faint bg-sunk p-3">
          <dt className="text-[13px] text-fg-muted">ชุดไพ่</dt>
          <dd className="mt-1 font-medium text-fg">{arcanaLabelTh(card)}</dd>
        </div>
        <div className="rounded-card border border-line-faint bg-sunk p-3">
          <dt className="text-[13px] text-fg-muted">หมายเลข</dt>
          <dd className="mt-1 font-medium tabular-nums text-fg">{card.number}</dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="border-l-4 border-l-success">
          <h2 className="font-display text-lg font-semibold text-fg">ตั้งตรง</h2>
          <p className="mt-2 text-base leading-[1.65] text-fg">{card.meaningUpright}</p>
          <KeywordChips keywords={card.keywordsUpright} tone="success" />
        </Card>

        <Card className="border-l-4 border-l-danger">
          <h2 className="font-display text-lg font-semibold text-fg">กลับหัว</h2>
          <p className="mt-2 text-base leading-[1.65] text-fg">{card.meaningReversed}</p>
          <KeywordChips keywords={card.keywordsReversed} tone="danger" />
        </Card>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link href="/tarot" className={buttonVariants({ size: "lg", className: "w-full" })}>
          <Layers strokeWidth={1.5} />
          เปิดไพ่ถามเรื่องของคุณ
        </Link>
        <Link href="/library" className={buttonVariants({ variant: "ghost", className: "w-full" })}>
          กลับไปห้องสมุด
        </Link>
      </div>
    </PageContainer>
  );
}
