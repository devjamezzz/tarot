import type { ReadingVertical } from "@/lib/reading/types";

/**
 * /pricing?source=<vertical>&reason=limit|intent is emitted by
 * src/lib/monetization/paywall.ts. Values are validated here (system
 * boundary) and turned into one contextual Thai line, or null.
 */
const SOURCE_LABELS: Record<ReadingVertical, string> = {
  tarot: "ไพ่ทาโรต์",
  "spirit-card": "ไพ่จิตวิญญาณ",
  numerology: "เลขศาสตร์",
};

type PricingReason = "limit" | "intent";

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toSource(value: string | undefined): ReadingVertical | null {
  return value && value in SOURCE_LABELS ? (value as ReadingVertical) : null;
}

function toReason(value: string | undefined): PricingReason | null {
  return value === "limit" || value === "intent" ? value : null;
}

export function getPricingContextLine(
  sourceParam: string | string[] | undefined,
  reasonParam: string | string[] | undefined
): string | null {
  const source = toSource(first(sourceParam));
  const reason = toReason(first(reasonParam));
  const subject = source ? SOURCE_LABELS[source] : "ดวง";

  if (reason === "limit") {
    return `คุณเปิด${subject}ฟรีครบ 3 ครั้งแล้ว — เลือกแพ็กเกจเพื่อให้หมอดูตัวจริงอ่านต่อให้คุณ`;
  }
  if (reason === "intent") {
    return `อยากได้คำตอบที่ละเอียดกว่านี้จาก${subject}? ให้หมอดูตัวจริงอ่านให้คุณแบบเจาะลึก`;
  }
  if (source) {
    return `มาจาก${subject} — เลือกแพ็กเกจที่เหมาะกับคำถามของคุณได้เลย`;
  }
  return null;
}
