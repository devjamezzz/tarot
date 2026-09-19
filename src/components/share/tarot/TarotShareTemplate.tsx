"use client";

import * as React from "react";
import { LINE_OA_URL, SITE_NAME, SITE_URL } from "@/lib/site";
import type { TarotShareCard, TarotShareData } from "../types";
import { ShareCardFace, type ShareCardMetrics } from "./ShareCardFace";
import {
  FONT_DISPLAY,
  FONT_SANS,
  FONT_WORDMARK,
  GOLD,
  GOLD_LINE,
  GOLD_SOFT,
  INK,
  LINE_GREEN,
  MUTED,
  SHARE_BG,
  SUNK,
} from "./shareStyles";

/*
 * Share-image template. Rendered off-screen (position:fixed; left:-9999px —
 * never display:none, html-to-image needs layout) and rasterised by
 * `useTarotShareImage`. Colours and fonts come from ./shareStyles (hex on
 * purpose: the PNG must not depend on the page theme).
 */
export type TarotShareFormat = "portrait" | "landscape";

export const SHARE_SIZES: Record<TarotShareFormat, { width: number; height: number }> = {
  portrait: { width: 1080, height: 1350 },
  landscape: { width: 1200, height: 630 },
};

const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");
const LINE_HANDLE = LINE_OA_URL.slice(LINE_OA_URL.lastIndexOf("/") + 1);

function cardMetrics(count: number, format: TarotShareFormat): ShareCardMetrics {
  const portrait = format === "portrait";
  const areaWidth = portrait ? 968 : 520;
  const cols = count <= 5 ? Math.max(count, 1) : 5;
  const gap = count <= 3 ? 24 : 16;
  const maxWidth = portrait
    ? count <= 3
      ? 292
      : count <= 5
        ? 184
        : 176
    : count <= 3
      ? 160
      : 96;
  const width = Math.min(maxWidth, Math.floor((areaWidth - gap * (cols - 1)) / cols));
  return { cols, gap, width, height: Math.round(width * 1.7) };
}

function LineGlyph({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.64 2 11.1c0 3.98 3.53 7.32 8.3 7.98.32.07.76.21.87.49.1.25.07.65.03.9l-.14.84c-.04.25-.2.98.86.53 1.06-.44 5.7-3.36 7.78-5.75C21.15 14.5 22 12.9 22 11.1 22 6.64 17.52 3 12 3z" />
    </svg>
  );
}

