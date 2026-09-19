import type { Metadata } from "next";
import { SpecializedForm } from "@/components/verticals/SpecializedForm";

export const metadata: Metadata = {
  title: "ดูดวงเฉพาะด้าน การงาน การเงิน ความรัก — REFFORTUNE",
  description:
    "เลือกด้านที่อยากรู้ ราศี และช่วงเวลา รับคำทำนายเจาะลึกพร้อมโอกาส อุปสรรค และสิ่งที่ควรทำ",
  alternates: { canonical: "/specialized" },
};

export default function SpecializedPage() {
  return <SpecializedForm />;
}
