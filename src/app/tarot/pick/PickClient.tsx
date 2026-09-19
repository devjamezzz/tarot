"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { PickActionBar, type PickStage } from "@/components/tarot/pick/PickActionBar";
import { PickBackdrop } from "@/components/tarot/pick/PickBackdrop";
import { PickGrid } from "@/components/tarot/pick/PickGrid";
import { SHUFFLE_GATHER_MS } from "@/components/tarot/pick/PickTile";
import { REVEAL_IMAGE_SIZES } from "@/components/tarot/pick/RevealCard";
import { RevealRow } from "@/components/tarot/pick/RevealRow";
import { TarotFacePreload } from "@/components/tarot/pick/TarotCardFace";
import { trackEvent } from "@/lib/analytics/tracking";
import { getCardById } from "@/lib/tarot/deck";
import { TOPICS, buildResultHref, parsePickQuery } from "@/lib/tarot/spreads";
import { drawPickGrid } from "@/lib/tarot/pick/seededShuffle";
import { AUTO_ADVANCE_MS, flipDelaysMs } from "@/lib/tarot/pick/revealTiming";
import {
  getPickSeed,
  getPickSeedServerSnapshot,
  reseedPick,
  subscribePickSeed,
} from "@/lib/tarot/pick/seedStore";
import type { TarotCard } from "@/lib/tarot/types";

/** Cards are always read upright on this page (result page parses `<id>.<orientation>`). */
const ORIENTATION = "upright";
const BACK_HREF = "/tarot";

function markIndex(list: boolean[], index: number): boolean[] {
  return list[index] ? list : list.map((value, i) => (i === index ? true : value));
}

/**
 * Two beats, one tap each: pick → "เปิดไพ่". The reveal stage then runs by
 * itself — cards turn over one after another (a tap opens one early) and
 * the page moves to the result once the last flip settles. With
 * prefers-reduced-motion there is no flip to watch, so "เปิดไพ่" goes
 * straight to the result.
 */
