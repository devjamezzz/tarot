"use client";

import * as React from "react";
import { Heart, RefreshCw, Sparkles } from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BirthDateField, type BirthDateValue } from "@/components/ui/BirthDateField";
import { InlineError } from "@/components/ui/ErrorDisplay";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { Markdown } from "@/components/ui/Markdown";
import { ShareButton } from "@/components/ui/ShareButton";
import { ReadingResultShell } from "@/components/reading/ReadingResultShell";
import { CardFigure } from "@/components/library/CardFigure";
import { cardNameTh } from "@/components/library/labels";
import { Toast, TOAST_REMOVED, TOAST_SAVED, useToast } from "@/components/verticals/local/Toast";
import { StepsCard } from "@/components/verticals/local/StepsCard";
import { ExploreMore } from "@/components/verticals/local/ExploreMore";
import { trackEvent } from "@/lib/analytics/tracking";
import { useLibrary } from "@/lib/library/useLibrary";
import { buildSavedSpiritPathReading } from "@/lib/library/storage";
import { getCardById } from "@/lib/tarot/deck";
import { spiritPathFromDateParts } from "@/lib/tarot/spiritPath";
import { formatThaiDate } from "@/lib/format/thaiDate";

type AiState = { status: "loading" } | { status: "ai"; markdown: string } | { status: "fallback" };

function partsToDate(day: number, month: number, year: number): Date {
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
}

const HOW_IT_WORKS_STEPS: ReadonlyArray<string> = [
  "กรอกวัน เดือน ปีเกิดของคุณ",
  "ระบบจับคู่ไพ่ราศีจากวันและเดือนเกิด และไพ่จิตวิญญาณจากผลรวมวัน เดือน ปีเกิด",
  "อ่านความหมายทั้ง 2 ใบ พร้อมคำตีความภาพรวมชีวิตของคุณ",
];

