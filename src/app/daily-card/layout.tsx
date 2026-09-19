import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ไพ่ประจำวัน — เปิดไพ่ทาโรต์ประจำวัน",
  description:
    "เปิดไพ่ทาโรต์ประจำวันกับ REFFORTUNE รับข้อความและคำแนะนำสำหรับวันนี้ เริ่มต้นวันใหม่ด้วยทิศทางที่ชัดเจน",
  alternates: { canonical: "/daily-card" },
  openGraph: {
    title: "ไพ่ประจำวัน — REFFORTUNE",
    description: "เปิดไพ่ทาโรต์ประจำวัน รับข้อความและคำแนะนำเริ่มต้นวันใหม่",
    url: "/daily-card",
    images: [
      {
        url: "/daily.jpg",
        width: 1200,
        height: 630,
        alt: "ไพ่ประจำวัน — REFFORTUNE เปิดไพ่ทาโรต์ประจำวัน",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ไพ่ประจำวัน — REFFORTUNE",
    description: "เปิดไพ่ทาโรต์ประจำวัน รับข้อความและคำแนะนำเริ่มต้นวันใหม่",
    images: ["/daily.jpg"],
  },
};

export default function DailyCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
