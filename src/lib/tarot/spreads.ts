/**
 * Named tarot spreads + the query-string contract shared by
 * /tarot (start) → /tarot/pick → /tarot/result.
 *
 * Query keys `count`, `cards`, `question` and the `<id>.<orientation>`
 * cards token are load-bearing: library detail re-parses them. Never rename.
 */

export type TopicId = "general" | "love" | "work" | "money";

export const TOPICS: { id: TopicId; labelTh: string }[] = [
  { id: "general", labelTh: "ทั่วไป" },
  { id: "love", labelTh: "ความรัก" },
  { id: "work", labelTh: "การงาน" },
  { id: "money", labelTh: "การเงิน" },
];

export const DEFAULT_TOPIC: TopicId = "general";

export function isTopicId(value: unknown): value is TopicId {
  return TOPICS.some((topic) => topic.id === value);
}

export const EXAMPLE_QUESTIONS: Record<TopicId, string[]> = {
  general: [
    "ช่วงนี้ควรโฟกัสเรื่องอะไร",
    "สิ่งที่ควรปล่อยวางตอนนี้คืออะไร",
    "เดือนนี้มีอะไรรอคุณอยู่",
  ],
  love: [
    "เขาคิดยังไงกับเรา",
    "ความสัมพันธ์นี้จะไปทางไหน",
    "ควรเปิดใจให้คนใหม่ไหม",
  ],
  work: [
    "ควรเปลี่ยนงานไหม",
    "งานที่ทำอยู่จะก้าวหน้าไหม",
    "ควรรับข้อเสนอนี้หรือไม่",
  ],
  money: [
    "การเงินช่วงนี้จะเป็นอย่างไร",
    "ควรลงทุนตอนนี้ไหม",
    "จะมีโชคลาภเข้ามาไหม",
  ],
};

export type SpreadCount = 1 | 2 | 3 | 4 | 5 | 10;

export type SpreadDef = {
  id: string;
  count: SpreadCount;
  titleTh: string;
  descriptionTh: string;
  positionsTh: string[];
  /** When set, the spread is only suggested for these topics. */
  topics?: TopicId[];
};

export const DEFAULT_SPREAD_ID = "past-present-future";

export const SPREADS: SpreadDef[] = [
  {
    id: "one",
    count: 1,
    titleTh: "ไพ่หนึ่งใบ",
    descriptionTh: "คำตอบสั้นๆ สำหรับคำถามเดียว",
    positionsTh: ["คำตอบ"],
  },
  {
    id: "their-feelings",
    count: 2,
    titleTh: "ความรู้สึกของเขา",
    descriptionTh: "เขารู้สึกอย่างไร และต้องการอะไรจากคุณ",
    positionsTh: ["ความรู้สึกของเขา", "สิ่งที่เขาต้องการ"],
    topics: ["love"],
  },
  {
    id: "two-options",
    count: 2,
    titleTh: "ทางเลือก 2 ทาง",
    descriptionTh: "เปรียบเทียบสองทางที่คุณกำลังลังเล",
    positionsTh: ["ทางเลือกที่ 1", "ทางเลือกที่ 2"],
  },
  {
    id: "past-present-future",
    count: 3,
    titleTh: "อดีต-ปัจจุบัน-อนาคต",
    descriptionTh: "เห็นที่มา สถานะตอนนี้ และทิศทางข้างหน้า",
    positionsTh: ["อดีต", "ปัจจุบัน", "อนาคต"],
  },
  {
    id: "situation",
    count: 4,
    titleTh: "สถานการณ์และคำแนะนำ",
    descriptionTh: "มองสถานการณ์ อุปสรรค และทางออกที่ควรทำ",
    positionsTh: ["สถานการณ์", "อุปสรรค", "คำแนะนำ", "ผลลัพธ์"],
  },
  {
    id: "five",
    count: 5,
    titleTh: "เจาะลึก 5 ใบ",
    descriptionTh: "อ่านรอบด้านทั้งที่ผ่านมา สิ่งที่ซ่อนอยู่ และแนวโน้ม",
    positionsTh: ["สถานการณ์ปัจจุบัน", "สิ่งที่ผ่านมา", "สิ่งที่ซ่อนอยู่", "คำแนะนำ", "แนวโน้ม"],
  },
  {
    id: "celtic-cross",
    count: 10,
    titleTh: "เซลติกครอส 10 ใบ",
    descriptionTh: "ภาพรวมชีวิตแบบละเอียดที่สุด ครบทุกมิติ",
    positionsTh: [
      "สถานการณ์ปัจจุบัน",
      "ความท้าทาย",
      "รากของปัญหา",
      "อดีตที่ผ่านมา",
      "สิ่งที่มุ่งหวัง",
      "อนาคตใกล้",
      "ตัวคุณ",
      "สิ่งแวดล้อม",
      "ความหวัง/ความกลัว",
      "ผลลัพธ์โดยรวม",
    ],
  },
];

