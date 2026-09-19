"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Heart, RefreshCw, Sparkles } from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BirthDateField, type BirthDateValue } from "@/components/ui/BirthDateField";
import { InlineError } from "@/components/ui/ErrorDisplay";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { ReadingResultShell } from "@/components/reading/ReadingResultShell";
import { CardFigure } from "@/components/library/CardFigure";
import { cardNameTh } from "@/components/library/labels";
import { Toast, TOAST_REMOVED, TOAST_SAVED, useToast } from "@/components/verticals/local/Toast";
import { StepsCard } from "@/components/verticals/local/StepsCard";
import { ExploreMore } from "@/components/verticals/local/ExploreMore";
import { useLibrary } from "@/lib/library/useLibrary";
import { buildSavedSpiritCardReading } from "@/lib/library/storage";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import { spiritCardFromDob } from "@/lib/tarot/spirit";
import { formatThaiDate } from "@/lib/format/thaiDate";

const FALLBACK_MS = 7000;

type AiState =
  | { status: "loading" }
  | { status: "ai"; summary: string; cardStructure: string }
  | { status: "fallback" };

function normalizeText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((v) => normalizeText(v)).join("\n");
  if (value && typeof value === "object") {
    try {
      const obj = value as Record<string, unknown>;
      const numericKeys = Object.keys(obj).every((k) => /^\d+$/.test(k));
      if (numericKeys) {
        return Object.keys(obj)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => normalizeText(obj[k]))
          .join("\n");
      }
      return JSON.stringify(obj, null, 2);
    } catch {
      return "";
    }
  }
  return "";
}

function toIsoDob(value: BirthDateValue): string {
  const mm = String(value.month).padStart(2, "0");
  const dd = String(value.day).padStart(2, "0");
  return `${value.year}-${mm}-${dd}`;
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
}

const HOW_IT_WORKS_STEPS: ReadonlyArray<string> = [
  "กรอกวัน เดือน ปีเกิดของคุณ",
  "ระบบคำนวณเลขเส้นทางชีวิต แล้วจับคู่กับไพ่ประจำตัวของคุณ",
  "อ่านความหมายตามตำรา พร้อมสารจากจักรวาลและแนวทางปฏิบัติ",
];

