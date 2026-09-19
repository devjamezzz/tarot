/**
 * Turns a LibraryEntry into what the saved list shows: thumbnail, Thai title,
 * meta line and snippet. Shared by savedClient and the reading detail page.
 */
import {
  Compass,
  Hash,
  HeartHandshake,
  Layers,
  PenLine,
  Sparkle,
  Sparkles,
  Star,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type {
  ChineseZodiacData,
  CompatibilityData,
  HoroscopeData,
  LibraryEntry,
  NameNumerologyData,
  SavedDailyCardReading,
  SavedSpiritCardReading,
  SavedSpiritPathReading,
  SavedTarotReading,
  SpecializedData,
} from "@/lib/library/types";
import { ReadingType } from "@/lib/reading/types";
import { parseCardTokens } from "@/lib/tarot/engine";
import { getCardById } from "@/lib/tarot/deck";
import { formatThaiDate } from "@/lib/format/thaiDate";
import {
  animalTh,
  cardNameTh,
  domainTh,
  formatDateParts,
  periodTh,
  readingTypeTh,
  zodiacTh,
} from "./labels";

export type Thumbnail =
  | { kind: "image"; src: string; alt: string; rotate180?: boolean }
  | { kind: "icon"; icon: LucideIcon };

export interface EntryPresentation {
  title: string;
  meta: string;
  snippet: string;
  href: string;
}

export const TYPE_ICONS: Record<ReadingType, LucideIcon> = {
  [ReadingType.TAROT]: Layers,
  [ReadingType.DAILY_CARD]: Sun,
  [ReadingType.SPIRIT_CARD]: Sparkles,
  [ReadingType.NUMEROLOGY]: Hash,
  [ReadingType.HOROSCOPE]: Star,
  [ReadingType.COMPATIBILITY]: HeartHandshake,
  [ReadingType.CHINESE_ZODIAC]: Sparkle,
  [ReadingType.SPECIALIZED]: Compass,
  [ReadingType.NAME_NUMEROLOGY]: PenLine,
};

const SEP = " · ";

export function isSpiritPath(data: LibraryEntry["data"]): data is SavedSpiritPathReading {
  return "kind" in data && data.kind === "spirit_path";
}

/** Older saves carry an English "Spirit Card — …" title; rewrite the prefix. */
function legacyTitle(title: string | undefined): string {
  if (!title) return "";
  return title.replace(/^Spirit Card\s*[—-]\s*/i, "ไพ่จิตวิญญาณ — ").trim();
}

export function normalizeForSearch(input: unknown): string {
  if (input == null) return "";
  const value = typeof input === "string" ? input : String(input);
  // Basic Thai-safe normalization (no aggressive diacritic stripping)
  return value.normalize("NFKC").toLowerCase();
}

export function buildSearchText(entry: LibraryEntry): string {
  const parts: string[] = [readingTypeTh(entry.type)];

  if (entry.type === ReadingType.TAROT) {
    const r = entry.data as SavedTarotReading;
    parts.push("tarot", String(r.count), r.question ?? "", r.aiSummary ?? "");
  } else if (entry.type === ReadingType.DAILY_CARD) {
    const r = entry.data as SavedDailyCardReading;
    parts.push("daily card", r.dayKey, r.title ?? "", r.summary ?? "", ...(r.tags ?? []));
  } else if (entry.type === ReadingType.SPIRIT_CARD) {
    if (isSpiritPath(entry.data)) {
      const r = entry.data;
      parts.push("spirit path", `${r.day}/${r.month}/${r.year}`, r.title ?? "", r.interpretationMarkdown ?? "", ...(r.tags ?? []));
    } else {
      const s = entry.data as SavedSpiritCardReading;
      parts.push("spirit card", s.dob, s.title ?? "", s.aiSummary ?? "", s.aiCardStructure ?? "", ...(s.tags ?? []));
    }
  } else if (entry.type === ReadingType.HOROSCOPE) {
    const r = entry.data as HoroscopeData;
    parts.push("horoscope", r.zodiacSign, zodiacTh(r.zodiacSign), r.period, periodTh(r.period), r.advice);
  } else if (entry.type === ReadingType.COMPATIBILITY) {
    const r = entry.data as CompatibilityData;
    parts.push("compatibility", zodiacTh(r.person1.zodiacSign), zodiacTh(r.person2.zodiacSign), r.advice);
  } else if (entry.type === ReadingType.CHINESE_ZODIAC) {
    const r = entry.data as ChineseZodiacData;
    parts.push("chinese zodiac", r.animal, animalTh(r.animal), r.element, r.advice);
  } else if (entry.type === ReadingType.NAME_NUMEROLOGY) {
    const r = entry.data as NameNumerologyData;
    parts.push("name numerology", r.firstName, r.lastName, r.advice);
  } else if (entry.type === ReadingType.SPECIALIZED) {
    const r = entry.data as SpecializedData;
    parts.push("specialized", zodiacTh(r.zodiacSign), domainTh(r.domain), r.advice);
  }

  parts.push(entry.preview);
  return normalizeForSearch(parts.join("\n"));
}

function imageThumb(cardId: string, rotate180 = false): Thumbnail | null {
  const card = getCardById(cardId);
  if (!card?.image) return null;
  return { kind: "image", src: card.image, alt: `ไพ่${cardNameTh(card)}`, rotate180 };
}

export function getThumbnail(entry: LibraryEntry): Thumbnail {
  const fallback: Thumbnail = { kind: "icon", icon: TYPE_ICONS[entry.type] ?? Sparkles };

  if (entry.type === ReadingType.TAROT) {
    const first = parseCardTokens((entry.data as SavedTarotReading).cardsToken)[0];
    return (first && imageThumb(first.card.id, first.orientation === "reversed")) || fallback;
  }
  if (entry.type === ReadingType.DAILY_CARD) {
    const r = entry.data as SavedDailyCardReading;
    return imageThumb(r.cardId, r.orientation === "reversed") || fallback;
  }
  if (entry.type === ReadingType.SPIRIT_CARD) {
    if (isSpiritPath(entry.data)) return imageThumb(entry.data.zodiacCardId) || fallback;
    const s = entry.data as SavedSpiritCardReading;
    return imageThumb(s.cardId, s.orientation === "reversed") || fallback;
  }
  return fallback;
}

export function presentEntry(entry: LibraryEntry): EntryPresentation {
  const href = `/library/reading/${entry.id}`;
  const when = formatThaiDate(entry.createdAt, { withTime: true });

  if (entry.type === ReadingType.TAROT) {
    const r = entry.data as SavedTarotReading;
    return {
      title: r.question?.trim() ? r.question : `ทาโรต์ ${r.count} ใบ`,
      meta: ["ทาโรต์", `${r.count} ใบ`, when].join(SEP),
      snippet: r.aiSummary ?? entry.preview,
      href,
    };
  }

  if (entry.type === ReadingType.DAILY_CARD) {
    const r = entry.data as SavedDailyCardReading;
    const card = getCardById(r.cardId);
    return {
      title: r.title?.trim() ? r.title : `ไพ่ประจำวัน — ${card ? cardNameTh(card) : ""}`,
      meta: ["ไพ่ประจำวัน", formatThaiDate(r.dayKey), when].join(SEP),
      snippet: r.summary ?? entry.preview,
      href,
    };
  }

  if (entry.type === ReadingType.SPIRIT_CARD) {
    if (isSpiritPath(entry.data)) {
      const r = entry.data;
      const zodiac = getCardById(r.zodiacCardId);
      const soul = getCardById(r.soulCardId);
      const zLabel = zodiac ? cardNameTh(zodiac) : "";
      const sLabel = soul ? cardNameTh(soul) : "";
      return {
        title: r.title?.trim() ? r.title : `ไพ่ราศี ${zLabel} + ไพ่จิตวิญญาณ ${sLabel}`,
        meta: ["เส้นทางจิตวิญญาณ", `เกิด ${formatDateParts(r.day, r.month, r.year)}`, when].join(SEP),
        snippet: r.interpretationMarkdown ?? entry.preview,
        href,
      };
    }
    const s = entry.data as SavedSpiritCardReading;
    const card = getCardById(s.cardId);
    return {
      title: legacyTitle(s.title) || `ไพ่จิตวิญญาณ — ${card ? cardNameTh(card) : ""}`,
      meta: ["ไพ่จิตวิญญาณ", `เกิด ${formatThaiDate(s.dob)}`, when].join(SEP),
      snippet: s.aiSummary ?? entry.preview,
      href,
    };
  }

  if (entry.type === ReadingType.HOROSCOPE) {
    const r = entry.data as HoroscopeData;
    return {
      title: `ดวงชะตาราศี${zodiacTh(r.zodiacSign)}`,
      meta: ["ดวงชะตา", periodTh(r.period), when].join(SEP),
      snippet: r.advice ?? entry.preview,
      href,
    };
  }

  if (entry.type === ReadingType.COMPATIBILITY) {
    const r = entry.data as CompatibilityData;
    return {
      title: `ความเข้ากัน ${r.scores.overall}%`,
      meta: ["ความเข้ากัน", `ราศี${zodiacTh(r.person1.zodiacSign)} + ราศี${zodiacTh(r.person2.zodiacSign)}`, when].join(SEP),
      snippet: r.advice ?? entry.preview,
      href,
    };
  }

  if (entry.type === ReadingType.CHINESE_ZODIAC) {
    const r = entry.data as ChineseZodiacData;
    return {
      title: `ดวง${animalTh(r.animal)}`,
      meta: ["ราศีจีน", periodTh(r.period), when].join(SEP),
      snippet: r.advice ?? entry.preview,
      href,
    };
  }

  if (entry.type === ReadingType.NAME_NUMEROLOGY) {
    const r = entry.data as NameNumerologyData;
    return {
      title: `${r.firstName} ${r.lastName}`.trim(),
      meta: ["เลขศาสตร์ชื่อ", when].join(SEP),
      snippet: r.advice ?? entry.preview,
      href,
    };
  }

  if (entry.type === ReadingType.SPECIALIZED) {
    const r = entry.data as SpecializedData;
    return {
      title: domainTh(r.domain),
      meta: ["เฉพาะทาง", `ราศี${zodiacTh(r.zodiacSign)}`, periodTh(r.period), when].join(SEP),
      snippet: r.advice ?? entry.preview,
      href,
    };
  }

  return { title: "บันทึกการดูดวง", meta: when, snippet: entry.preview, href };
}

/** True when the saved entry contains AI-written text (drives the trust panel). */
export function entryUsedAi(entry: LibraryEntry): boolean {
  const data = entry.data as Partial<{
    aiEnhanced: boolean;
    aiSummary: string;
    aiCardStructure: string;
    interpretationMarkdown: string;
  }>;
  return Boolean(data.aiEnhanced || data.aiSummary || data.aiCardStructure || data.interpretationMarkdown);
}
