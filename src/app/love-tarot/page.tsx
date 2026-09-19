import type { Metadata } from "next";
import { LoveTarotClient } from "@/components/tarot/start/LoveTarotClient";

export const metadata: Metadata = {
  title: "ดวงความรัก — เปิดไพ่ถามเรื่องหัวใจ",
  description:
    "เปิดไพ่ทาโรต์ถามเรื่องความรัก ความรู้สึกของเขา และทิศทางความสัมพันธ์ของคุณกับ REFFORTUNE",
  alternates: { canonical: "/love-tarot" },
};

export default function LoveTarotPage() {
  return <LoveTarotClient />;
}
