/**
 * Single source of truth for the fortune-teller packages shown on the home
 * page, /pricing and the admin panel. The config store seeds from here and
 * re-seeds on persist-version bumps.
 *
 * Server-safe: no client imports, so server components (e.g. /pricing/[id]
 * generateStaticParams) can read it.
 */

export type PackageConfig = {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  priceAlt?: string;
  description: string;
  detail?: string;
  features: string[];
  popular?: boolean;
  href?: string;
};

export const POPULAR_BADGE_LABEL = "ยอดนิยม";
export const NEW_BADGE_LABEL = "มาใหม่";

export const DEFAULT_PACKAGES: PackageConfig[] = [
  {
    id: "esiimsi-promo",
    name: "เซียมซีเสี่ยงทาย",
    subtitle: NEW_BADGE_LABEL,
    price: "",
    description: "เขย่าติ้วรับคำทำนายโบราณ",
    detail: "ศาสตร์การเสี่ยงทายจากวัดดังทั่วไทย",
    features: [
      "ระบบเขย่าติ้วแบบ 3 มิติ",
      "ถอดรหัสคำทำนายเชิงลึก",
      "แนะนำแนวทางแก้ไขและโอกาส",
      "น้อมรับคำทำนายได้ไม่จำกัด",
    ],
    popular: true,
    href: "/esiimsi",
  },
  {
    id: "horoscope-full",
    name: "เปิดดวงชะตาฉบับเต็ม",
    subtitle: "รายงานดวงชะตาส่วนตัว",
    price: "฿929",
    description: "ไฟล์เอกสาร 15-20 หน้า",
    detail: "เจาะลึกทุกมิติชีวิตด้วยโหราศาสตร์ไทย ทำ 3-7 วัน",
    features: [
      "พื้นดวงเดิมและตัวตนภายใน",
      "การเงิน & ความมั่งคั่ง",
      "อาชีพ & ความสำเร็จ",
      "ความรัก & คู่ครอง",
      "ดวงรายปี 2026 ครบทุกด้าน",
      "เคล็ดลับเสริมดวงเฉพาะบุคคล",
      "การ์ดฮีลใจประจำปี",
    ],
    popular: true,
  },
  {
    id: "tarot-10",
    name: "ไพ่ 10 ใบ + โหราศาสตร์",
    subtitle: POPULAR_BADGE_LABEL,
    price: "฿389",
    description: "คุยสาย 20-30 นาที",
    detail: "ดูทิศทางชีวิต 1-3 เดือน ชี้ชัดเรื่องไหนเด่น",
    features: [
      "ไพ่ 10 ใบ ดูภาพรวมชีวิต",
      "การงาน การเงิน ความรัก",
      "โชคลาภ คนรอบข้าง สุขภาพ",
      "อ่านคู่โหราศาสตร์",
      "พิมพ์ + อัดเสียง",
    ],
    popular: false,
  },
  {
    id: "yearly",
    name: "ดูดวงรายปี",
    subtitle: "รู้จังหวะชีวิตล่วงหน้า",
    price: "฿489",
    priceAlt: "฿749 (คุยสาย 1 ชั่วโมง)",
    description: "ไฟล์เอกสาร หรือคุยสาย",
    detail: "วางแผนให้แม่นยำ รู้ก่อนล่วงหน้า",
    features: ["ดวงปีนี้โฟกัสอะไร", "เงิน งาน รัก โชค", "ไฮไลท์ครบ พร้อมระวัง", "ทริคเสริมโชค"],
    popular: false,
  },
  {
    id: "hora-report",
    name: "ดวงรายปี เลข 7 ตัว",
    subtitle: "เลข 7 ตัว",
    price: "฿489",
    description: "ไม่ต้องใช้เวลาเกิด",
    detail: "ศาสตร์เลข 7 ตัว ไม่ต้องใช้เวลาเกิด",
    features: [
      "เลข 7 ตัว แม่นยำ",
      "ดวงช่วงอายุนั้นๆ",
      "อะไรดี อะไรปัง อะไรระวัง",
      "เงิน งาน รัก สุขภาพ",
      "ทริคเสริมดวง",
    ],
    popular: false,
  },
  // Standing typed-Q&A prices, aligned with /pricing (the ฿99 / ฿39 "ถึง 31 ม.ค."
  // promos have expired and are intentionally not carried forward).
  {
    id: "qa-3",
    name: "แพ็ก 3 คำถาม (พิมพ์ตอบ)",
    subtitle: "คุ้มค่า",
    price: "฿125",
    priceAlt: "5 คำถาม ฿195",
    description: "พิมพ์ตอบกลับ",
    detail: "เคลียร์ข้อสงสัยหลายเรื่องในครั้งเดียว",
    features: ["ไพ่ถามตอบ 3 คำถาม", "เช็คดวง ดูแนวทาง", "พิมพ์ตอบกลับ", "เร็วสุด 1-2 ชั่วโมง"],
    popular: false,
  },
  {
    id: "qa-1",
    name: "ถาม 1 คำถาม (พิมพ์ตอบ)",
    subtitle: "เริ่มต้น",
    price: "฿45",
    description: "พิมพ์ตอบกลับ",
    detail: "มีข้อสงสัย เปิดไพ่ถามตอบ",
    features: ["ไพ่ถามตอบ 1 คำถาม", "การงาน ความรัก", "พิมพ์ตอบกลับ"],
    popular: false,
  },
];
