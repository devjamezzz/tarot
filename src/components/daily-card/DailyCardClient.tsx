"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Facebook, RefreshCw } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { AppBar } from "@/components/nav/AppBar";
import { useAuth } from "@/components/auth/AuthProvider";
import { TrustPanel } from "@/components/reading/TrustPanel";
import { Button } from "@/components/ui/Button";
import { HeartSave } from "@/components/ui/HeartSave";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { PageContainer } from "@/components/ui/PageContainer";
import { ShareButton } from "@/components/ui/ShareButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatThaiDate } from "@/lib/format/thaiDate";
import { buildSavedDailyCardReading } from "@/lib/library/storage";
import { useLibrary } from "@/lib/library/useLibrary";
import { ReadingType } from "@/lib/reading/types";
import { SITE_URL } from "@/lib/site";
import { cardMeaning } from "@/lib/tarot/engine";
import { useConfigStore } from "@/store/useConfigStore";
import { DailyMessage, type AiReading } from "./DailyMessage";
import { CROSSFADE_DURATION_MS, FLIP_DURATION_MS, FlipCard } from "./FlipCard";
import { MidnightCountdown } from "./MidnightCountdown";
import { WeekStrip } from "./WeekStrip";
import {
  clearTodayCard,
  getPendingDraw,
  getTodayKey,
  saveTodayCard,
  toDrawnCard,
  useDailyHistory,
  useHydrated,
  useStoredDailyCard,
} from "./dailyCardStorage";

const AI_FALLBACK_TIMEOUT_MS = 7000;
const TRUST_COMPUTED_FROM = "ไพ่ประจำวันสุ่มจากสำรับ 78 ใบ และความหมายตามตำรา";
const PAGE_URL = `${SITE_URL}/daily-card`;

type AiState =
  | { key: string; status: "ready"; reading: AiReading }
  | { key: string; status: "fallback" };

interface DailyApiResponse {
  ok?: boolean;
  fallback?: boolean;
  ai?: { summary?: unknown; cardStructure?: unknown };
}

/** The route prefixes its bullet groups with emoji; icons are lucide-only here. */
function stripEmojiMarkers(text: string): string {
  return text.replace(/[✨📋⚠]\uFE0F?\s*/g, "");
}

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
}

