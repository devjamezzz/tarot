export interface BaseShareableData {
  date: string;
  brand?: string;
  vertical: "tarot" | "spirit" | "numerology" | "daily" | "horoscope" | "compatibility" | "chinese-zodiac";
}

export interface TarotShareCard {
  name: string;
  nameTh?: string;
  image?: string;
  /** Thai numeral for the face medallion (majors 0–21, pips 1–10); court cards omit it. */
  numeralTh?: string;
  orientation: "upright" | "reversed";
  /** Baseline meaning — optional; the share image never renders it. */
  meaning?: string;
  /** Thai position label from the spread (อดีต / ปัจจุบัน / …). */
  position?: string;
}

export interface TarotShareData extends BaseShareableData {
  vertical: "tarot";
  cards: TarotShareCard[];
  /** Engine summary — optional and hidden from the share image (owner constraint). */
  reading?: string;
  question?: string;
  /** Thai spread title, e.g. "อดีต-ปัจจุบัน-อนาคต". */
  spreadType: string;
  /** Thai topic label, e.g. "ความรัก". */
  topicTh?: string;
}

export interface SpiritShareData extends BaseShareableData {
  vertical: "spirit";
  cardName: string;
  cardNameTh?: string;
  cardImage?: string;
  birthDate: string;
  lifePath: string;
  meaning: string;
  guidance: string;
}

export interface NumerologyShareData extends BaseShareableData {
  vertical: "numerology";
  input: string;
  inputType: "phone" | "name";
  result: string;
  luckyNumbers: number[];
  analysis: string;
}

export interface DailyCardShareData extends BaseShareableData {
  vertical: "daily";
  cardName: string;
  cardNameTh?: string;
  cardImage?: string;
  meaning: string;
  advice: string;
  dayOfWeek: string;
}

export interface HoroscopeShareData extends BaseShareableData {
  vertical: "horoscope";
  zodiac: string;
  zodiacTh: string;
  element: string;
  prediction: string;
  lucky: {
    numbers: number[];
    color: string;
    direction: string;
  };
}

export interface CompatibilityShareData extends BaseShareableData {
  vertical: "compatibility";
  sign1: { name: string; nameTh: string; element: string };
  sign2: { name: string; nameTh: string; element: string };
  score: number;
  result: string;
  advice: string;
}

export interface ChineseZodiacShareData extends BaseShareableData {
  vertical: "chinese-zodiac";
  animal: string;
  animalTh: string;
  element: string;
  year: number;
  prediction: string;
  lucky: {
    numbers: number[];
    color: string;
  };
}

export type ShareableData =
  | TarotShareData
  | SpiritShareData
  | NumerologyShareData
  | DailyCardShareData
  | HoroscopeShareData
  | CompatibilityShareData
  | ChineseZodiacShareData;
