import { PICK_QUERY, normalizeQuestion, type TopicId } from "@/lib/tarot/spreads";

export const TAROT_START_PATH = "/tarot";

/**
 * Home / explore → /tarot start page. Uses the shared PICK_QUERY key names so
 * the tarot start page can read `question` and `topic` with parsePickQuery.
 */
export function buildTarotStartHref(input: { question?: string; topic?: TopicId | null }): string {
  const params = new URLSearchParams();
  const question = normalizeQuestion(input.question);
  if (question) params.set(PICK_QUERY.question, question);
  if (input.topic) params.set(PICK_QUERY.topic, input.topic);
  const query = params.toString();
  return query ? `${TAROT_START_PATH}?${query}` : TAROT_START_PATH;
}
