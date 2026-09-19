import type { Metadata } from "next";
import { HoroscopeForm } from "@/components/verticals/HoroscopeForm";
import { TimePeriod } from "@/lib/horoscope/types";

export const metadata: Metadata = {
  title: "ดูดวงรายเดือนตามราศี — REFFORTUNE",
  description: "เลือกราศีของคุณเพื่อดูดวงรายเดือน ความรัก การงาน การเงิน สุขภาพ พร้อมเลขและสีมงคล",
  alternates: { canonical: "/horoscope/monthly" },
};

export default function HoroscopeFormPage() {
  return <HoroscopeForm period={TimePeriod.MONTHLY} />;
}
