import type { CSSProperties } from "react";

/*
 * REF FORTUNE card-front treatment — the single source for the result page
 * (ResultCardFace) and the share PNG (share/tarot/ShareCardFace), so the two
 * always match. Everything here is plain CSS values and inline-styled SVG:
 * no Tailwind, no blend modes, no theme variables, because html-to-image has
 * to rasterise it exactly as the page paints it.
 *
 * The Rider–Waite scans are bright, yellow-skied stock art. The treatment
 * pulls them into the brand: the art is dimmed and desaturated, then a violet
 * veil cancels the yellow into the plum palette, a vignette melts the edges
 * into the frame, and gold ornaments (corner brackets, medallion ring, plate
 * rule) carry the identity. Only Thai type is painted on top.
 */

const BG = "#1B1226";
const GOLD = "#E2C48A";

/** Art box is taller than the frame so the scan's English caption band falls below it. */
export const CARD_ART_HEIGHT_PCT = 115;
/** Rotate reversed art around the frame's centre, not the taller art box. */
export const CARD_ART_ORIGIN_Y_PCT = 50 / (CARD_ART_HEIGHT_PCT / 100);

export const CARD_ART_FILTER = "sepia(0.25) saturate(0.7) brightness(0.62) contrast(1.2)";

/** Layers top → bottom: gold light behind the medallion, violet veil, opaque foot, edge vignette. */
export const CARD_ART_OVERLAY = [
  "radial-gradient(70% 30% at 50% 0%, rgba(226,196,138,0.2), rgba(226,196,138,0) 100%)",
  "linear-gradient(rgba(64,44,100,0.46), rgba(40,26,64,0.52))",
  `linear-gradient(to top, ${BG} 0%, rgba(27,18,38,0.94) 15%, rgba(27,18,38,0.6) 27%, rgba(27,18,38,0) 42%)`,
  `radial-gradient(82% 66% at 50% 40%, rgba(27,18,38,0) 48%, rgba(27,18,38,0.7) 74%, ${BG} 96%)`,
].join(", ");

/**
 * Overlay for the pre-treated engraved faces (lib/tarot/pick/assets.ts): no
 * veil or filter — only the opaque foot under the title plate and a soft
 * edge vignette, identical to components/tarot/pick/TarotCardFace.
 */
export const CARD_ART_OVERLAY_ENGRAVED = [
  `linear-gradient(to top, ${BG} 0%, rgba(27,18,38,0.94) 15%, rgba(27,18,38,0.6) 27%, rgba(27,18,38,0) 42%)`,
  "radial-gradient(115% 85% at 50% 36%, rgba(27,18,38,0) 50%, rgba(27,18,38,0.45) 100%)",
].join(", ");

/** Soft gold halo + the brief's card shadow (§1.3). */
export const CARD_FACE_SHADOW = "0 0 24px rgba(226,196,138,0.22), 0 8px 28px rgba(0,0,0,0.45)";
/** Double gold ring around the numeral medallion. */
export const CARD_MEDALLION_SHADOW =
  "0 0 0 2px rgba(27,18,38,0.9), 0 0 0 3px rgba(226,196,138,0.45), 0 8px 28px rgba(0,0,0,0.45)";

/** Corner bracket width as a share of the frame; PLATE_SIDE_PAD clears it. */
const CORNER_WIDTH = "14%";
const CORNER_INSET = 8;
const CORNER_POSITIONS: CSSProperties[] = [
  { left: CORNER_INSET, top: CORNER_INSET },
  { right: CORNER_INSET, top: CORNER_INSET, transform: "scaleX(-1)" },
  { left: CORNER_INSET, bottom: CORNER_INSET, transform: "scaleY(-1)" },
  { right: CORNER_INSET, bottom: CORNER_INSET, transform: "scale(-1)" },
];

/** Four gold corner brackets, sized to the frame (CORNER_WIDTH of its width). */
export function CardCorners() {
  return (
    <>
      {CORNER_POSITIONS.map((position, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          style={{
            position: "absolute",
            width: CORNER_WIDTH,
            height: "auto",
            aspectRatio: "1 / 1",
            display: "block",
            pointerEvents: "none",
            ...position,
          }}
        >
          <path d="M2 22V7q0-5 5-5h15" stroke={GOLD} strokeWidth={1.4} />
          <path d="M6.5 22V10.5q0-4 4-4H22" stroke="rgba(226,196,138,0.5)" strokeWidth={1} />
          <circle cx={5.2} cy={5.2} r={1.4} fill={GOLD} />
        </svg>
      ))}
    </>
  );
}

/** Title plate: side padding that clears the bottom brackets. */
export const PLATE_SIDE_PAD = "22%";
/** Plate text width in cqw (100 − 2 × PLATE_SIDE_PAD). */
const PLATE_TEXT_WIDTH_CQW = 56;
/** Trirong 600: average Thai cell advance ≈ 0.64 em (measured on the deck's names). */
const PLATE_CELL_EM = 0.64;
const PLATE_FONT_MAX_CQW = 11.5;
const THAI_COMBINING = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g;

/** Visible cells of a Thai name: code points minus combining vowels and tone marks. */
function plateCells(name: string): number {
  return Math.max(1, name.replace(THAI_COMBINING, "").length);
}

/**
 * Plate font size in cqw (1% of the frame width) so the name sits on one
 * line between the brackets: 11.5cqw for short names, stepping down for long
 * ones (ควีนแห่งไม้เท้า → ~8cqw). Both faces size the plate from this.
 */
export function plateFontCqw(name: string): number {
  return Math.min(PLATE_FONT_MAX_CQW, PLATE_TEXT_WIDTH_CQW / (plateCells(name) * PLATE_CELL_EM));
}

const RULE: CSSProperties = { flex: 1, height: 1, background: "rgba(226,196,138,0.7)" };

/** Rule — ◆ — above the Thai title plate. */
export function CardPlateRule() {
  return (
    <span
      aria-hidden="true"
      style={{ display: "flex", alignItems: "center", gap: "4%", width: "60%", marginBottom: "3%" }}
    >
      <span style={RULE} />
      <span
        style={{
          flex: "none",
          width: "6%",
          height: "auto",
          aspectRatio: "1 / 1",
          background: GOLD,
          transform: "rotate(45deg)",
        }}
      />
      <span style={RULE} />
    </span>
  );
}