export function DailyCardClient() {
  const hydrated = useHydrated();
  const stored = useStoredDailyCard();
  const history = useDailyHistory();
  const { entries, upsert, remove } = useLibrary();
  const { user } = useAuth();
  const showAiReading = useConfigStore((state) => state.toggles.showAiReading);
  const reducedMotion = useReducedMotion() ?? false;

  const todayKey = hydrated ? getTodayKey() : null;
  const storedDrawn = useMemo(() => (stored ? toDrawnCard(stored) : null), [stored]);
  const drawn = storedDrawn ?? (hydrated ? getPendingDraw() : null);
  const opened = storedDrawn !== null;

  const [flipping, setFlipping] = useState(false);
  const [ai, setAi] = useState<AiState | null>(null);

  const dayKey = stored?.date ?? null;
  const aiKey = stored ? `${stored.date}:${stored.cardId}` : null;
  const aiResult = ai && ai.key === aiKey ? ai : null;
  const aiReading = aiResult?.status === "ready" ? aiResult.reading : null;
  const aiLoading = showAiReading && opened && aiResult === null;

  // AI overlay: the engine text is already on screen; this only adds to it.
  useEffect(() => {
    if (!aiKey || !dayKey || !storedDrawn || !showAiReading) return;

    const controller = new AbortController();
    const markFallback = () =>
      setAi((prev) => (prev?.key === aiKey ? prev : { key: aiKey, status: "fallback" }));
    const timer = window.setTimeout(markFallback, AI_FALLBACK_TIMEOUT_MS);

    fetch("/api/ai/daily-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: storedDrawn.card.id, orientation: storedDrawn.orientation, dayKey }),
      signal: controller.signal,
    })
      .then(async (res) => (res.ok ? ((await res.json()) as DailyApiResponse) : null))
      .then((data) => {
        const summary = typeof data?.ai?.summary === "string" ? data.ai.summary.trim() : "";
        if (!data?.ok || data.fallback || !summary) {
          markFallback();
          return;
        }
        const cardStructure =
          typeof data.ai?.cardStructure === "string" ? stripEmojiMarkers(data.ai.cardStructure) : "";
        setAi({ key: aiKey, status: "ready", reading: { summary, cardStructure } });
      })
      .catch(markFallback)
      .finally(() => window.clearTimeout(timer));

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [aiKey, dayKey, storedDrawn, showAiReading]);

  const savedId = useMemo(() => {
    if (!todayKey) return null;
    const entry = entries.find(
      (item) => item.type === ReadingType.DAILY_CARD && "dayKey" in item.data && item.data.dayKey === todayKey
    );
    return entry?.id ?? null;
  }, [entries, todayKey]);

  const handleFlip = useCallback(() => {
    if (!drawn || opened) return;
    setFlipping(true);
    saveTodayCard(drawn);
    window.setTimeout(() => setFlipping(false), reducedMotion ? CROSSFADE_DURATION_MS : FLIP_DURATION_MS);
  }, [drawn, opened, reducedMotion]);

  const nameTh = drawn ? (drawn.card.nameTh ?? drawn.card.name) : "";
  const message = drawn ? cardMeaning(drawn) : "";

  const toggleSaved = useCallback(() => {
    if (!drawn || !opened || !todayKey) return;
    if (savedId) {
      remove(savedId);
      return;
    }
    const summary = aiReading?.summary ?? message;
    upsert(
      buildSavedDailyCardReading({
        id: newId(),
        dayKey: todayKey,
        cardId: drawn.card.id,
        orientation: drawn.orientation,
        title: `ไพ่ประจำวัน — ${nameTh}`,
        summary,
        tags: [nameTh, "ไพ่ประจำวัน"],
        snapshot: {
          dayKey: todayKey,
          cardId: drawn.card.id,
          orientation: drawn.orientation,
          output: {
            message: summary,
            focus: [],
            advice: { action: aiReading?.cardStructure ?? "", avoid: "" },
          },
        },
      })
    );
  }, [drawn, opened, todayKey, savedId, remove, upsert, aiReading, message, nameTh]);

  const shareFacebook = useCallback(() => {
    const quote = encodeURIComponent(`ไพ่ประจำวัน: ${nameTh} — ${message}`);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(PAGE_URL)}&quote=${quote}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, [nameTh, message]);

  const handleAdminReset = useCallback(() => {
    clearTodayCard();
    setFlipping(false);
    setAi(null);
  }, []);

  if (!drawn || !todayKey) {
    return (
      <PageContainer variant="narrow">
        <AppBar label="ไพ่ประจำวัน" title="ไพ่ประจำวันของคุณ" backHref="/" />
        <div className="mt-4 flex flex-col items-center gap-6 px-1" aria-busy="true" aria-label="กำลังเตรียมไพ่">
          <Skeleton className="h-[310px] w-[200px] rounded-[10px]" />
          <Skeleton className="h-4 w-48" />
        </div>
      </PageContainer>
    );
  }

  const showDetails = opened && !flipping;
  const orientationLabel = drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";
  const lineText = `ไพ่ประจำวันของฉัน: ${nameTh}\n${message}\n${PAGE_URL}`;

  return (
    <PageContainer variant="narrow">
      <AppBar
        label="ไพ่ประจำวัน"
        title="ไพ่ประจำวันของคุณ"
        caption={`${formatThaiDate(todayKey)} · ${
          opened ? "คุณเปิดไพ่วันนี้แล้ว กลับมาเปิดใหม่ได้พรุ่งนี้" : "แตะที่ไพ่เพื่อเปิดพลังงานประจำวัน"
        }`}
        backHref="/"
        right={opened ? <HeartSave saved={savedId !== null} onToggle={toggleSaved} /> : undefined}
      />

      <div className="mt-4 space-y-6 px-1">
        <FlipCard drawn={drawn} flipped={opened} onFlip={handleFlip} />

        {showDetails ? (
          <div className="space-y-6 animate-fade-up motion-safe-fade" data-testid="daily-details">
            <div className="text-center">
              <h2 className="font-display text-[26px] font-semibold leading-tight text-fg">{nameTh}</h2>
              <p className="mt-1 text-[13px] text-fg-muted">
                {drawn.card.name} · {orientationLabel}
              </p>
            </div>
            <DailyMessage engineText={message} aiEnabled={showAiReading} aiLoading={aiLoading} ai={aiReading} />
          </div>
        ) : null}

        <WeekStrip history={history} todayKey={todayKey} />

        {showDetails ? (
          <div className="space-y-4 animate-fade-up motion-safe-fade" data-testid="daily-actions">
            <MidnightCountdown />
            <LineCtaButton label="รับไพ่รายวันทาง LINE" text={lineText} />
            <div className="grid grid-cols-2 gap-3">
              <ShareButton
                variant="ghost"
                size="lg"
                className="w-full"
                shareData={{ title: `ไพ่ประจำวัน — ${nameTh}`, text: message, url: PAGE_URL }}
              />
              <Button type="button" variant="ghost" size="lg" className="w-full" onClick={shareFacebook} aria-label="แชร์ไปเฟซบุ๊ก">
                <Facebook className="size-4 text-gold" strokeWidth={1.5} />
                เฟซบุ๊ก
              </Button>
            </div>
            <TrustPanel
              computedFrom={TRUST_COMPUTED_FROM}
              confidence="ปานกลาง"
              aiUsed={showAiReading && aiReading !== null}
            />
            {user?.isAdmin ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleAdminReset}
                data-testid="daily-admin-reset"
              >
                <RefreshCw className="size-4" strokeWidth={1.5} />
                สุ่มไพ่ใหม่ (เฉพาะผู้ดูแลระบบ)
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}
