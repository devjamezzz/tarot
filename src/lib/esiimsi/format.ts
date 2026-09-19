import type { EsiimsiStick } from "./baseline";

/** รูปแบบ `ai` ที่ route /api/ai/tarot ส่งกลับ (ใช้ร่วมกับสาขาทาโรต์) */
export type EsiimsiAi = { summary: string; cardStructure: string };

export type EsiimsiAiSection = { title: string; lines: string[] };

/** เรื่องที่ผู้ใช้ตั้งจิตถาม — เลือกก่อนเขย่า แนบไปกับคำถาม AI และข้อความ LINE */
export type EsiimsiTopicId = "general" | "love" | "work" | "money";

export const ESIIMSI_TOPICS: readonly { id: EsiimsiTopicId; labelTh: string }[] = [
  { id: "general", labelTh: "ทั่วไป" },
  { id: "love", labelTh: "ความรัก" },
  { id: "work", labelTh: "การงาน" },
  { id: "money", labelTh: "การเงิน" },
];

export const DEFAULT_ESIIMSI_TOPIC: EsiimsiTopicId = "general";

export function isEsiimsiTopicId(value: unknown): value is EsiimsiTopicId {
  return typeof value === "string" && ESIIMSI_TOPICS.some((topic) => topic.id === value);
}

export function getEsiimsiTopicLabel(topic: EsiimsiTopicId): string {
  return ESIIMSI_TOPICS.find((t) => t.id === topic)?.labelTh ?? ESIIMSI_TOPICS[0].labelTh;
}

/** คำถามมาตรฐานที่บันทึกลงประวัติ — ฝั่ง client และ route สร้างข้อความเดียวกัน */
export function buildEsiimsiQuestion(number: number, topic: EsiimsiTopicId): string {
  return `เซียมซีหมายเลข ${number} · เรื่อง${getEsiimsiTopicLabel(topic)}`;
}

const SECTION = {
  work: "การงาน",
  love: "ความรัก",
  advice: "คำแนะนำ",
  opportunities: "โอกาส",
  risks: "สิ่งที่ควรระวัง",
  actions: "แนวทางที่ควรทำ",
} as const;

/** โครงคำทำนายตามตำราของใบ — ใช้เป็น `ai` ในคำตอบ fallback ของ route */
export function buildEsiimsiBaselineAi(stick: EsiimsiStick): EsiimsiAi {
  return {
    summary: stick.meaning,
    cardStructure: [
      `${SECTION.work}:\n${stick.work}`,
      `${SECTION.love}:\n${stick.love}`,
      `${SECTION.advice}:\n${stick.advice}`,
    ].join("\n\n"),
  };
}

type ParsedEsiimsiAi = { opportunities?: unknown; risks?: unknown; actions?: unknown };

function toLines(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
}

/** จัดคำตอบ Gemini ของเซียมซีเป็นบล็อก "หัวข้อ:" + รายการ (ไม่มีอีโมจิ) */
export function formatEsiimsiAiStructure(parsed: ParsedEsiimsiAi): string {
  const blocks: string[] = [];
  const push = (title: string, items: string[]) => {
    if (items.length) blocks.push(`${title}:\n${items.map((item) => `• ${item}`).join("\n")}`);
  };
  push(SECTION.opportunities, toLines(parsed.opportunities));
  push(SECTION.risks, toLines(parsed.risks));
  push(SECTION.actions, toLines(parsed.actions));
  return blocks.join("\n\n");
}

// ตัดเครื่องหมายหัวข้อและอีโมจินำหน้าออก ให้เหลือแต่ข้อความ
const LEADING_MARKERS = /^[\s•\-*]+/;
const LEADING_EMOJI = /^[\u2190-\u2BFF\u{1F000}-\u{1FAFF}\uFE0F\u200D]+\s*/u;

function cleanLine(line: string): string {
  return line.replace(LEADING_MARKERS, "").replace(LEADING_EMOJI, "").trim();
}

/** แยก cardStructure (บล็อกคั่นด้วยบรรทัดว่าง บรรทัดแรกลงท้ายด้วย ":" คือหัวข้อ) เพื่อนำไปเรนเดอร์ */
export function parseEsiimsiSections(text: string): EsiimsiAiSection[] {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.split("\n").map(cleanLine).filter(Boolean))
    .filter((lines) => lines.length > 0)
    .map((lines) => {
      const [first, ...rest] = lines;
      if (first.endsWith(":") && rest.length > 0) {
        return { title: first.slice(0, -1).trim(), lines: rest };
      }
      return { title: "", lines };
    });
}

/** ข้อความที่แนบไปกับปุ่ม LINE "ส่งผลเซียมซีให้หมอดู" */
export function buildEsiimsiLineText(stick: EsiimsiStick, topic: EsiimsiTopicId = DEFAULT_ESIIMSI_TOPIC): string {
  return [
    `เซียมซีใบที่ ${stick.number} · ${stick.titleTh}`,
    `เรื่องที่ถาม: ${getEsiimsiTopicLabel(topic)}`,
    stick.poem.join("\n"),
    `ความหมายตามตำรา: ${stick.meaning}`,
    "รบกวนหมอดูช่วยขยายความให้หน่อย",
  ].join("\n\n");
}
