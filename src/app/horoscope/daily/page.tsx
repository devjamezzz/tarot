import type { Metadata } from "next";
import { HoroscopeForm } from "@/components/verticals/HoroscopeForm";
import { TimePeriod } from "@/lib/horoscope/types";

export const metadata: Metadata = {
  title: "ดูดวงรายวันตามราศี — REFFORTUNE",
  description: "เลือกราศีของคุณเพื่อดูดวงรายวัน ความรัก การงาน การเงิน สุขภาพ พร้อมเลขและสีมงคล",
  alternates: { canonical: "/horoscope/daily" },
};

export default function HoroscopeFormPage() {
  return <HoroscopeForm period={TimePeriod.DAILY} />;
}
