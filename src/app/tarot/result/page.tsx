import type { Metadata } from "next";
import { Suspense } from "react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import ResultClient from "./ResultClient";

export const metadata: Metadata = {
  title: "ไพ่ของคุณ — REFFORTUNE",
  description:
    "ไพ่ทาโรต์ที่คุณเปิด พร้อมตำแหน่งในสเปรดและชื่อไพ่ภาษาไทย ส่งให้หมอดูทาง LINE ได้ทันที",
  robots: { index: false, follow: true },
};

function ResultFallback() {
  return (
    <PageContainer variant="narrow">
      <AppBar label="ไพ่ทาโรต์" title="ไพ่ของคุณ" caption="กำลังเปิดไพ่…" backHref="/tarot" />
      <div className="mt-4 grid grid-cols-3 gap-3" aria-hidden="true">
        <Skeleton className="aspect-[2/3]" />
        <Skeleton className="aspect-[2/3]" />
        <Skeleton className="aspect-[2/3]" />
      </div>
      <Skeleton className="mt-6 h-12 rounded-pill" />
      <p role="status" className="mt-4 text-center text-[13px] text-fg-muted">
        กำลังเปิดไพ่…
      </p>
    </PageContainer>
  );
}

export default function TarotResultPage() {
  return (
    <Suspense fallback={<ResultFallback />}>
      <ResultClient />
    </Suspense>
  );
}
