import type { Ref } from "react";
import type { LuckyDigitAnalysis } from "@/lib/lucky-numbers/engine";
import { SITE_URL } from "@/lib/site";
import { luckyDigitImage } from "./constants";

/** Ground colour passed to html-to-image (must match the template). */
export const SHARE_CARD_BG = "#1B1226";

const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

// Literal colours on purpose: html-to-image rasterises the live DOM, so the
// share template pins the palette instead of relying on CSS variables.
const GOLD = "#E2C48A";
const GOLD_STRONG = "#D4AF5A";
const INK = "#F4ECFA";
const MUTED = "#B7A6C9";
const SURFACE = "#251A33";
const LINE = "rgba(226,196,138,0.28)";

/** Off-screen card with deterministic styling for html-to-image rendering. */
export function ShareCard({ ref, analysis }: { ref: Ref<HTMLDivElement>; analysis: LuckyDigitAnalysis }) {
  return (
    <div className="pointer-events-none fixed -left-[2000px] top-0 z-[-1]" aria-hidden="true">
      <div
        ref={ref}
        style={{
          width: 540,
          padding: 36,
          borderRadius: 16,
          background: `radial-gradient(420px 320px at 50% -10%, rgba(110,76,122,0.35), transparent 70%), ${SHARE_CARD_BG}`,
          border: `1px solid ${LINE}`,
          boxShadow: `inset 0 0 0 1px rgba(226,196,138,0.08)`,
          color: INK,
          fontFamily: "var(--font-sans), 'LINE Seed Sans TH', ui-sans-serif, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          {/* Brand mark from public/logo.png — a raw <img> on the same origin survives html-to-image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="REFFORTUNE"
            style={{ height: 56, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 18px rgba(226,196,138,0.35))" }}
          />
          <span style={{ fontSize: 12, color: GOLD, letterSpacing: "0.12em", fontWeight: 700 }}>เลขมงคล</span>
        </div>

        <p style={{ textAlign: "center", fontSize: 14, letterSpacing: "0.12em", color: MUTED, marginBottom: 4 }}>
          เลขมงคลของฉัน
        </p>
        <p
          style={{
            textAlign: "center",
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "0.3em",
            color: GOLD,
            marginBottom: 28,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {analysis.combined}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 28 }}>
          {analysis.digits.map((d, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={luckyDigitImage(d)}
              alt=""
              style={{
                width: 96,
                height: 148,
                objectFit: "cover",
                borderRadius: 10,
                border: `1px solid ${GOLD}`,
                boxShadow: "0 0 24px rgba(226,196,138,0.35)",
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "16px 20px",
            background: SURFACE,
            border: `1px solid ${LINE}`,
            borderRadius: 12,
            marginBottom: 24,
          }}
        >
          {[
            ["ผลรวม", analysis.sum],
            ["เลขราก", analysis.root],
            ["จำนวนหลัก", analysis.count],
          ].map(([label, value]) => (
            <div key={String(label)} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.12em", color: MUTED }}>{label}</p>
              <p style={{ fontSize: 26, fontWeight: 700, color: INK, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{value}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: GOLD_STRONG, letterSpacing: "0.08em" }}>
          ขอพรขอเลขนำโชค ที่ {SITE_HOST}
        </p>
      </div>
    </div>
  );
}
