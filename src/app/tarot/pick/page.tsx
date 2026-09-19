import type { Metadata } from "next";
import { Suspense } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import { PickGridSkeleton } from "@/components/tarot/pick/PickGrid";
import PickClient from "./PickClient";

export const metadata: Metadata = {
  title: "เลือกไพ่ทาโรต์ — ตั้งจิตอธิษฐานแล้วเปิดไพ่",
  description:
    "ตั้งจิตอธิษฐานกับคำถามในใจ แล้วแตะเลือกไพ่ทาโรต์ที่ดึงดูดคุณ ก่อนเปิดไพ่ทีละใบกับ REFFORTUNE",
  robots: { index: false, follow: true },
};

function PickFallback() {
  return (
    <main>
      <PageContainer variant="narrow">
        <div className="px-5 pt-6 pb-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-3 h-8 w-52" />
          <p className="mt-2 text-[13px] text-fg-muted">กำลังเตรียมไพ่…</p>
        </div>
        <PickGridSkeleton className="mt-5" />
      </PageContainer>
    </main>
  );
}

export default function TarotPickPage() {
  return (
    <Suspense fallback={<PickFallback />}>
      <PickClient />
    </Suspense>
  );
}
