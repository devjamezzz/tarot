import type { Metadata } from "next";
import { HoroscopeForm } from "@/components/verticals/HoroscopeForm";
import { TimePeriod } from "@/lib/horoscope/types";

export const metadata: Metadata = {
  title: "ดูดวงรายสัปดาห์ตามราศี — REFFORTUNE",
  description: "เลือกราศีของคุณเพื่อดูดวงรายสัปดาห์ ความรัก การงาน การเงิน สุขภาพ พร้อมเลขและสีมงคล",
  alternates: { canonical: "/horoscope/weekly" },
};

export default function HoroscopeFormPage() {
  return <HoroscopeForm period={TimePeriod.WEEKLY} />;
}
