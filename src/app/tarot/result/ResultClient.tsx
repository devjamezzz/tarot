"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { BookmarkCheck, BookmarkPlus } from "lucide-react";
import { getSpreadLabels, parseCardTokens } from "@/lib/tarot/engine";
import { PICK_QUERY, TOPICS, parsePickQuery } from "@/lib/tarot/spreads";
import { FLIP_DURATION_MS } from "@/lib/tarot/pick/revealTiming";
import { cardNumeralTh } from "@/lib/tarot/pick/cardFace";
import { formatThaiDate } from "@/lib/format/thaiDate";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import { buildSavedTarotReading, loadLibrary, removeReading, upsertReading } from "@/lib/library/storage";
import { useHistoryStore } from "@/store/useHistoryStore";
import { useConfigStore } from "@/store/useConfigStore";
import { cn } from "@/lib/cn";
import { PageContainer } from "@/components/ui/PageContainer";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HeartSave } from "@/components/ui/HeartSave";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { TrustPanel } from "@/components/reading/TrustPanel";
import { SHARE_ACTION_CLASS, TarotShareableCard } from "@/components/share/tarot/TarotShareableCard";
import { buildTarotShareText } from "@/components/share/tarot/shareText";
import type { TarotShareData } from "@/components/share/types";
import { RESULT_REVEAL_QUERY, TarotCardRow } from "@/components/tarot/result/TarotCardRow";
import { EngineMeaning } from "@/components/tarot/result/EngineMeaning";
import { DeepReadLadder, buildDeepReadSteps } from "@/components/tarot/result/DeepReadLadder";

const TOAST_MS = 1600;
const TOAST_SAVED = "บันทึกเรียบร้อย";
const TOAST_REMOVED = "เอาออกจากคลังแล้ว";

/** sessionStorage: the draw already revealed in this visit, so back/reload shows it face-up. */
const REVEALED_STORAGE_KEY = "reffortune.tarot.revealed";

type SavedRef = { id: string; createdAt: string };

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
}

/** Library entry for this exact draw, so "บันทึกแล้ว" survives a reload. */
function findSavedTarot(cardsToken: string): SavedRef | null {
  if (!cardsToken || typeof window === "undefined") return null;
  const existing = loadLibrary().items.find(
    (item) => "kind" in item && item.kind === "tarot" && item.cardsToken === cardsToken
  );
  return existing ? { id: existing.id, createdAt: existing.createdAt } : null;
}

function wasRevealed(cardsToken: string): boolean {
  if (!cardsToken || typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(REVEALED_STORAGE_KEY) === cardsToken;
  } catch {
    return false;
  }
}

function rememberRevealed(cardsToken: string): void {
  try {
    window.sessionStorage.setItem(REVEALED_STORAGE_KEY, cardsToken);
  } catch {
    // Private mode / blocked storage: the ritual simply replays on reload.
  }
}

/** Storage never notifies; the snapshot is frozen per mount (see below). */
const subscribeNever = () => () => {};
const serverNotRevealed = () => false;

