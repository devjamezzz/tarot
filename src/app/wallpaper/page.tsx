"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import type { BirthDateValue } from "@/components/ui/BirthDateField";
import { useMounted } from "@/components/library/useMounted";
import { StepProgress } from "@/components/verticals/local/wallpaper/StepProgress";
import { StepBirth } from "@/components/verticals/local/wallpaper/StepBirth";
import { StepTopic } from "@/components/verticals/local/wallpaper/StepTopic";
import { StepCustomize } from "@/components/verticals/local/wallpaper/StepCustomize";
import { StepStyle } from "@/components/verticals/local/wallpaper/StepStyle";
import { StepResult } from "@/components/verticals/local/wallpaper/StepResult";
import { MAX_COLORS, type WallpaperStyle } from "@/components/verticals/local/wallpaper/constants";
import {
  getTodayKey,
  saveTodayWallpaper,
  useTodayWallpaper,
} from "@/components/verticals/local/wallpaper/storage";
import { calculateBirthColors, type AuspiciousColor, type BirthColorResult } from "@/lib/thai-astrology/colors";
import { calculateLuckyElements, type LuckyElementsResult } from "@/lib/thai-astrology/luckyElements";
import { getTopicSymbols, TOPIC_INFO, type TopicSymbols, type WallpaperTopic } from "@/lib/tarot/topicPools";
import { getLuckyNumbers, type LuckyNumberOption } from "@/lib/tarot/luckyNumbers";

const LAST_STEP = 5;