export default function PickClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reduced = useReducedMotion() ?? false;

  const { spread, topic, question } = useMemo(() => parsePickQuery(searchParams), [searchParams]);
  const count = spread.count;
  const topicLabel = TOPICS.find((t) => t.id === topic)?.labelTh ?? "";

  // Per-visit seed (sessionStorage) → same 30 cards after pick → result → back.
  const seed = useSyncExternalStore(subscribePickSeed, getPickSeed, getPickSeedServerSnapshot);
  const cards = useMemo(() => (seed === null ? null : drawPickGrid(seed)), [seed]);

  const [pickedIds, setPickedIds] = useState<string[]>([]);
  const [stage, setStage] = useState<PickStage>("pick");
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [settled, setSettled] = useState<boolean[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const submittedRef = useRef(false);

  const selectedIds = pickedIds.slice(0, count);
  const canReveal = selectedIds.length === count;
  const revealCards = selectedIds
    .map(getCardById)
    .filter((card): card is TarotCard => card !== null);
  const revealCount = revealCards.length;
  const flippedCount = flipped.filter(Boolean).length;
  const allFlipped = revealCount > 0 && flippedCount === revealCount;
  const allSettled =
    revealCount > 0 && settled.length === revealCount && settled.every(Boolean);

  const cardsToken = selectedIds.map((id) => `${id}.${ORIENTATION}`).join(",");
  const resultHref = useMemo(
    () => buildResultHref({ spreadId: spread.id, topic, question, cardsToken, count }),
    [spread.id, topic, question, cardsToken, count]
  );

  useEffect(() => {
    trackEvent("reading_start", { vertical: "tarot", step: "pick_view", count });
  }, [count]);

  // Warm the result route as soon as the hand is complete so the hand-off is instant.
  useEffect(() => {
    if (canReveal) router.prefetch(resultHref);
  }, [canReveal, resultHref, router]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const toggleCard = useCallback(
    (cardId: string) => {
      setPickedIds((prev) => {
        if (prev.includes(cardId)) return prev.filter((id) => id !== cardId);
        if (prev.length >= count) return prev;
        return [...prev, cardId];
      });
    },
    [count]
  );

  // "สับใหม่": sweep the hand off the table first, then deal a fresh seed.
  function shuffle() {
    if (!shuffling) setShuffling(true);
  }

  useEffect(() => {
    if (!shuffling) return;
    const timer = window.setTimeout(() => {
      reseedPick();
      setPickedIds([]);
      setShuffling(false);
    }, SHUFFLE_GATHER_MS);
    return () => window.clearTimeout(timer);
  }, [shuffling]);

  const submit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    trackEvent("reading_submitted", {
      vertical: "tarot",
      step: "pick_submit",
      count,
      hasQuestion: question.length > 0,
    });
    router.push(resultHref);
  }, [count, question, resultHref, router]);

  function reveal() {
    if (!canReveal) return;
    if (reduced) {
      submit();
      return;
    }
    setFlipped(Array.from({ length: count }, () => false));
    setSettled(Array.from({ length: count }, () => false));
    setStage("reveal");
    scrollToTop();
  }

  function backToPick() {
    if (submitting) return;
    setStage("pick");
    setPickedIds([]);
    setFlipped([]);
    setSettled([]);
    scrollToTop();
  }

  const flipCard = useCallback((index: number) => {
    setFlipped((prev) => markIndex(prev, index));
  }, []);

  const settleCard = useCallback((index: number) => {
    setSettled((prev) => markIndex(prev, index));
  }, []);

  // The ritual: cards turn over on their own, in order. Tapping one early is fine.
  useEffect(() => {
    if (stage !== "reveal") return;
    const timers = flipDelaysMs(revealCount).map((delay, index) =>
      window.setTimeout(() => flipCard(index), delay)
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stage, revealCount, flipCard]);

  // Last flip settled → short hold → result page. No extra tap.
  useEffect(() => {
    if (stage !== "reveal" || !allSettled || submitting) return;
    const timer = window.setTimeout(submit, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [stage, allSettled, submitting, submit]);

  function skipToResult() {
    setFlipped((prev) => prev.map(() => true));
    submit();
  }

  if (stage === "reveal") {
    return (
      <main>
        <PageContainer variant="narrow">
          <AppBar
            backHref={BACK_HREF}
            label="เปิดไพ่"
            title="ไพ่ที่คุณเลือก"
            caption={
              allFlipped
                ? "เปิดครบทุกใบแล้ว · กำลังพาคุณไปดูผล"
                : "ไพ่กำลังเปิดทีละใบ · แตะเพื่อเปิดก่อนได้"
            }
          />
          <p className="sr-only" aria-live="polite">
            เปิดแล้ว {flippedCount} / {revealCount}
          </p>

          <section className="mt-4" aria-busy={submitting || undefined}>
            <p className="eyebrow text-center">{spread.titleTh}</p>
            <RevealRow
              className="mt-5"
              cards={revealCards}
              positions={spread.positionsTh}
              flipped={flipped}
              reduced={reduced}
              onFlip={flipCard}
              onFlipComplete={settleCard}
            />
          </section>

          <PickActionBar
            stage="reveal"
            canReveal={canReveal}
            submitting={submitting}
            onShuffle={shuffle}
            onReveal={reveal}
            onBackToPick={backToPick}
            onDone={skipToResult}
          />
        </PageContainer>
      </main>
    );
  }

  return (
    <main>
      <PageContainer variant="narrow">
        <AppBar
          backHref={BACK_HREF}
          label="ตั้งจิตอธิษฐาน"
          title={
            <span aria-live="polite" data-testid="pick-counter" className="tabular-nums">
              เลือกแล้ว {selectedIds.length} / {count}
            </span>
          }
          caption={shuffling ? "กำลังสับไพ่ใหม่…" : "แตะเพื่อเลือก · แตะซ้ำเพื่อยกเลิก"}
        />

        <section className="relative z-0">
          <PickBackdrop reduced={reduced} />

          <Card variant="sunk" className="mt-2 p-3 md:p-4">
            <p className="eyebrow">
              {spread.titleTh} · {count} ใบ · {topicLabel}
            </p>
            {question ? (
              <p className="mt-1 font-display text-base leading-snug text-fg">“{question}”</p>
            ) : null}
          </Card>

          <PickGrid
            className="mt-5"
            cards={cards}
            seed={seed}
            selectedIds={selectedIds}
            max={count}
            shuffling={shuffling}
            reduced={reduced}
            onToggle={toggleCard}
          />
        </section>

        {/* Faces for the chosen cards start loading before "เปิดไพ่" is pressed. */}
        {canReveal ? <TarotFacePreload cards={revealCards} sizes={REVEAL_IMAGE_SIZES} /> : null}

        <PickActionBar
          stage="pick"
          canReveal={canReveal}
          submitting={submitting}
          onShuffle={shuffle}
          onReveal={reveal}
          onBackToPick={backToPick}
          onDone={skipToResult}
        />
      </PageContainer>
    </main>
  );
}
