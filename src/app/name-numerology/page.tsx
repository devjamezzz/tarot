import type { Metadata } from "next";
import { NameNumerologyForm } from "@/components/verticals/NameNumerologyForm";

export const metadata: Metadata = {
  title: "เลขศาสตร์ชื่อ วิเคราะห์ชื่อ-นามสกุล — REFFORTUNE",
  description:
    "พิมพ์ชื่อและนามสกุลภาษาไทย ระบบแปลงตัวอักษรเป็นตัวเลขตามตำราเลขศาสตร์ อ่านบุคลิกภาพ จุดแข็ง เส้นทางชีวิต และเลขมงคล",
  alternates: { canonical: "/name-numerology" },
};

/**
 * Name Numerology Input Page
 * Feature: popular-fortune-features — Requirements: 6.1, 6.6, 6.7, 9.6
 */
export default function NameNumerologyPage() {
  return <NameNumerologyForm />;
}
