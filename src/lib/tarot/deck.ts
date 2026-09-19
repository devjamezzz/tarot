import { TarotCard, Suit } from "./types";
import { FORTUNE_DECK } from "./fortuneDeck";

const suitByPrefix: Record<string, Suit> = {
  wan: "wands",
  cup: "cups",
  swo: "swords",
  pen: "pentacles",
};

const courtNumber: Record<string, number> = {
  p: 11,
  k: 12,
  q: 13,
  K: 14,
};

// Thai names for the 22 majors, indexed by the number in `majNN`.
const MAJOR_NAMES_TH: string[] = [
  "คนโง่",
  "นักมายากล",
  "นักบวชหญิง",
  "จักรพรรดินี",
  "จักรพรรดิ",
  "นักบวช",
  "คู่รัก",
  "ราชรถ",
  "พละกำลัง",
  "ฤๅษี",
  "กงล้อโชคชะตา",
  "ความยุติธรรม",
  "คนถูกแขวน",
  "ความตาย",
  "ความพอดี",
  "ปีศาจ",
  "หอคอย",
  "ดวงดาว",
  "ดวงจันทร์",
  "ดวงอาทิตย์",
  "การพิพากษา",
  "โลก",
];

// Minor ranks keyed by the id tail (`wan01` → "01", `wan_p` → "_p").
const RANK_NAMES_TH: Record<string, string> = {
  "01": "เอซ",
  "02": "สอง",
  "03": "สาม",
  "04": "สี่",
  "05": "ห้า",
  "06": "หก",
  "07": "เจ็ด",
  "08": "แปด",
  "09": "เก้า",
  "10": "สิบ",
  _p: "เพจ",
  _k: "ไนท์",
  _q: "ควีน",
  _K: "คิง",
};

const SUIT_NAMES_TH: Record<Suit, string> = {
  wands: "ไม้เท้า",
  cups: "ถ้วย",
  swords: "ดาบ",
  pentacles: "เหรียญ",
};

function inferSuit(id: string): Suit | undefined {
  return suitByPrefix[id.slice(0, 3)];
}

function inferNumber(id: string): number {
  if (id.startsWith("maj")) {
    return Number(id.slice(3)) || 0;
  }

  const tail = id.slice(3);
  if (tail in courtNumber) {
    return courtNumber[tail as keyof typeof courtNumber];
  }

  const n = Number(tail);
  return Number.isFinite(n) ? n : 0;
}

function inferNameTh(id: string): string | undefined {
  if (id.startsWith("maj")) {
    return MAJOR_NAMES_TH[Number(id.slice(3))];
  }

  const suit = inferSuit(id);
  const rank = RANK_NAMES_TH[id.slice(3)];
  return suit && rank ? `${rank}แห่ง${SUIT_NAMES_TH[suit]}` : undefined;
}

function baseKeywords(cardId: string): string[] {
  const suit = inferSuit(cardId);
  if (suit === "wands") return ["พลังงาน", "การลงมือทำ", "ความกล้า"];
  if (suit === "cups") return ["ความสัมพันธ์", "อารมณ์", "หัวใจ"];
  if (suit === "swords") return ["ความคิด", "การตัดสินใจ", "ความชัดเจน"];
  if (suit === "pentacles") return ["งาน", "การเงิน", "ความมั่นคง"];
  return ["จังหวะชีวิต", "โอกาส", "การเติบโต"];
}

export const TAROT_DECK: TarotCard[] = FORTUNE_DECK.map((entry) => {
  const keywords = baseKeywords(entry.id);
  const suit = inferSuit(entry.id);

  // Use the original image path from the synced fortune deck
  // and normalize it to a public URL (always leading with "/").
  const rawImagePath = entry.img ?? "";
  const imagePath = rawImagePath.startsWith("/")
    ? rawImagePath
    : `/${rawImagePath}`;

  return {
    id: entry.id,
    name: entry.name,
    nameTh: inferNameTh(entry.id),
    arcana: entry.id.startsWith("maj") ? "major" : "minor",
    suit,
    number: inferNumber(entry.id),
    keywordsUpright: keywords,
    keywordsReversed: ["ทบทวน", "ชะลอ", ...keywords],
    meaningUpright: entry.dailyAdvice,
    meaningReversed: `มุมเงา: ${entry.dailyAdvice}`,
    image: imagePath,
    source: "fortune",
  };
});

export const TAROT_DECK_BY_ID = new Map(TAROT_DECK.map((card) => [card.id, card]));

export function getCardById(cardId: string): TarotCard | null {
  return TAROT_DECK_BY_ID.get(cardId) ?? null;
}
