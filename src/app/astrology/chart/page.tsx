import type { Metadata } from "next";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { ChartClient } from "./ChartClient";

export const metadata: Metadata = {
  title: "จักรราศีวิภาค — คำนวณดวงชะตาโหราศาสตร์ไทย สุริยยาตร์ / นิรายนะ",
  description:
    "คำนวณดวงชะตาตามโหราศาสตร์ไทย แสดงผลแบบจักรราศีวิภาค พร้อมตำแหน่ง 11 ดาว ราศี องศา นวางค์ นักษัตร และบาท สลับระบบสุริยยาตร์ / นิรายนะ (Lahiri) ได้",
  alternates: { canonical: "/astrology/chart" },
  openGraph: {
    title: "จักรราศีวิภาค — REFFORTUNE",
    description: "คำนวณดวงชะตาแบบโหราศาสตร์ไทย สุริยยาตร์ และนิรายนะ (Lahiri)",
    url: "/astrology/chart",
  },
};

export default function ChartPage() {
  return (
    <PageContainer variant="wide">
      <AppBar
        label="โหราศาสตร์"
        title="จักรราศีวิภาค"
        caption="คำนวณดวงชะตาตามวันเดือนปีเกิดและสถานที่ แสดงผลแบบโหราศาสตร์ไทยพร้อมตารางสมผุสครบ 11 ดาว"
        backHref="/astrology"
      />
      <ChartClient />
    </PageContainer>
  );
}
