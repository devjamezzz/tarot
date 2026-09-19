import {
  DEFAULT_PACKAGES,
  NEW_BADGE_LABEL,
  POPULAR_BADGE_LABEL,
  type PackageConfig,
} from "@/lib/packages/defaults";

/**
 * Extra copy for /pricing/[id] that does not belong in the shared
 * PackageConfig (which the home page and admin panel also read).
 * Keyed by DEFAULT_PACKAGES id; every string is Thai.
 */
export type PackageDetails = {
  /** One-line Thai tagline shown as the gold eyebrow. */
  tagline: string;
  fullDescription: string;
  includes: string[];
  deliveryTime: string;
  format: string;
};

export const PACKAGE_DETAILS: Record<string, PackageDetails> = {
  "esiimsi-promo": {
    tagline: "ฟรี ไม่จำกัดครั้ง",
    fullDescription:
      "เขย่าติ้วเสี่ยงทายตามแบบศาลเจ้า รับบทกลอนคำทำนายพร้อมคำอธิบายที่อ่านง่าย ใช้ได้ทันทีในเว็บโดยไม่ต้องจอง",
    includes: ["ใช้ได้ทันที ไม่ต้องรอ", "บันทึกผลลงคลังของคุณได้"],
    deliveryTime: "ทันที",
    format: "อ่านในเว็บ",
  },
  "horoscope-full": {
    tagline: "รายงานดวงชะตาส่วนตัว",
    fullDescription:
      "เจาะลึกทุกมิติชีวิตด้วยโหราศาสตร์ไทย ทั้งพื้นดวงเดิม ดวงชะตาปีนี้ การเสริมดวง และการ์ดคำแนะนำฮีลใจประจำปี",
    includes: ["ดวงรายปีครบทุกด้าน", "เคล็ดลับเสริมดวงเฉพาะบุคคล", "การ์ดฮีลใจประจำปี"],
    deliveryTime: "3-7 วัน",
    format: "ไฟล์เอกสาร 15-20 หน้า",
  },
  "tarot-10": {
    tagline: "ภาพรวมชีวิต 1-3 เดือน",
    fullDescription:
      "ดูภาพรวมดวงและทิศทางชีวิตในช่วงนี้ ครอบคลุมทุกเรื่องหลัก ทั้งการงาน การเงิน โชคลาภ ความรัก และจังหวะชีวิต",
    includes: ["พิมพ์สรุปและไฟล์เสียง", "คำแนะนำจากไพ่ที่นำไปใช้ได้จริง"],
    deliveryTime: "1-2 วัน",
    format: "คุยสาย 20-30 นาที หรือพิมพ์ตอบพร้อมไฟล์เสียง",
  },
  yearly: {
    tagline: "รู้จังหวะชีวิตล่วงหน้า",
    fullDescription:
      "รู้จังหวะชีวิตล่วงหน้า วางแผนให้แม่นยำ ดวงปีนี้ควรโฟกัสเรื่องอะไรที่สุด และช่วงไหนควรระวัง",
    includes: ["ไฮไลต์เด่นของปี", "ช่วงเวลาที่ควรระวัง", "ทริคเสริมโชค"],
    deliveryTime: "1-3 วัน",
    format: "ไฟล์เอกสาร หรือคุยสาย 1 ชั่วโมง",
  },
  "hora-report": {
    tagline: "ศาสตร์เลข 7 ตัว",
    fullDescription:
      "ใช้ศาสตร์เลข 7 ตัวทำนายเรื่องเด่นในช่วงอายุของคุณ ไม่ต้องใช้เวลาเกิดก็อ่านได้",
    includes: ["ทริคเสริมดวงเฉพาะช่วงอายุ"],
    deliveryTime: "1-3 วัน",
    format: "ไฟล์เอกสาร",
  },
  "qa-3": {
    tagline: "คุ้มค่าสำหรับหลายคำถาม",
    fullDescription:
      "เคลียร์ข้อสงสัยหลายเรื่องในครั้งเดียว เช็กดวง ดูแนวทาง ถาม-ตอบผ่านไพ่แบบพิมพ์ตอบกลับ",
    includes: ["ตอบเร็วสุดภายใน 1-2 ชั่วโมง", "เพิ่มเป็น 5 คำถามได้ในราคาพิเศษ"],
    deliveryTime: "ภายในวันเดียว",
    format: "พิมพ์ตอบกลับทาง LINE",
  },
  "qa-1": {
    tagline: "เริ่มต้นง่ายที่สุด",
    fullDescription: "มีข้อสงสัยเรื่องเดียว เปิดไพ่ถาม-ตอบเรื่องการงานหรือความรักได้ทันที",
    includes: ["ตอบภายในวันเดียว"],
    deliveryTime: "ภายในวันเดียว",
    format: "พิมพ์ตอบกลับทาง LINE",
  },
};

export function getPackage(id: string): PackageConfig | undefined {
  return DEFAULT_PACKAGES.find((pkg) => pkg.id === id);
}

export function getPackageDetails(id: string): PackageDetails | undefined {
  return PACKAGE_DETAILS[id];
}

/** Gold badge text (ยอดนิยม / มาใหม่), same rule as the home page. */
export function badgeFor(pkg: PackageConfig): string | null {
  if (pkg.subtitle === NEW_BADGE_LABEL) return NEW_BADGE_LABEL;
  if (pkg.popular || pkg.subtitle === POPULAR_BADGE_LABEL) return POPULAR_BADGE_LABEL;
  return null;
}

export function isFreePackage(pkg: PackageConfig): boolean {
  return pkg.price.trim() === "";
}

/** "฿929" → 929; "" or unparsable → null. */
export function parsePriceBaht(price: string): number | null {
  const digits = price.replace(/[^\d]/g, "");
  if (!digits) return null;
  const value = Number(digits);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function cheapestPriceBaht(packages: readonly PackageConfig[] = DEFAULT_PACKAGES): number | null {
  const prices = packages
    .map((pkg) => parsePriceBaht(pkg.price))
    .filter((value): value is number => value !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
}

/** Pre-filled LINE message that names the package (opened via lineMessageUrl). */
export function lineInquiryText(pkg: PackageConfig): string {
  const price = isFreePackage(pkg) ? "" : ` (${pkg.price})`;
  return `สวัสดี สนใจแพ็กเกจ "${pkg.name}"${price} ขอรายละเอียดและวิธีจอง`;
}
