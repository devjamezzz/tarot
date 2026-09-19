import {
  DEFAULT_SPREAD_ID,
  SPREADS,
  type SpreadDef,
  type TopicId,
} from "@/lib/tarot/spreads";

/** Topic-specific spreads first, then general spreads by card count. */
export function spreadsForTopic(topic: TopicId): SpreadDef[] {
  return SPREADS.filter((spread) => !spread.topics || spread.topics.includes(topic)).sort(
    (a, b) => {
      const aSpecific = a.topics ? 0 : 1;
      const bSpecific = b.topics ? 0 : 1;
      return aSpecific - bSpecific || a.count - b.count;
    }
  );
}

/**
 * Spreads shown before "เปลี่ยนรูปแบบไพ่": the recommended spread for the
 * topic first (it carries the แนะนำ badge and the sticky CTA), then one
 * runner-up that fits the topic's example questions.
 */
export const FEATURED_SPREAD_IDS: Record<TopicId, readonly [string, string]> = {
  general: [DEFAULT_SPREAD_ID, "one"],
  love: ["their-feelings", DEFAULT_SPREAD_ID],
  work: [DEFAULT_SPREAD_ID, "two-options"],
  money: [DEFAULT_SPREAD_ID, "two-options"],
};

export const RECOMMENDED_BADGE: Record<TopicId, string> = {
  general: "แนะนำสำหรับคำถามทั่วไป",
  love: "แนะนำสำหรับเรื่องความรัก",
  work: "แนะนำสำหรับเรื่องการงาน",
  money: "แนะนำสำหรับเรื่องการเงิน",
};

export function recommendedSpreadId(topic: TopicId): string {
  return FEATURED_SPREAD_IDS[topic][0];
}

export interface SpreadChoice {
  /** Target of the sticky CTA — the deep-linked spread when valid, else the recommendation. */
  current: SpreadDef;
  recommendedId: string;
  /** Always visible, `current` first (at most two). */
  featured: SpreadDef[];
  /** Collapsed under "เปลี่ยนรูปแบบไพ่". */
  others: SpreadDef[];
}

/**
 * Split the spreads for a topic into the two that stay visible and the rest.
 * `requestedId` comes from the `spread` query key (deep links / back-nav).
 */
export function chooseSpreads(
  topic: TopicId,
  requestedId?: string | null,
  spreads: SpreadDef[] = spreadsForTopic(topic)
): SpreadChoice {
  const recommendedId = recommendedSpreadId(topic);
  const byId = (id: string) => spreads.find((spread) => spread.id === id);

  const current = (requestedId ? byId(requestedId) : undefined) ?? byId(recommendedId) ?? spreads[0];

  const featured = [current.id, ...FEATURED_SPREAD_IDS[topic]]
    .filter((id, index, ids) => ids.indexOf(id) === index)
    .map(byId)
    .filter((spread): spread is SpreadDef => spread !== undefined)
    .slice(0, 2);

  const others = spreads.filter((spread) => !featured.includes(spread));

  return { current, recommendedId, featured, others };
}
