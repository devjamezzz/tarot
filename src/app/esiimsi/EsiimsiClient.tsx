"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EsiimsiCylinder, type EsiimsiPhase } from "@/components/esiimsi/EsiimsiCylinder";
import { EsiimsiResultCard, type EsiimsiAiState } from "@/components/esiimsi/EsiimsiResultCard";
import { ESIIMSI_COUNT, getEsiimsiStick } from "@/lib/esiimsi/baseline";
import {
  buildEsiimsiQuestion,
  DEFAULT_ESIIMSI_TOPIC,
  ESIIMSI_TOPICS,
  type EsiimsiTopicId,
} from "@/lib/esiimsi/format";

const SHAKE_MS = 2600;
const SHAKE_REDUCED_MS = 900;
/** ถ้า Gemini ช้ากว่านี้ ให้แสดงเฉพาะตำรา (ไม่มีข้อความ error ให้ผู้ใช้เห็น) */
const AI_TIMEOUT_MS = 15000;
const BACK_HREF = "/explore";
const TOPIC_LABEL_ID = "esiimsi-topic-label";

type AiApiResponse = {
  ok?: boolean;
  fallback?: boolean;
  ai?: { summary?: unknown; cardStructure?: unknown };
};

function drawStickNumber(): number {
  return Math.floor(Math.random() * ESIIMSI_COUNT) + 1;
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
}

