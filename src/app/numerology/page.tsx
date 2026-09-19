"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Hash, RefreshCw, Share2 } from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { InlineError } from "@/components/ui/ErrorDisplay";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ReadingBlocks } from "@/components/reading/ReadingBlocks";
import { ReadingResultShell } from "@/components/reading/ReadingResultShell";
import { Toast, TOAST_COPIED, useToast } from "@/components/verticals/local/Toast";
import { StepsCard } from "@/components/verticals/local/StepsCard";
import { ExploreMore } from "@/components/verticals/local/ExploreMore";
import { analyzeThaiPhone, type NumerologyResult } from "@/lib/numerology/engine";
import { runReadingPipeline } from "@/lib/reading/pipeline";
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
      return JSON.stringify(value, null, 2);
    } catch {
      return "";
    }
  }
  return "";
}

function ScoreCard({ baseline, summary }: { baseline: NumerologyResult; summary: string }) {
  return (
    <Card>
      <p className="eyebrow">คะแนนพลังเบอร์</p>
      <div className="mt-2 flex flex-wrap items-end gap-3">
        <span className="font-sans text-[44px] font-bold leading-none tracking-[0.12em] tabular-nums text-gold">
          {baseline.score}
        </span>
        <span className="pb-1 text-fg-muted">/ 99</span>
        <span className="ml-auto rounded-pill border border-gold bg-gold-soft px-3 py-1 text-sm text-gold">
          {baseline.tier}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-card border border-line-faint bg-sunk p-3">
          <dt className="text-[13px] text-fg-muted">เลขรวม</dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-fg">{baseline.total}</dd>
        </div>
        <div className="rounded-card border border-line-faint bg-sunk p-3">
          <dt className="text-[13px] text-fg-muted">เลขราก</dt>
          <dd className="mt-1 text-lg font-bold tabular-nums text-fg">{baseline.root}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[13px] leading-relaxed text-fg-muted">{summary}</p>
    </Card>
  );
}

function AiCards({ summary, cardStructure }: { summary: string; cardStructure: string }) {
  return (
    <div className="space-y-3">
      <Card>
        <p className="eyebrow">บทวิเคราะห์</p>
        <p className="mt-2 whitespace-pre-line text-base leading-[1.65] text-fg">{summary}</p>
      </Card>
      {cardStructure ? (
        <Card variant="sunk">
          <p className="eyebrow">รายละเอียด</p>
          <p className="mt-2 whitespace-pre-line text-base leading-[1.65] text-fg">{cardStructure}</p>
        </Card>
      ) : null}
    </div>
  );
}

const HOW_IT_WORKS_STEPS: ReadonlyArray<string> = [
  "กรอกเบอร์โทรศัพท์ 10 หลักที่คุณใช้อยู่",
  "ระบบรวมเลขและถอดเลขรากตามหลักเลขศาสตร์ ผลเดิมทุกครั้งสำหรับเบอร์เดียวกัน",
  "รับคะแนนจากเต็ม 99 พร้อมแนวโน้มด้านงาน เงิน และความสัมพันธ์",
];

