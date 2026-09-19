import { SITE_URL } from "@/lib/site";
import type { TarotShareData } from "../types";

/**
 * Plain-text summary of a tarot draw, used as the LINE pre-fill message and
 * as the `text` of navigator.share: spread title, positions + Thai card
 * names, the question, and the canonical site URL.
 */
export function buildTarotShareText(data: TarotShareData): string {
  const lines: string[] = [`ไพ่ทาโรต์ · ${data.spreadType} (${data.cards.length} ใบ)`];

  if (data.topicTh) lines.push(`หัวข้อ: ${data.topicTh}`);

  data.cards.forEach((card, index) => {
    const position = card.position ? `${card.position}: ` : "";
    const reversed = card.orientation === "reversed" ? " (กลับหัว)" : "";
    lines.push(`${index + 1}. ${position}${card.nameTh ?? card.name}${reversed}`);
  });

  if (data.question) lines.push(`คำถาม: ${data.question}`);

  lines.push(`ดูไพ่กับเรฟ ${SITE_URL}`);
  return lines.join("\n");
}