export default function WallpaperPage() {
  const mounted = useMounted();
  const savedToday = useTodayWallpaper();

  // Wizard step: 1=birthdate, 2=topic+lucky, 3=custom elements+text, 4=style, 5=generating/result
  const [wizardStep, setWizardStep] = useState(1);

  const [birth, setBirth] = useState<BirthDateValue | null>(null);
  const [birthTime, setBirthTime] = useState("");
  const [birthColors, setBirthColors] = useState<BirthColorResult | null>(null);
  const [selectedColors, setSelectedColors] = useState<AuspiciousColor[]>([]);

  const [selectedTopic, setSelectedTopic] = useState<WallpaperTopic>("finance");
  const [topicSymbols, setTopicSymbols] = useState<TopicSymbols | null>(null);
  const [luckyNumbers, setLuckyNumbers] = useState<LuckyNumberOption[]>([]);
  const [selectedLucky, setSelectedLucky] = useState<number | null>(null);

  const [luckyElements, setLuckyElements] = useState<LuckyElementsResult | null>(null);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");

  const [selectedStyle, setSelectedStyle] = useState<WallpaperStyle>("minimal");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const alreadyGenerated = savedToday !== null;
  const image = generatedImage ?? savedToday?.imageUrl ?? null;
  const step = alreadyGenerated ? LAST_STEP : wizardStep;
  const canShare = mounted && typeof navigator !== "undefined" && typeof navigator.share === "function";

  const resultTopic = (savedToday?.topic as WallpaperTopic | undefined) ?? selectedTopic;
  const topicLabel = TOPIC_INFO[resultTopic]?.labelTh ?? TOPIC_INFO[selectedTopic].labelTh;
  const elementLabels = selectedElements
    .map((id) => luckyElements?.elements.find((e) => e.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  function handleBirthChange(value: BirthDateValue | null) {
    setBirth(value);
    setBirthColors(null);
    setSelectedColors([]);
  }

  function handleTimeChange(value: string) {
    setBirthTime(value);
    setBirthColors(null);
    setSelectedColors([]);
  }

  function handleBirthSubmit() {
    if (!birth) return;
    const date = new Date(birth.year, birth.month - 1, birth.day);
    const hour = birthTime ? parseInt(birthTime.split(":")[0], 10) : undefined;
    setBirthColors(calculateBirthColors(date, hour));
    setSelectedColors([]);
    setLuckyElements(calculateLuckyElements(date));
    setSelectedElements([]);
  }

  function toggleColor(color: AuspiciousColor) {
    setSelectedColors((prev) => {
      if (prev.some((c) => c.hex === color.hex)) return prev.filter((c) => c.hex !== color.hex);
      if (prev.length >= MAX_COLORS) return [prev[prev.length - 1], color];
      return [...prev, color];
    });
  }

  function handleTopicSelect(topic: WallpaperTopic) {
    setSelectedTopic(topic);
    setTopicSymbols(getTopicSymbols(topic));
    const nums = getLuckyNumbers(topic);
    setLuckyNumbers(nums);
    setSelectedLucky(nums[0]?.num ?? null);
  }

  function toggleElement(id: string) {
    setSelectedElements((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const canGoNext =
    step === 1
      ? selectedColors.length >= 1
      : step === 2
        ? Boolean(topicSymbols) && selectedLucky !== null
        : step === 3 || step === 4;

  function goNext() {
    if (!canGoNext || step >= LAST_STEP) return;
    if (step === 1 && !topicSymbols) handleTopicSelect(selectedTopic);
    setWizardStep(step + 1);
  }

  function goBack() {
    if (step > 1) setWizardStep(step - 1);
  }

  async function handleGenerate() {
    if (alreadyGenerated || isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setWizardStep(LAST_STEP);

    const elementDescs = selectedElements
      .map((id) => luckyElements?.elements.find((e) => e.id === id)?.en ?? "")
      .filter(Boolean)
      .join(", ");

    try {
      const resp = await fetch("/api/ai/wallpaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedColors: selectedColors.map((c) => ({ nameEn: c.nameEn, hex: c.hex })),
          topic: selectedTopic,
          symbols: topicSymbols?.symbols ?? "",
          customElements: elementDescs,
          overlayText: customText.trim(),
          luckyNumber: selectedLucky ?? 9,
          style: selectedStyle,
        }),
      });
      const data = await resp.json();

      if (!resp.ok || !data.ok || typeof data.image !== "string") {
        setError(
          data?.error === "gemini_error"
            ? "ไม่สามารถสร้างภาพได้ในขณะนี้ กรุณาลองใหม่"
            : "ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
        );
        return;
      }

      setGeneratedImage(data.image);
      saveTodayWallpaper({
        date: getTodayKey(),
        imageUrl: data.image,
        topic: selectedTopic,
        luckyNumber: selectedLucky ?? undefined,
        selectedColorNames: selectedColors.map((c) => c.nameTh),
      });
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleDownload() {
    if (!image) return;
    const link = document.createElement("a");
    link.download = `reffortune-wallpaper-${getTodayKey()}.png`;
    link.href = image;
    link.click();
  }

  async function handleShare() {
    if (!image || typeof navigator.share !== "function") return;
    try {
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], "reffortune-wallpaper.png", { type: "image/png" });
      await navigator.share({
        title: "วอลเปเปอร์เสริมดวง — REFFORTUNE",
        text: "วอลเปเปอร์เสริมดวงจาก REFFORTUNE",
        files: [file],
      });
    } catch {
      // Share cancelled
    }
  }

  return (
    <PageContainer variant="narrow">
      <AppBar
        label="วอลเปเปอร์"
        title="วอลเปเปอร์เสริมดวง"
        caption="สีมงคล เลขมงคล และสัญลักษณ์เสริมดวงในภาพเดียว วันละ 1 ภาพ"
        backHref="/explore"
      />

      <div className="mt-4">
        {step < LAST_STEP ? <StepProgress step={step} /> : null}

        {step === 1 ? (
          <StepBirth
            birth={birth}
            onBirthChange={handleBirthChange}
            birthTime={birthTime}
            onTimeChange={handleTimeChange}
            birthColors={birthColors}
            selectedColors={selectedColors}
            onToggleColor={toggleColor}
            onCalculate={handleBirthSubmit}
          />
        ) : null}

        {step === 2 ? (
          <StepTopic
            selectedTopic={selectedTopic}
            hasSymbols={Boolean(topicSymbols)}
            onSelectTopic={handleTopicSelect}
            luckyNumbers={luckyNumbers}
            selectedLucky={selectedLucky}
            onSelectLucky={setSelectedLucky}
          />
        ) : null}

        {step === 3 ? (
          <StepCustomize
            luckyElements={luckyElements}
            selectedElements={selectedElements}
            onToggleElement={toggleElement}
            customText={customText}
            onTextChange={setCustomText}
          />
        ) : null}

        {step === 4 ? (
          <StepStyle
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
            selectedColors={selectedColors}
            topicLabel={TOPIC_INFO[selectedTopic].labelTh}
            luckyNumber={selectedLucky}
            elementLabels={elementLabels}
            customText={customText}
          />
        ) : null}

        {step === LAST_STEP ? (
          <StepResult
            isGenerating={isGenerating}
            error={error}
            image={image}
            topicLabel={topicLabel}
            colorNames={savedToday?.selectedColorNames ?? selectedColors.map((c) => c.nameTh)}
            luckyNumber={savedToday?.luckyNumber ?? selectedLucky}
            alreadyGenerated={alreadyGenerated}
            canShare={canShare}
            onRetry={() => {
              setError(null);
              void handleGenerate();
            }}
            onBack={() => {
              setError(null);
              setWizardStep(4);
            }}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        ) : null}

        {step < LAST_STEP ? (
          <div className="mt-6 flex gap-3">
            {step > 1 ? (
              <Button type="button" variant="ghost" size="lg" className="flex-1" onClick={goBack}>
                <ChevronLeft strokeWidth={1.5} />
                ย้อนกลับ
              </Button>
            ) : null}
            <Button
              type="button"
              size="lg"
              className="flex-1"
              disabled={!canGoNext}
              onClick={step === 4 ? handleGenerate : goNext}
            >
              {step === 4 ? (
                <>
                  <Sparkles strokeWidth={1.5} />
                  สร้างวอลเปเปอร์
                </>
              ) : (
                <>
                  ถัดไป
                  <ChevronRight strokeWidth={1.5} />
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>
    </PageContainer>
  );
}
