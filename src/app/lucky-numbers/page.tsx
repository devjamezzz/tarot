"use client";

import { useEffect, useRef, useState } from "react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { CountChooser } from "@/components/verticals/local/lucky-numbers/CountChooser";
import { PickStage } from "@/components/verticals/local/lucky-numbers/PickStage";
import { LuckyResult } from "@/components/verticals/local/lucky-numbers/LuckyResult";
import { HOW_TO_PLAY_STEPS, PICK_TRANSITION_MS, type Stage } from "@/components/verticals/local/lucky-numbers/constants";
import { StepsCard } from "@/components/verticals/local/StepsCard";
import { ExploreMore } from "@/components/verticals/local/ExploreMore";
import {
  analyseLuckyDigits,
  shuffleDigits,
  type LuckyDigit,
  type LuckyDigitAnalysis,
  type LuckyDigitCount,
} from "@/lib/lucky-numbers/engine";
import { trackEvent } from "@/lib/analytics/tracking";

export default function LuckyNumbersPage() {
  const [stage, setStage] = useState<Stage>("choose-count");
  const [count, setCount] = useState<LuckyDigitCount>(2);
  const [deck, setDeck] = useState<LuckyDigit[]>(() => shuffleDigits());
  const [picked, setPicked] = useState<LuckyDigit[]>([]);
  const [pickingIndex, setPickingIndex] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<LuckyDigitAnalysis | null>(null);
  const pickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    trackEvent("reading_start", { vertical: "lucky-numbers", step: "form_view" });
    return () => {
      if (pickTimer.current) clearTimeout(pickTimer.current);
    };
  }, []);

  function startPicking(n: LuckyDigitCount) {
    setCount(n);
    setPicked([]);
    setPickingIndex(null);
    setDeck(shuffleDigits());
    setAnalysis(null);
    setStage("picking");
    trackEvent("reading_submitted", { vertical: "lucky-numbers", step: `choose_count:${n}` });
  }

  // When the user taps a card: lift + glow, then commit and either reshuffle
  // or move to the result stage. The digit is never revealed at pick time.
  function handlePick(idx: number) {
    if (pickingIndex !== null) return;
    setPickingIndex(idx);
    const chosen = deck[idx];
    const next = [...picked, chosen];

    pickTimer.current = setTimeout(() => {
      setPicked(next);
      if (next.length >= count) {
        setAnalysis(analyseLuckyDigits(next));
        setStage("result");
        trackEvent("reading_result_viewed", { vertical: "lucky-numbers" });
      } else {
        setDeck(shuffleDigits());
        setPickingIndex(null);
      }
    }, PICK_TRANSITION_MS);
  }

  function resetAll() {
    setStage("choose-count");
    setPicked([]);
    setPickingIndex(null);
    setDeck(shuffleDigits());
    setAnalysis(null);
  }

  if (stage === "result" && analysis) {
    return <LuckyResult analysis={analysis} onReset={resetAll} />;
  }

  return (
    <PageContainer variant="narrow">
      <AppBar
        label="เลขมงคล"
        title="ไพ่เลขมงคล"
        caption="หยิบไพ่จากครึ่งวงกลม รับชุดเลขเสริมดวงแบบสด ๆ"
        backHref="/explore"
      />

      {stage === "choose-count" ? (
        <>
          <CountChooser onChoose={startPicking} />
          <StepsCard label="วิธีเล่น" title="3 ขั้นตอนก่อนได้เลขนำโชค" steps={HOW_TO_PLAY_STEPS} />
          <ExploreMore />
        </>
      ) : null}

      {stage === "picking" ? (
        <PickStage
          count={count}
          picked={picked}
          deck={deck}
          pickingIndex={pickingIndex}
          onPick={handlePick}
          onChangeCount={resetAll}
        />
      ) : null}
    </PageContainer>
  );
}
