import type { Metadata } from "next";
import { ChineseZodiacForm } from "@/components/verticals/ChineseZodiacForm";

export const metadata: Metadata = {
  title: "ดูดวงจีน 12 นักษัตร จากปีเกิด — REFFORTUNE",
  description:
    "ใส่ปีเกิด (พ.ศ. หรือ ค.ศ.) ระบบหานักษัตรและธาตุประจำตัว แล้วดูดวงรายวัน รายสัปดาห์ หรือรายเดือน",
  alternates: { canonical: "/chinese-zodiac" },
};

export default function ChineseZodiacPage() {
  return <ChineseZodiacForm />;
}