function GoldFrame({ inset }: { inset: number }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset,
          border: `2px solid ${GOLD}`,
          borderRadius: 16,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: inset + 10,
          border: `1px solid ${GOLD_LINE}`,
          borderRadius: 10,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function ShareCardCell({
  card,
  metrics,
  compact,
}: {
  card: TarotShareCard;
  metrics: ShareCardMetrics;
  compact: boolean;
}) {
  const reversed = card.orientation === "reversed";
  const nameTh = card.nameTh ?? card.name;

  return (
    <div
      style={{
        width: metrics.width,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {card.position ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ width: 28, height: 2, background: GOLD }} />
          <span
            style={{
              fontSize: compact ? 15 : 19,
              fontWeight: 700,
              letterSpacing: "0.04em",
              color: GOLD,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {card.position}
          </span>
        </div>
      ) : null}

      <ShareCardFace card={card} metrics={metrics} />

      <div style={{ textAlign: "center", width: metrics.width }}>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: compact ? 20 : 26,
            fontWeight: 600,
            lineHeight: 1.25,
            color: INK,
          }}
        >
          {nameTh}
        </div>
        {card.nameTh ? (
          <div style={{ fontSize: compact ? 13 : 15, color: MUTED, marginTop: 2 }}>{card.name}</div>
        ) : null}
        {reversed ? (
          <div
            style={{
              display: "inline-block",
              marginTop: 6,
              padding: "3px 12px",
              borderRadius: 999,
              border: `1px solid ${GOLD}`,
              background: GOLD_SOFT,
              color: GOLD,
              fontSize: compact ? 13 : 15,
              fontWeight: 700,
            }}
          >
            กลับหัว
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Header({ date, compact }: { date: string; compact: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
      <span
        style={{
          fontFamily: FONT_WORDMARK,
          fontSize: compact ? 22 : 28,
          letterSpacing: "0.18em",
          color: GOLD,
        }}
      >
        {SITE_NAME}
      </span>
      <span style={{ fontSize: compact ? 16 : 20, color: MUTED }}>{date}</span>
    </div>
  );
}

function Title({ data, compact }: { data: TarotShareData; compact: boolean }) {
  const caption = [`${data.cards.length} ใบ`, data.topicTh].filter(Boolean).join(" · ");
  return (
    <div>
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: compact ? 34 : 46,
          fontWeight: 600,
          lineHeight: 1.2,
          color: INK,
        }}
      >
        {data.spreadType}
      </div>
      <div style={{ fontSize: compact ? 17 : 22, color: MUTED, marginTop: 6 }}>{caption}</div>
    </div>
  );
}

function Question({ question, compact }: { question: string; compact: boolean }) {
  return (
    <div
      style={{
        background: SUNK,
        border: `1px solid ${GOLD_LINE}`,
        borderRadius: 12,
        padding: compact ? "18px 22px" : "26px 30px",
        maxHeight: compact ? 190 : 260,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: compact ? 14 : 18,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: GOLD,
        }}
      >
        คำถาม
      </div>
      <div
        style={{
          fontSize: compact ? 21 : 28,
          lineHeight: 1.5,
          color: INK,
          marginTop: 6,
          overflowWrap: "anywhere",
        }}
      >
        {question}
      </div>
    </div>
  );
}

function Footer({ compact }: { compact: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        borderTop: `1px solid ${GOLD_LINE}`,
        paddingTop: compact ? 16 : 24,
      }}
    >
      <div>
        <div style={{ fontSize: compact ? 18 : 22, fontWeight: 700, color: INK }}>
          {SITE_NAME} · ดูดวงกับเรฟ
        </div>
        <div style={{ fontSize: compact ? 15 : 18, color: MUTED, marginTop: 2 }}>{SITE_HOST}</div>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: LINE_GREEN,
          color: "#FFFFFF",
          borderRadius: 999,
          padding: compact ? "8px 16px" : "12px 22px",
          fontSize: compact ? 16 : 20,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        <LineGlyph size={compact ? 20 : 24} />
        LINE {LINE_HANDLE}
      </div>
    </div>
  );
}

function CardGrid({ data, metrics, compact }: { data: TarotShareData; metrics: ShareCardMetrics; compact: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: `${metrics.gap + 24}px ${metrics.gap}px`,
        maxWidth: metrics.cols * metrics.width + (metrics.cols - 1) * metrics.gap,
        margin: "0 auto",
      }}
    >
      {data.cards.map((card, index) => (
        <ShareCardCell key={`${card.name}-${index}`} card={card} metrics={metrics} compact={compact} />
      ))}
    </div>
  );
}

export interface TarotShareTemplateProps {
  data: TarotShareData;
  format?: TarotShareFormat;
}

/**
 * 1080×1350 (portrait) or 1200×630 (landscape) share image. Mount it once,
 * keep it off-screen, and hand the forwarded ref to `useTarotShareImage`.
 */
export const TarotShareTemplate = React.forwardRef<HTMLDivElement, TarotShareTemplateProps>(
  function TarotShareTemplate({ data, format = "portrait" }, ref) {
    const size = SHARE_SIZES[format];
    const portrait = format === "portrait";
    const metrics = cardMetrics(data.cards.length, format);
    const compact = !portrait || data.cards.length > 3;

    const cards = <CardGrid data={data} metrics={metrics} compact={compact} />;
    const question = data.question ? <Question question={data.question} compact={!portrait} /> : null;

    return (
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -9999,
          top: 0,
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          ref={ref}
          data-testid="tarot-share-template"
          data-format={format}
          style={{
            width: size.width,
            height: size.height,
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
            background: SHARE_BG,
            color: INK,
            fontFamily: FONT_SANS,
            padding: portrait ? "68px 56px" : "48px 44px",
            display: "flex",
            flexDirection: portrait ? "column" : "row",
            gap: portrait ? 30 : 36,
          }}
        >
          <GoldFrame inset={portrait ? 26 : 20} />

          {portrait ? (
            <>
              <Header date={data.date} compact={false} />
              <Title data={data} compact={false} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cards}
              </div>
              {question}
              <Footer compact={false} />
            </>
          ) : (
            <>
              <div
                style={{
                  width: 520,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cards}
              </div>
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
                <Header date={data.date} compact />
                <Title data={data} compact />
                {question}
                <div style={{ marginTop: "auto" }}>
                  <Footer compact />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);