export default function EsiimsiClient() {
  const reduced = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<EsiimsiPhase>("idle");
  const [number, setNumber] = useState<number | null>(null);
  const [topic, setTopic] = useState<EsiimsiTopicId>(DEFAULT_ESIIMSI_TOPIC);
  const [ai, setAi] = useState<EsiimsiAiState>({ status: "fallback" });
  const abortRef = useRef<AbortController | null>(null);
  const shakeTimerRef = useRef<number | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // ยกเลิกคำขอ/ตัวจับเวลาที่ค้างอยู่เมื่อออกจากหน้า
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (shakeTimerRef.current !== null) window.clearTimeout(shakeTimerRef.current);
    };
  }, []);

  // AI เป็นส่วนเสริม: ตำราแสดงอยู่แล้ว ถ้า AI ล่ม/ช้า/ไม่มีคีย์ ก็แค่ไม่แสดงส่วนนี้
  const fetchReading = useCallback((stickNumber: number, askedTopic: EsiimsiTopicId) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAi({ status: "loading" });

    const settle = (next: EsiimsiAiState) => {
      if (abortRef.current === controller) setAi(next);
    };
    const timeout = window.setTimeout(() => {
      settle({ status: "fallback" });
      controller.abort();
    }, AI_TIMEOUT_MS);

    fetch("/api/ai/tarot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardsToken: `esiimsi_${stickNumber}.upright`,
        count: 1,
        topic: askedTopic,
        question: buildEsiimsiQuestion(stickNumber, askedTopic),
      }),
      signal: controller.signal,
    })
      .then(async (res) => (res.ok ? ((await res.json()) as AiApiResponse) : null))
      .then((data) => {
        const summary = typeof data?.ai?.summary === "string" ? data.ai.summary.trim() : "";
        if (!data?.ok || data.fallback || !summary) {
          settle({ status: "fallback" });
          return;
        }
        const cardStructure = typeof data.ai?.cardStructure === "string" ? data.ai.cardStructure : "";
        settle({ status: "ready", reading: { summary, cardStructure } });
      })
      .catch(() => settle({ status: "fallback" }))
      .finally(() => window.clearTimeout(timeout));
  }, []);

  const startShake = useCallback(() => {
    if (phase === "shaking") return;
    abortRef.current?.abort();
    setPhase("shaking");
    setNumber(null);
    setAi({ status: "fallback" });
    vibrate([80, 40, 80, 40, 150]);

    shakeTimerRef.current = window.setTimeout(() => {
      const drawn = drawStickNumber();
      setNumber(drawn);
      setPhase("revealed");
      vibrate(200);
      fetchReading(drawn, topic);
    }, reduced ? SHAKE_REDUCED_MS : SHAKE_MS);
  }, [phase, reduced, topic, fetchReading]);

  const reshake = useCallback(() => {
    abortRef.current?.abort();
    setPhase("idle");
    setNumber(null);
    setAi({ status: "fallback" });
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  // เลื่อนมาที่ผลหลังติ้วโผล่ขึ้นมาแล้ว
  useEffect(() => {
    if (phase !== "revealed") return;
    const timer = window.setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }),
      reduced ? 250 : 900
    );
    return () => window.clearTimeout(timer);
  }, [phase, reduced]);

  const stick = number !== null ? getEsiimsiStick(number) : null;
  const shaking = phase === "shaking";

  return (
    <PageContainer variant="narrow">
      <AppBar
        label="เซียมซี"
        title={
          <>
            ตั้งจิตอธิษฐาน <span className="whitespace-nowrap">แล้วเขย่า</span>
          </>
        }
        caption="เลือกเรื่องที่อยากถาม ตั้งจิตให้นิ่ง แล้วเขย่าให้ติ้วหลุดออกมา 1 ใบ จากทั้งหมด 28 ใบ"
        backHref={BACK_HREF}
      />

      <section className="mt-2 flex flex-col items-center">
        <EsiimsiCylinder phase={phase} number={number} reduced={reduced} />

        <p role="status" aria-live="polite" className="sr-only">
          {shaking ? "กำลังเขย่ากระบอก" : stick ? `ได้ใบที่ ${stick.number} ${stick.titleTh}` : ""}
        </p>

        {stick ? (
          <motion.p
            key={stick.number}
            data-testid="esiimsi-stick-number"
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0.2 : 0.4, delay: reduced ? 0 : 0.35 }}
            className="mt-2 text-center font-display text-[56px] font-semibold leading-none text-gold tabular-nums"
          >
            {stick.number}
          </motion.p>
        ) : null}

        {phase !== "revealed" ? (
          <>
            {/* เรื่องที่ตั้งจิตถาม — แนบไปกับคำถาม AI และข้อความที่ส่งให้หมอดู */}
            <div className="mt-4 w-full">
              <p id={TOPIC_LABEL_ID} className="eyebrow text-center">
                เรื่องที่อยากถาม
              </p>
              <div
                role="group"
                aria-labelledby={TOPIC_LABEL_ID}
                className="mt-2 flex flex-wrap justify-center gap-2"
              >
                {ESIIMSI_TOPICS.map((item) => (
                  <Chip
                    key={item.id}
                    selected={topic === item.id}
                    disabled={shaking}
                    onClick={() => setTopic(item.id)}
                    className="disabled:opacity-60"
                    data-testid={`esiimsi-topic-${item.id}`}
                  >
                    {item.labelTh}
                  </Chip>
                ))}
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              className="mt-5 w-full max-w-xs"
              onClick={startShake}
              disabled={shaking}
              aria-busy={shaking}
              data-testid="esiimsi-shake"
            >
              <Sparkles strokeWidth={1.5} />
              {shaking ? "กำลังเขย่า…" : "เริ่มเขย่า"}
            </Button>
            <p className="mt-3 text-center text-[13px] text-fg-subtle">
              ตามธรรมเนียม เสี่ยงทายเรื่องเดียวกันเพียงวันละครั้ง
            </p>
          </>
        ) : null}
      </section>

      {stick ? (
        <motion.div
          ref={resultRef}
          key={stick.number}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.4, delay: reduced ? 0 : 0.6 }}
          className="mt-6 scroll-mt-4"
        >
          <EsiimsiResultCard stick={stick} topic={topic} ai={ai} onReshake={reshake} />
        </motion.div>
      ) : null}
    </PageContainer>
  );
}