export default function SpiritPathPage() {
  const lib = useLibrary();
  const toast = useToast();

  const [birth, setBirth] = React.useState<BirthDateValue | null>(null);
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState<BirthDateValue | null>(null);
  const [ai, setAi] = React.useState<AiState>({ status: "loading" });

  React.useEffect(() => {
    trackEvent("reading_start", { vertical: "spirit-card", step: "spirit_path_form_view" });
  }, []);

  const result = React.useMemo(() => (submitted ? spiritPathFromDateParts(submitted) : null), [submitted]);
  const zodiacCard = React.useMemo(() => (result ? getCardById(result.zodiacCardId) : null), [result]);
  const soulCard = React.useMemo(() => (result ? getCardById(result.soulCardId) : null), [result]);

  const savedId = React.useMemo(() => {
    if (!submitted) return null;
    const existing = lib.items.find(
      (item) =>
        "kind" in item &&
        item.kind === "spirit_path" &&
        item.day === submitted.day &&
        item.month === submitted.month &&
        item.year === submitted.year
    );
    return existing?.id ?? null;
  }, [lib.items, submitted]);

  React.useEffect(() => {
    if (!result || !submitted || !zodiacCard || !soulCard) return;

    const controller = new AbortController();

    fetch("/api/ai/spirit-path", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day: submitted.day,
        month: submitted.month,
        year: submitted.year,
        zodiacCardId: result.zodiacCardId,
        soulCardId: result.soulCardId,
        zodiacCardName: cardNameTh(zodiacCard),
        soulCardName: cardNameTh(soulCard),
      }),
      signal: controller.signal,
    })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        const markdown = typeof data?.markdown === "string" ? data.markdown.trim() : "";
        if (!markdown || data?.fallback) {
          setAi({ status: "fallback" });
          return;
        }
        setAi({ status: "ai", markdown });
      })
      .catch(() => {
        if (!controller.signal.aborted) setAi({ status: "fallback" });
      });

    return () => controller.abort();
  }, [result, soulCard, submitted, zodiacCard]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birth) {
      setError("กรุณากรอกวันเกิดให้ครบ");
      return;
    }
    if (!spiritPathFromDateParts(birth)) {
      setError("วันเกิดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
      return;
    }
    trackEvent("reading_submitted", { vertical: "spirit-card", step: "spirit_path_form_submit" });
    setError("");
    setAi({ status: "loading" });
    setSubmitted(birth);
  }

  function reset() {
    setSubmitted(null);
    setAi({ status: "loading" });
  }

  function toggleSaved() {
    if (!submitted || !result || !zodiacCard || !soulCard) return;

    if (savedId) {
      lib.remove(savedId);
      toast.show(TOAST_REMOVED);
      return;
    }

    const zName = cardNameTh(zodiacCard);
    const sName = cardNameTh(soulCard);
    const markdown = ai.status === "ai" ? ai.markdown : "";

    lib.upsert(
      buildSavedSpiritPathReading({
        id: newId(),
        day: submitted.day,
        month: submitted.month,
        year: submitted.year,
        zodiacCardId: result.zodiacCardId,
        soulCardId: result.soulCardId,
        title: `เส้นทางจิตวิญญาณ — ${zName} + ${sName}`,
        interpretationMarkdown: markdown,
        tags: [zName, sName],
        snapshot: {
          input: submitted,
          cards: { zodiacCardId: result.zodiacCardId, soulCardId: result.soulCardId },
          output: { interpretationMarkdown: markdown },
        },
      })
    );
    toast.show(TOAST_SAVED);
  }

  if (!submitted || !result || !zodiacCard || !soulCard) {
    return (
      <PageContainer variant="narrow">
        <AppBar
          label="ไพ่จิตวิญญาณ"
          title="เส้นทางจิตวิญญาณ"
          caption="อ่านไพ่ 2 ใบจากวันเกิด: ไพ่ราศี + ไพ่จิตวิญญาณ"
          backHref="/explore"
        />
        <Card className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <BirthDateField id="spirit-path-birth" value={birth} onChange={setBirth} required />
            {error ? <InlineError message={error} /> : null}
            <Button type="submit" size="lg" className="w-full">
              <Sparkles strokeWidth={1.5} />
              เปิดไพ่ 2 ใบ
            </Button>
          </form>
        </Card>
        <StepsCard label="วิธีดู" title="อ่านไพ่ 2 ใบใน 3 ขั้นตอน" steps={HOW_IT_WORKS_STEPS} />
        <ExploreMore />
        <Toast message={toast.message} />
      </PageContainer>
    );
  }

  const zName = cardNameTh(zodiacCard);
  const sName = cardNameTh(soulCard);
  const birthLabel = formatThaiDate(partsToDate(submitted.day, submitted.month, submitted.year));

  return (
    <>
      <ReadingResultShell
        label="ไพ่จิตวิญญาณ"
        title="เส้นทางจิตวิญญาณของคุณ"
        caption={`เกิด ${birthLabel} · 2 ใบ`}
        backHref="/explore"
        computed={
          <div className="space-y-4">
            <div className="mx-auto grid max-w-[420px] grid-cols-2 gap-4">
              <CardFigure card={zodiacCard} label="ไพ่ราศี" priority />
              <CardFigure card={soulCard} label="ไพ่จิตวิญญาณ" priority />
            </div>
            <Card>
              <p className="eyebrow">ความหมายตามตำรา</p>
              <div className="mt-2 space-y-3">
                <div>
                  <p className="font-display text-base font-semibold text-fg">ไพ่ราศี · {zName}</p>
                  <p className="mt-1 text-base leading-[1.65] text-fg">{zodiacCard.meaningUpright}</p>
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-fg">ไพ่จิตวิญญาณ · {sName}</p>
                  <p className="mt-1 text-base leading-[1.65] text-fg">{soulCard.meaningUpright}</p>
                </div>
              </div>
            </Card>
          </div>
        }
        aiLoading={ai.status === "loading"}
        ai={
          ai.status === "ai" ? (
            <Card>
              <p className="eyebrow">คำตีความ</p>
              <div className="mt-3">
                <Markdown>{ai.markdown}</Markdown>
              </div>
            </Card>
          ) : undefined
        }
        cta={
          <>
            <LineCtaButton text={`ไพ่ประจำตัวของฉัน: ไพ่ราศี ${zName} + ไพ่จิตวิญญาณ ${sName} อยากให้ช่วยอ่านเพิ่มเติม`} />
            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={toggleSaved} aria-pressed={Boolean(savedId)}>
                <Heart strokeWidth={1.5} className={savedId ? "text-gold" : undefined} fill={savedId ? "currentColor" : "none"} />
                {savedId ? "บันทึกแล้ว" : "บันทึกลงคลัง"}
              </Button>
              <ShareButton
                variant="ghost"
                shareData={{
                  title: `เส้นทางจิตวิญญาณ: ${zName} + ${sName}`,
                  text: "ดูไพ่ประจำตัวจากวันเกิด",
                  url: typeof window !== "undefined" ? window.location.href : "",
                }}
              />
            </div>
            <Button variant="ghost" onClick={reset} className="w-full">
              <RefreshCw strokeWidth={1.5} />
              ดูวันเกิดอื่น
            </Button>
          </>
        }
        trust={{
          computedFrom: "วันเกิดจับคู่กับไพ่ราศีและไพ่จิตวิญญาณตามตำรา",
          confidence: "ปานกลาง",
          aiUsed: ai.status === "ai",
        }}
      />
      <Toast message={toast.message} />
    </>
  );
}