export default function SpiritCardPage() {
  const lib = useLibrary();
  const toast = useToast();

  const [birth, setBirth] = useState<BirthDateValue | null>(null);
  const [error, setError] = useState("");
  const [submittedDob, setSubmittedDob] = useState<string | null>(null);
  const [ai, setAi] = useState<AiState>({ status: "loading" });

  useEffect(() => {
    trackEvent("reading_start", { vertical: "spirit-card", step: "form_view" });
  }, []);

  const session = useMemo(
    () => (submittedDob ? runReadingPipeline({ kind: "spirit-card", dob: submittedDob }) : null),
    [submittedDob]
  );
  const spirit = useMemo(() => (submittedDob ? spiritCardFromDob(submittedDob) : null), [submittedDob]);
  const paywall = useMemo(
    () => (session ? evaluatePaywall({ vertical: "spirit-card", stage: "result", sessionId: session.sessionId }) : null),
    [session]
  );
  const savedId = useMemo(() => {
    if (!submittedDob) return null;
    const existing = lib.items.find(
      (item) => "kind" in item && item.kind === "spirit_card" && item.dob === submittedDob
    );
    return existing?.id ?? null;
  }, [lib.items, submittedDob]);

  useEffect(() => {
    if (!session || !submittedDob) return;

    recordFreeReading();
    trackEvent("reading_result_viewed", { vertical: "spirit-card", sessionId: session.sessionId });
    if (paywall?.show) {
      trackEvent("paywall_shown", { vertical: "spirit-card", reason: paywall.reason, ctaVariant: paywall.variant });
    }

    const controller = new AbortController();
    const fallbackTimer = setTimeout(() => {
      setAi((prev) => (prev.status === "loading" ? { status: "fallback" } : prev));
    }, FALLBACK_MS);

    fetch("/api/ai/spirit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dob: submittedDob }),
      signal: controller.signal,
    })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        const payload = data?.ai;
        const summary = normalizeText(payload?.summary);
        const cardStructure = normalizeText(payload?.cardStructure);
        if (!payload || data?.fallback || !summary) {
          setAi({ status: "fallback" });
          return;
        }
        setAi({ status: "ai", summary, cardStructure });
      })
      .catch(() => {
        if (!controller.signal.aborted) setAi({ status: "fallback" });
      })
      .finally(() => clearTimeout(fallbackTimer));

    return () => {
      controller.abort();
      clearTimeout(fallbackTimer);
    };
  }, [session, submittedDob, paywall]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!birth) {
      setError("กรุณากรอกวันเกิดให้ครบ");
      return;
    }
    const dob = toIsoDob(birth);
    if (!runReadingPipeline({ kind: "spirit-card", dob })) {
      setError("วันเกิดไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
      return;
    }
    trackEvent("reading_submitted", { vertical: "spirit-card", step: "form_submit" });
    setError("");
    setAi({ status: "loading" });
    setSubmittedDob(dob);
  }

  function reset() {
    setSubmittedDob(null);
    setAi({ status: "loading" });
  }

  function toggleSaved() {
    if (!submittedDob || !spirit || !session) return;

    if (savedId) {
      lib.remove(savedId);
      toast.show(TOAST_REMOVED);
      return;
    }

    const nameTh = cardNameTh(spirit.card);
    const aiText = ai.status === "ai" ? ai : null;
    lib.upsert(
      buildSavedSpiritCardReading({
        id: newId(),
        dob: submittedDob,
        cardId: spirit.card.id,
        orientation: spirit.orientation,
        lifePathNumber: spirit.lifePathNumber,
        title: `ไพ่จิตวิญญาณ — ${nameTh}`,
        aiSummary: aiText?.summary,
        aiCardStructure: aiText?.cardStructure,
        tags: [nameTh, ...(spirit.card.keywordsUpright ?? []), ...(spirit.card.keywordsReversed ?? [])],
        snapshot: {
          input: { dob: submittedDob },
          card: {
            cardId: spirit.card.id,
            orientation: spirit.orientation,
            lifePathNumber: spirit.lifePathNumber,
          },
          session,
          output: aiText ? { message: aiText.summary, practice: aiText.cardStructure } : undefined,
        },
      })
    );
    toast.show(TOAST_SAVED);
  }

  if (!submittedDob || !session || !spirit) {
    return (
      <PageContainer variant="narrow">
        <AppBar
          label="ไพ่จิตวิญญาณ"
          title="ไพ่จิตวิญญาณ"
          caption="รับข้อความจากจักรวาล ผ่านวันเกิดของคุณ"
          backHref="/explore"
        />
        <Card className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <BirthDateField id="spirit-card-birth" value={birth} onChange={setBirth} required />
            {error ? <InlineError message={error} /> : null}
            <Button type="submit" size="lg" className="w-full">
              <Sparkles strokeWidth={1.5} />
              เปิดไพ่จิตวิญญาณ
            </Button>
          </form>
        </Card>
        <StepsCard label="วิธีดู" title="เปิดไพ่จิตวิญญาณใน 3 ขั้นตอน" steps={HOW_IT_WORKS_STEPS} />
        <ExploreMore />
        <Toast message={toast.message} />
      </PageContainer>
    );
  }

  const card = spirit.card;
  const keywords = spirit.orientation === "upright" ? card.keywordsUpright : card.keywordsReversed;
  const meaning = spirit.orientation === "upright" ? card.meaningUpright : card.meaningReversed;
  const nameTh = cardNameTh(card);

  return (
    <>
      <ReadingResultShell
        label="ไพ่จิตวิญญาณ"
        title="ไพ่จิตวิญญาณของคุณ"
        caption={`เกิด ${formatThaiDate(submittedDob)} · เลขเส้นทางชีวิต ${spirit.lifePathNumber}`}
        backHref="/explore"
        computed={
          <div className="space-y-4">
            <div className="mx-auto w-[200px]">
              <CardFigure card={card} orientation={spirit.orientation} priority />
            </div>
            <Card>
              <p className="eyebrow">ความหมายตามตำรา</p>
              <p className="mt-2 text-base leading-[1.65] text-fg">{meaning}</p>
              {keywords.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {keywords.map((kw) => (
                    <span key={kw} className="rounded-pill border border-line px-2.5 py-0.5 text-[13px] text-fg-muted">
                      {kw}
                    </span>
                  ))}
                </div>
              ) : null}
            </Card>
          </div>
        }
        aiLoading={ai.status === "loading"}
        ai={
          ai.status === "ai" ? (
            <div className="space-y-3">
              <Card>
                <p className="eyebrow">สารจากจักรวาล</p>
                <p className="mt-2 whitespace-pre-line text-base leading-[1.65] text-fg">{ai.summary}</p>
              </Card>
              {ai.cardStructure ? (
                <Card variant="sunk">
                  <p className="eyebrow">แนวทางปฏิบัติ</p>
                  <p className="mt-2 whitespace-pre-line text-base leading-[1.65] text-fg">{ai.cardStructure}</p>
                </Card>
              ) : null}
            </div>
          ) : undefined
        }
        cta={
          <>
            <LineCtaButton
              text={`ไพ่จิตวิญญาณของฉันคือ ${nameTh} (เลขเส้นทางชีวิต ${spirit.lifePathNumber}) อยากให้ช่วยอ่านเพิ่มเติม`}
            />
            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={toggleSaved} aria-pressed={Boolean(savedId)}>
                <Heart strokeWidth={1.5} className={savedId ? "text-gold" : undefined} fill={savedId ? "currentColor" : "none"} />
                {savedId ? "บันทึกแล้ว" : "บันทึกลงคลัง"}
              </Button>
              <Button variant="ghost" onClick={reset}>
                <RefreshCw strokeWidth={1.5} />
                ดูวันเกิดอื่น
              </Button>
            </div>
          </>
        }
        trust={{
          computedFrom: "วันเกิดและเลขเส้นทางชีวิต จับคู่กับความหมายไพ่ตามตำรา",
          confidence: "ปานกลาง",
          aiUsed: ai.status === "ai",
        }}
      />
      <Toast message={toast.message} />
    </>
  );
}