export default function ResultClient() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const reduced = useReducedMotion() ?? false;
  const count = Number(searchParams.get(PICK_QUERY.count) ?? "0");
  const cardsToken = searchParams.get(PICK_QUERY.cards) ?? "";
  const revealMode = searchParams.get(RESULT_REVEAL_QUERY) === "1";
  const { spread, topic, question } = useMemo(() => parsePickQuery(searchParams), [searchParams]);
  const topicTh = TOPICS.find((t) => t.id === topic)?.labelTh ?? TOPICS[0].labelTh;
  const dateLabel = useMemo(() => formatThaiDate(new Date()), []);

  const result = useMemo(
    () => runReadingPipeline({ kind: "tarot", count, cardsToken, question }),
    [cardsToken, count, question]
  );
  const drawnCards = useMemo(() => parseCardTokens(cardsToken), [cardsToken]);
  const positions = useMemo(
    () => getSpreadLabels(count, spread.count === count ? spread : null),
    [count, spread]
  );

  // Deterministic text only — no AI call happens on this page.
  const engineReading = useMemo(() => {
    if (!result) return null;
    const cardStructure = drawnCards
      .map((drawn, i) => {
        const orient = drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";
        const meaning = drawn.orientation === "upright" ? drawn.card.meaningUpright : drawn.card.meaningReversed;
        return `${i + 1}) ${drawn.card.nameTh ?? drawn.card.name} (${orient}) — ${meaning}`;
      })
      .join("\n");
    return { summary: result.summary, cardStructure };
  }, [drawnCards, result]);

  const showAiReading = useConfigStore((s) => s.toggles.showAiReading);
  const { addHistory } = useHistoryStore();

  // In-place reveal (brief §2.3-3 / §2.4): face-down until tapped, one flip at a time.
  // The "already revealed" memo is read once per mount through an external-store
  // snapshot so the server (no storage) and the client hydrate the same markup.
  const revealedMemo = useRef<boolean | null>(null);
  const alreadyRevealed = useSyncExternalStore(
    subscribeNever,
    () => (revealedMemo.current ??= wasRevealed(cardsToken)),
    serverNotRevealed
  );
  const revealActive = revealMode && !alreadyRevealed;
  const [flipped, setFlipped] = useState<boolean[]>(() => drawnCards.map(() => !revealMode));
  const [locked, setLocked] = useState(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flippedCount = flipped.filter(Boolean).length;
  const revealDone = !revealActive || (flippedCount === drawnCards.length && !locked);
  const revealPending = !revealDone;

  const lockFor = useCallback((ms: number) => {
    setLocked(true);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => setLocked(false), ms);
  }, []);

  const flipCard = useCallback(
    (index: number) => {
      if (locked || flipped[index]) return;
      setFlipped((prev) => prev.map((value, i) => (i === index ? true : value)));
      if (!reduced) lockFor(FLIP_DURATION_MS + 60);
    },
    [flipped, lockFor, locked, reduced]
  );

  const flipAll = useCallback(() => {
    if (locked) return;
    setFlipped((prev) => prev.map(() => true));
    if (!reduced) lockFor(FLIP_DURATION_MS + 60);
  }, [lockFor, locked, reduced]);

  useEffect(() => {
    if (revealActive && revealDone && cardsToken) rememberRevealed(cardsToken);
  }, [cardsToken, revealActive, revealDone]);

  // Library lookup happens after mount: storage is client-only and must not shape SSR markup.
  const [saved, setSaved] = useState<SavedRef | null>(null);
  useEffect(() => {
    setSaved(findSavedTarot(cardsToken));
  }, [cardsToken]);
  const savedId = saved?.id ?? null;
  const savedCreatedAt = saved?.createdAt ?? null;
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyRecorded = useRef(false);

  const paywall = useMemo(
    () =>
      result
        ? evaluatePaywall({
            vertical: "tarot",
            stage: "result",
            sessionId: result.sessionId,
            hasQuestion: question.trim().length > 0,
          })
        : null,
    [question, result]
  );

  useEffect(() => {
    if (!result) return;
    recordFreeReading();
    trackEvent("reading_result_viewed", {
      vertical: "tarot",
      sessionId: result.sessionId,
      count,
      hasQuestion: question.trim().length > 0,
    });
    if (paywall?.show) {
      trackEvent("paywall_shown", {
        vertical: "tarot",
        sessionId: result.sessionId,
        reason: paywall.reason,
        ctaVariant: paywall.variant,
      });
    }
  }, [count, paywall, question, result]);

  // Auto-save to local history once per draw.
  useEffect(() => {
    if (!engineReading?.summary || historyRecorded.current) return;
    historyRecorded.current = true;
    addHistory({
      type: topic === "love" ? "love-tarot" : "tarot",
      summary: engineReading.summary,
      details: {
        question: question || undefined,
        cards: drawnCards.map((c) => c.card.nameTh || c.card.name).join(", "),
      },
    });
  }, [addHistory, drawnCards, engineReading, question, topic]);

  // Keep the saved library entry in sync with the current draw.
  useEffect(() => {
    if (!savedId || !result || !engineReading) return;
    upsertReading(
      buildSavedTarotReading({
        id: savedId,
        createdAt: savedCreatedAt ?? undefined,
        count,
        cardsToken,
        question,
        aiSummary: engineReading.summary,
        aiCardStructure: engineReading.cardStructure,
        snapshot: {
          input: { count, cardsToken, question },
          session: result,
          ai: { summary: engineReading.summary, cardStructure: engineReading.cardStructure },
        },
      })
    );
  }, [cardsToken, count, engineReading, question, result, savedCreatedAt, savedId]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (lockTimer.current) clearTimeout(lockTimer.current);
    },
    []
  );

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setSaveToast(message);
    toastTimer.current = setTimeout(() => setSaveToast(null), TOAST_MS);
  }, []);

  const toggleSaved = useCallback(() => {
    if (!result) return;
    if (savedId) {
      removeReading(savedId);
      setSaved(null);
      showToast(TOAST_REMOVED);
      return;
    }

    const id = makeId();
    const createdAt = new Date().toISOString();
    setSaved({ id, createdAt });
    upsertReading(
      buildSavedTarotReading({
        id,
        createdAt,
        count,
        cardsToken,
        question,
        aiSummary: engineReading?.summary,
        aiCardStructure: engineReading?.cardStructure,
        snapshot: {
          input: { count, cardsToken, question },
          session: result,
          ai: engineReading
            ? { summary: engineReading.summary, cardStructure: engineReading.cardStructure }
            : undefined,
        },
      })
    );
    showToast(TOAST_SAVED);
  }, [cardsToken, count, engineReading, question, result, savedId, showToast]);

  const shareData = useMemo<TarotShareData>(
    () => ({
      vertical: "tarot",
      brand: "REFFORTUNE",
      date: dateLabel,
      spreadType: spread.titleTh,
      topicTh,
      question: question || undefined,
      cards: drawnCards.map((d, i) => ({
        name: d.card.name,
        nameTh: d.card.nameTh,
        image: d.card.image,
        numeralTh: cardNumeralTh(d.card) ?? undefined,
        orientation: d.orientation,
        position: positions[i],
      })),
    }),
    [dateLabel, drawnCards, positions, question, spread.titleTh, topicTh]
  );
  const lineText = useMemo(() => buildTarotShareText(shareData), [shareData]);

  const handleShareGenerated = useCallback(() => {
    trackEvent("share_card_generated", { vertical: "tarot", card: drawnCards[0]?.card.name, count });
  }, [count, drawnCards]);

  const deepReadSteps = useMemo(() => {
    if (!result) return [];
    const params = new URLSearchParams(searchParams.toString());
    params.delete(RESULT_REVEAL_QUERY);
    const query = params.toString();
    return buildDeepReadSteps({
      returnTo: query ? `${pathname}?${query}` : pathname,
      previews: [result.blocks[1]?.body ?? result.summary, result.blocks[2]?.body ?? result.summary, result.summary],
    });
  }, [pathname, result, searchParams]);

  if (!result) {
    return (
      <PageContainer variant="narrow">
        <AppBar label="ไพ่ทาโรต์" title="ไพ่ของคุณ" backHref="/tarot" />
        <Card variant="sunk" role="alert" className="mt-4 border-danger/40">
          <p className="text-base text-fg">ไม่พบข้อมูลไพ่ที่สมบูรณ์ กรุณากลับไปเปิดไพ่ใหม่อีกครั้ง</p>
          <Button asChild variant="gold" size="lg" className="mt-4 w-full">
            <Link href="/tarot">กลับไปเลือกไพ่</Link>
          </Button>
        </Card>
      </PageContainer>
    );
  }

  const caption = revealPending
    ? `แตะไพ่ทีละใบเพื่อเปิด · เปิดแล้ว ${flippedCount} / ${drawnCards.length}`
    : `${count} ใบ · ${topicTh} · ${dateLabel}`;

  return (
    <PageContainer variant="narrow">
      <AppBar
        label={revealPending ? "เปิดไพ่" : "ไพ่ทาโรต์"}
        title="ไพ่ของคุณ"
        caption={caption}
        backHref="/tarot"
        right={<HeartSave saved={!!savedId} onToggle={toggleSaved} />}
      />
      {revealActive ? (
        <p className="sr-only" aria-live="polite">
          {revealDone ? "เปิดครบทุกใบแล้ว" : `เปิดแล้ว ${flippedCount} / ${drawnCards.length}`}
        </p>
      ) : null}

      <section data-testid="result-computed" className="mt-2 space-y-5">
        {question ? (
          <Card variant="sunk" data-testid="tarot-question" className="border-line">
            <p className="eyebrow">คำถามของคุณ</p>
            <p className="mt-1 text-base leading-[1.65] text-fg">{question}</p>
          </Card>
        ) : null}
        {revealPending ? <p className="eyebrow text-center">{spread.titleTh}</p> : null}
        <TarotCardRow
          cards={drawnCards}
          positions={positions}
          reveal={revealActive ? { flipped, locked, reduced, onFlip: flipCard } : undefined}
        />
        {revealPending && flippedCount < drawnCards.length ? (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={flipAll}
              disabled={locked}
              data-testid="reveal-all"
            >
              เปิดทั้งหมด
            </Button>
          </div>
        ) : null}
      </section>

      {revealPending ? null : (
        <div className={cn(revealActive && "animate-fade-up")}>
          <section data-testid="result-cta" className="mt-6 flex flex-col gap-3">
            <LineCtaButton label="ส่งไพ่ให้หมอดูทาง LINE" text={lineText} />
            <TarotShareableCard
              data={shareData}
              onShare={handleShareGenerated}
              extraActions={
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className={`${SHARE_ACTION_CLASS} col-span-2 sm:col-span-1`}
                  onClick={toggleSaved}
                  aria-pressed={!!savedId}
                  data-testid="save-library"
                >
                  {savedId ? (
                    <BookmarkCheck className="text-gold" strokeWidth={1.5} aria-hidden="true" />
                  ) : (
                    <BookmarkPlus className="text-gold" strokeWidth={1.5} aria-hidden="true" />
                  )}
                  {savedId ? "บันทึกแล้ว" : "บันทึกลงคลัง"}
                </Button>
              }
            />
            <p
              role="status"
              aria-live="polite"
              data-testid="save-toast"
              className="min-h-5 text-center text-[13px] text-gold"
            >
              {saveToast ?? ""}
            </p>
          </section>

          {showAiReading ? (
            <section data-testid="result-ai" className="mt-8 space-y-8">
              <EngineMeaning blocks={result.blocks} />
              <DeepReadLadder steps={deepReadSteps} />
            </section>
          ) : null}

          <TrustPanel
            className="mt-8"
            computedFrom={`ตำแหน่งไพ่ในสเปรด ${spread.titleTh} และความหมายตามตำรา`}
            confidence="ปานกลาง"
            aiUsed={false}
          />

          <div className="mt-6">
            <Button asChild variant="ghost" size="lg" className="w-full">
              <Link href="/tarot" data-testid="new-reading">
                ดูไพ่ใหม่
              </Link>
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
