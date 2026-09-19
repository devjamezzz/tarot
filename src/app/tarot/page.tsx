import type { Metadata } from "next";
import { Suspense } from "react";
import { TarotStartClient } from "@/components/tarot/start/TarotStartClient";
import { TarotStartSkeleton } from "@/components/tarot/start/TarotStartSkeleton";

export const metadata: Metadata = {
  title: "ไพ่ทาโรต์ — ตั้งคำถามแล้วเลือกรูปแบบไพ่",
  description:
    "เลือกหัวข้อ พิมพ์คำถามในใจ แล้วเลือกรูปแบบไพ่ทาโรต์ที่ตรงกับคำถามของคุณ ก่อนเลือกไพ่ด้วยตัวเองกับ REFFORTUNE",
  alternates: { canonical: "/tarot" },
};

export default function TarotStartPage() {
  return (
    <Suspense fallback={<TarotStartSkeleton />}>
      <TarotStartClient />
    </Suspense>
  );
}
