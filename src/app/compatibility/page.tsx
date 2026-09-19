import type { Metadata } from "next";
import { CompatibilityForm } from "@/components/verticals/CompatibilityForm";

export const metadata: Metadata = {
  title: "ดูดวงความรัก ความเข้ากันตามโหราศาสตร์ไทย — REFFORTUNE",
  description:
    "ใส่วันเกิดของทั้งสองคน ระบบวิเคราะห์ความเข้ากันจากวันเกิด นักษัตร และธาตุ ตามตำราโหราศาสตร์ไทย",
  alternates: { canonical: "/compatibility" },
};

export default function ThaiCompatibilityPage() {
  return <CompatibilityForm />;
}
