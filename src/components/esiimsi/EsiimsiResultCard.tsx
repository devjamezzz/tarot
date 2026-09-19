"use client";

import { Briefcase, Compass, Heart, RotateCcw } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AiTypingDots } from "@/components/ui/AiTypingDots";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { TrustPanel } from "@/components/reading/TrustPanel";
import { cn } from "@/lib/cn";
import type { EsiimsiLuck, EsiimsiStick } from "@/lib/esiimsi/baseline";
import {
  buildEsiimsiLineText,
  getEsiimsiTopicLabel,
  parseEsiimsiSections,
  type EsiimsiAi,
  type EsiimsiTopicId,
} from "@/lib/esiimsi/format";

export type EsiimsiAiState =
  | { status: "loading" }
  | { status: "ready"; reading: EsiimsiAi }
  | { status: "fallback" };

export type EsiimsiResultCardProps = {
  stick: EsiimsiStick;
  /** เรื่องที่ผู้ใช้เลือกก่อนเขย่า — แสดงบนหัวการ์ดและแนบไปกับข้อความ LINE */
  topic: EsiimsiTopicId;
  ai: EsiimsiAiState;
  onReshake: () => void;
};

const LUCK_CLASS: Record<EsiimsiLuck, string> = {
  ดี: "border-gold bg-gold-soft text-gold",
  กลาง: "border-line text-fg-muted",
  ควรระวัง: "border-warning/60 text-warning",
};

const ROWS = [
  { key: "work", label: "การงาน", Icon: Briefcase },
  { key: "love", label: "ความรัก", Icon: Heart },
  { key: "advice", label: "คำแนะนำ", Icon: Compass },
] as const;

function AiSection({ ai }: { ai: EsiimsiAiState }) {
  if (ai.status === "loading") {
    return (
      <section data-testid="esiimsi-ai" className="mt-6">
        <AiTypingDots label="AI กำลังขยายความจากตำรา…" />
      </section>
    );
  }
  if (ai.status !== "ready") return null;

  const sections = parseEsiimsiSections(ai.reading.cardStructure);
  return (
    <Card data-testid="esiimsi-ai" className="mt-6 space-y-4">
      <p className="eyebrow">AI ขยายความ</p>
      <p className="whitespace-pre-line text-[15px] leading-relaxed text-fg">{ai.reading.summary}</p>
      {sections.map((section, i) => (
        <div key={`${section.title}-${i}`} className="space-y-1.5">
          {section.title ? <p className="text-sm font-bold text-gold">{section.title}</p> : null}
          <ul className="space-y-1 text-sm leading-relaxed text-fg-muted">
            {section.lines.map((line, j) => (
              <li key={j} className="flex gap-2">
                <span aria-hidden="true" className="mt-[9px] h-1 w-1 shrink-0 rounded-pill bg-gold" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Card>
  );
}

export function EsiimsiResultCard({ stick, topic, ai, onReshake }: EsiimsiResultCardProps) {
  return (
    <div data-testid="esiimsi-result">
      <Card className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow mb-1">เซียมซี · เรื่อง{getEsiimsiTopicLabel(topic)}</p>
            <CardTitle className="text-2xl">
              ใบที่ {stick.number} · {stick.titleTh}
            </CardTitle>
          </div>
          <span
            className={cn(
              "inline-flex h-8 shrink-0 items-center rounded-pill border px-3 text-xs font-bold",
              LUCK_CLASS[stick.luck]
            )}
          >
            โชค: {stick.luck}
          </span>
        </div>

        <blockquote
          data-testid="esiimsi-poem"
          className="rounded-card border border-line-faint bg-sunk px-4 py-4 text-center font-display text-[17px] leading-relaxed text-fg"
        >
          {stick.poem.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </blockquote>

        <section data-testid="esiimsi-baseline" className="space-y-4">
          <p className="eyebrow">ความหมายตามตำรา</p>
          <p className="text-[15px] leading-relaxed text-fg">{stick.meaning}</p>
          <ul className="space-y-3">
            {ROWS.map(({ key, label, Icon }) => (
              <li key={key} className="flex gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-fg">{label}</p>
                  <p className="text-sm leading-relaxed text-fg-muted">{stick[key]}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Card>

      <AiSection ai={ai} />

      <div className="mt-6 flex flex-col gap-3">
        <LineCtaButton label="ส่งผลเซียมซีให้หมอดูทาง LINE" text={buildEsiimsiLineText(stick, topic)} />
      </div>

      <TrustPanel
        className="mt-6"
        computedFrom="ตำราเซียมซี 28 ใบ"
        confidence="ปานกลาง"
        aiUsed={ai.status === "ready"}
      />

      <Button
        variant="ghost"
        size="lg"
        className="mt-4 w-full"
        onClick={onReshake}
        data-testid="esiimsi-reshake"
      >
        <RotateCcw strokeWidth={1.5} />
        เขย่าใหม่
      </Button>
    </div>
  );
}
