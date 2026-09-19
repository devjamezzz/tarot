"use client";

import { TarotCardFace, type TarotCardFaceProps } from "@/components/tarot/pick/TarotCardFace";

/**
 * Card front on the result page. Renders the exact same REF FORTUNE face as
 * the reveal row (engraved gold-on-plum art, hairline frame with corner
 * stars, Thai numeral medallion, Trirong title plate) so a card never changes
 * art style between the two screens. The share PNG mirrors this treatment in
 * share/tarot/ShareCardFace.
 */
export type ResultCardFaceProps = TarotCardFaceProps;

export function ResultCardFace(props: ResultCardFaceProps) {
  return <TarotCardFace {...props} />;
}