/**
 * Resolve a spread by id, falling back to the first general spread with the
 * given card count, then to the default 3-card spread.
 */
export function getSpread(id?: string | null, count?: number | null): SpreadDef {
  const byId = id ? SPREADS.find((spread) => spread.id === id) : undefined;
  if (byId) return byId;

  if (typeof count === "number" && Number.isFinite(count)) {
    const byCount =
      SPREADS.find((spread) => spread.count === count && !spread.topics) ??
      SPREADS.find((spread) => spread.count === count);
    if (byCount) return byCount;
  }

  return SPREADS.find((spread) => spread.id === DEFAULT_SPREAD_ID) ?? SPREADS[0];
}

export const PICK_QUERY = {
  count: "count",
  cards: "cards",
  question: "question",
  spread: "spread",
  topic: "topic",
} as const;

export const TAROT_PICK_PATH = "/tarot/pick";
export const TAROT_RESULT_PATH = "/tarot/result";

export const MAX_QUESTION_LENGTH = 200;

type QuerySource = URLSearchParams | Record<string, string | undefined>;

function readParam(sp: QuerySource, key: string): string | undefined {
  const value = sp instanceof URLSearchParams ? sp.get(key) : sp[key];
  return value ?? undefined;
}

export function normalizeQuestion(value: string | null | undefined): string {
  return (value ?? "").trim().slice(0, MAX_QUESTION_LENGTH);
}

export function parsePickQuery(sp: QuerySource): {
  spread: SpreadDef;
  topic: TopicId;
  question: string;
} {
  const rawCount = Number(readParam(sp, PICK_QUERY.count));
  const spread = getSpread(
    readParam(sp, PICK_QUERY.spread),
    Number.isFinite(rawCount) && rawCount > 0 ? rawCount : null
  );
  const rawTopic = readParam(sp, PICK_QUERY.topic);
  const topic = isTopicId(rawTopic) ? rawTopic : DEFAULT_TOPIC;
  const question = normalizeQuestion(readParam(sp, PICK_QUERY.question));

  return { spread, topic, question };
}

function buildQuery(entries: Array<[string, string | number | undefined]>): string {
  const params = new URLSearchParams();
  for (const [key, value] of entries) {
    if (value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  return params.toString();
}

export function buildPickHref(input: {
  spreadId: string;
  topic?: TopicId;
  question?: string;
}): string {
  const spread = getSpread(input.spreadId);
  const query = buildQuery([
    [PICK_QUERY.count, spread.count],
    [PICK_QUERY.spread, spread.id],
    [PICK_QUERY.topic, input.topic],
    [PICK_QUERY.question, normalizeQuestion(input.question)],
  ]);
  return `${TAROT_PICK_PATH}?${query}`;
}

export function buildResultHref(input: {
  spreadId: string;
  topic?: TopicId;
  question?: string;
  cardsToken: string;
  count?: number;
}): string {
  const spread = getSpread(input.spreadId);
  const query = buildQuery([
    [PICK_QUERY.count, input.count ?? spread.count],
    [PICK_QUERY.cards, input.cardsToken],
    [PICK_QUERY.spread, spread.id],
    [PICK_QUERY.topic, input.topic],
    [PICK_QUERY.question, normalizeQuestion(input.question)],
  ]);
  return `${TAROT_RESULT_PATH}?${query}`;
}