export default function NumerologyPage() {
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [ai, setAi] = useState<AiState>({ status: "loading" });

  const baseline = useMemo(() => (submittedPhone ? analyzeThaiPhone(submittedPhone) : null), [submittedPhone]);
  const session = useMemo(
    () => (baseline ? runReadingPipeline({ kind: "numerology", phone: baseline.normalizedPhone }) : null),
    [baseline]
  );
  const readAt = useMemo(() => (submittedPhone ? formatThaiDate(new Date()) : ""), [submittedPhone]);

  useEffect(() => {
    if (!submittedPhone) return;

    const controller = new AbortController();
    const fallbackTimer = setTimeout(() => {
      setAi((prev) => (prev.status === "loading" ? { status: "fallback" } : prev));
    }, FALLBACK_MS);

    fetch("/api/ai/numerology", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: submittedPhone }),
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
  }, [submittedPhone]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const raw = phone.trim();
    if (!raw) {
      setError("กรุณาใส่เบอร์โทรศัพท์");
      return;
    }
    if (!analyzeThaiPhone(raw)) {
      setError("กรุณาใส่เบอร์โทรศัพท์ให้ถูกต้อง");
      setSubmittedPhone(null);
      return;
    }
    setError("");
    setAi({ status: "loading" });
    setSubmittedPhone(raw);
  }

  function reset() {
    setSubmittedPhone(null);
    setPhone("");
    setAi({ status: "loading" });
  }

  async function share() {
    const url = window.location.href;
    const text = session?.summary ?? "";
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "ผลวิเคราะห์เบอร์โทรศัพท์", text, url });
        return;
      } catch {
        // cancelled — fall back to copying the link
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.show(TOAST_COPIED);
    } catch {
      toast.show("ไม่สามารถคัดลอกลิงก์ได้");
    }
  }

  if (!baseline || !session) {
    return (
      <PageContainer variant="narrow">
        <AppBar
          label="เลขศาสตร์"
          title="วิเคราะห์เบอร์โทรศัพท์"
          caption="กรอกเบอร์ แล้วดูคะแนนและแนวโน้มงาน เงิน ความสัมพันธ์"
          backHref="/explore"
        />
        <Card className="mt-4">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="numerology-phone">เบอร์โทรศัพท์</Label>
              <Input
                id="numerology-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="เช่น 0812345678"
                aria-invalid={error ? true : undefined}
              />
              <p className="text-[13px] text-fg-muted">ใส่ได้ทั้งแบบมีขีดหรือเว้นวรรค ระบบจัดรูปแบบให้เอง</p>
              {error ? <InlineError message={error} /> : null}
            </div>
            <Button type="submit" size="lg" className="w-full">
              <Hash strokeWidth={1.5} />
              วิเคราะห์เบอร์
            </Button>
          </form>
        </Card>
        <StepsCard label="วิธีดู" title="วิเคราะห์เบอร์ใน 3 ขั้นตอน" steps={HOW_IT_WORKS_STEPS} />
        <ExploreMore />
        <Toast message={toast.message} />
      </PageContainer>
    );
  }

  const fallbackBlocks = session.blocks.filter((b) => b.id !== "num-summary");

  return (
    <>
      <ReadingResultShell
        label="เลขศาสตร์"
        title="พลังเบอร์ของคุณ"
        caption={`${baseline.normalizedPhone} · ${readAt}`}
        backHref="/explore"
        computed={<ScoreCard baseline={baseline} summary={session.summary} />}
        aiLoading={ai.status === "loading"}
        ai={
          ai.status === "ai" ? (
            <AiCards summary={ai.summary} cardStructure={ai.cardStructure} />
          ) : (
            <div>
              <SectionHeader label="ความหมายตามตำรา" title="แนวโน้มจากเลขราก" />
              <ReadingBlocks className="mt-3" blocks={fallbackBlocks} />
            </div>
          )
        }
        cta={
          <>
            <LineCtaButton
              label="ปรึกษาหมอดูทาง LINE"
              text={`อยากปรึกษาเรื่องเบอร์ ${baseline.normalizedPhone} (คะแนน ${baseline.score}/99)`}
            />
            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={share}>
                <Share2 strokeWidth={1.5} />
                แชร์ผลลัพธ์
              </Button>
              <Button variant="ghost" onClick={reset}>
                <RefreshCw strokeWidth={1.5} />
                วิเคราะห์เบอร์อื่น
              </Button>
            </div>
          </>
        }
        trust={{
          computedFrom: "ผลรวมและเลขรากของเบอร์ตามหลักเลขศาสตร์",
          confidence: "ปานกลาง",
          aiUsed: ai.status === "ai",
        }}
      />
      <Toast message={toast.message} />
    </>
  );
}
