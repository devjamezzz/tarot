import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ไพ่จิตวิญญาณ — รับข้อความจากจักรวาลผ่านวันเกิด",
  description:
    "เปิดไพ่จิตวิญญาณกับ REFFORTUNE รับข้อความจากจักรวาลและคำแนะนำเชิงลึกจากวันเกิดของคุณ เข้าใจตัวเองมากขึ้น ใช้ได้จริงในชีวิตประจำวัน",
  alternates: { canonical: "/spirit-card" },
  openGraph: {
    title: "ไพ่จิตวิญญาณ — REFFORTUNE",
    description: "เปิดไพ่จิตวิญญาณ รับข้อความจากจักรวาลและคำแนะนำเชิงลึกจากวันเกิดของคุณ",
    url: "/spirit-card",
  },
};

export default function SpiritCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
