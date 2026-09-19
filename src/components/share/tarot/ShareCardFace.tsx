import { FONT_DISPLAY, GOLD, SHARE_BG } from "./shareStyles";
import type { TarotShareCard } from "../types";
import { cardFaceArt } from "@/lib/tarot/pick/assets";
import {
  CARD_ART_FILTER,
  CARD_ART_HEIGHT_PCT,
  CARD_ART_ORIGIN_Y_PCT,
  CARD_ART_OVERLAY,
  CARD_ART_OVERLAY_ENGRAVED,
  CARD_FACE_SHADOW,
  CARD_MEDALLION_SHADOW,
  CardCorners,
  CardPlateRule,
  PLATE_SIDE_PAD,
  plateFontCqw,
} from "@/components/tarot/result/cardArt";

/** Card box in the share image: columns, gutter and one card's pixel size. */
export type ShareCardMetrics = { cols: number; gap: number; width: number; height: number };

/*
 * Card face — the identical brand treatment to components/tarot/result/
 * ResultCardFace, in inline styles so the PNG never depends on Tailwind or
 * the page theme. The filter, overlay and ornaments come from cardArt, so a
 * change there reaches the page and the share image together.
 */
function FaceMedallion({ numeral, size }: { numeral: string | undefined; size: number }) {
  return (
    <span
      style={{
        position: "absolute",
        left: "50%",
        top: "4.5%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        border: `1px solid ${GOLD}`,
        background: "rgba(27,18,38,0.9)",
        boxShadow: CARD_MEDALLION_SHADOW,
        color: GOLD,
        fontFamily: FONT_DISPLAY,
        fontSize: Math.round(size * 0.48),
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      {numeral ?? (
        <svg viewBox="0 0 16 16" width={size * 0.42} height={size * 0.42} fill="currentColor" aria-hidden="true">
          <path d="M8 0c.6 4.4 3.6 7.4 8 8-4.4.6-7.4 3.6-8 8-.6-4.4-3.6-7.4-8-8 4.4-.6 7.4-3.6 8-8Z" />
        </svg>
      )}
    </span>
  );
}

export function ShareCardFace({ card, metrics }: { card: TarotShareCard; metrics: ShareCardMetrics }) {
  const reversed = card.orientation === "reversed";
  const nameTh = card.nameTh ?? card.name;
  // Same face set as the reveal row and result page: the engraved webp needs
  // no cropping, filter or veil; only a non-shipped image gets the CSS treatment.
  const art = cardFaceArt(card.image);
  const engraved = art?.engraved === true;
  const plateFont = Math.round(Math.min(Math.max((metrics.width * plateFontCqw(nameTh)) / 100, 12), 30));

  return (
    <div
      style={{
        width: metrics.width,
        height: metrics.height,
        borderRadius: 10,
        border: `2px solid ${GOLD}`,
        boxShadow: CARD_FACE_SHADOW,
        overflow: "hidden",
        background: SHARE_BG,
        position: "relative",
      }}
    >
      {art ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: engraved ? "100%" : `${CARD_ART_HEIGHT_PCT}%`,
            transform: reversed ? "rotate(180deg)" : undefined,
            transformOrigin: engraved ? "50% 50%" : `50% ${CARD_ART_ORIGIN_Y_PCT}%`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={art.src}
            alt={`ไพ่${nameTh}`}
            width={metrics.width}
            height={metrics.height}
            loading="eager"
            decoding="sync"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: engraved ? "center" : "top",
              display: "block",
              filter: engraved ? undefined : CARD_ART_FILTER,
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: engraved ? CARD_ART_OVERLAY_ENGRAVED : CARD_ART_OVERLAY,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 5,
          borderRadius: 7,
          border: "1px solid rgba(226,196,138,0.45)",
          boxShadow: "inset 0 0 0 1px rgba(226,196,138,0.08)",
          pointerEvents: "none",
        }}
      />
      <CardCorners />

      <FaceMedallion numeral={card.numeralTh} size={Math.round(metrics.width * 0.22)} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: `0 ${PLATE_SIDE_PAD} 6%`,
        }}
      >
        <CardPlateRule />
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: plateFont,
            fontWeight: 600,
            lineHeight: 1.15,
            color: GOLD,
            textAlign: "center",
            overflowWrap: "anywhere",
            textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          {nameTh}
        </span>
      </div>
    </div>
  );
}
