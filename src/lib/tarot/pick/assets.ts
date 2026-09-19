/**
 * Card art for the pick / reveal / result surfaces.
 *
 * Back — exports of public/card/backcard.png (1024×1536, 2.1MB), native 2:3.
 *
 * Faces — public/card/face/<scan>.webp (480×742): the 78 Rider–Waite scans in
 * public/card/{00–21, c/p/s/w 1–14}.png re-drawn as gold-line engravings on
 * the plum ground, so every face reads as one deck with the back. Recipe:
 * crop the transparent margin + English caption band (330×510 at x14,y14);
 * thin ink strokes (luminance < .46, low chroma, top-hat r=3 at 2×) → --gold;
 * fills sunk into #2E1C44 (27% of the desaturated scan); gold sheen on bright
 * colourless areas; 36% edge vignette; lanczos to 480px, webp q82.
 */

/**
 * 240×360 grid-tile back: wordmark dropped, strokes thickened (3×3 dilation)
 * and contrast lifted ×1.35 so the emblem still reads at ≈ 84px, 3× DPR.
 */
export const CARD_BACK_GRID_SRC = "/card/backcard-grid.png";

/** 600×900 — reveal row, result row and decorative backdrop. */
export const CARD_BACK_LARGE_SRC = "/card/backcard-600.png";

/** Every card box on the pick page shares this ratio (brief §2.3). */
export const CARD_ASPECT_CLASS = "aspect-[2/3.4]";

const SCAN_IMAGE = /^\/card\/(0\d|1\d|2[01]|[cpsw](?:[1-9]|1[0-4]))\.png$/;

export type CardFaceArt = {
  src: string;
  /** Pre-treated engraving — no CSS recolouring needed. */
  engraved: boolean;
};

/**
 * Art to paint inside the REF FORTUNE frame. A card on one of the 78 shipped
 * scans gets its engraved face; anything else keeps its own image and the CSS
 * fallback treatment in components/tarot/pick/TarotCardFace.
 */
export function cardFaceArt(image: string | undefined): CardFaceArt | null {
  if (!image) return null;
  const match = SCAN_IMAGE.exec(image);
  return match
    ? { src: `/card/face/${match[1]}.webp`, engraved: true }
    : { src: image, engraved: false };
}
