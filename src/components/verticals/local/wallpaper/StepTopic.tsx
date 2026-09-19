"use client";

import { Hash, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { TOPIC_INFO, type WallpaperTopic } from "@/lib/tarot/topicPools";
import type { LuckyNumberOption } from "@/lib/tarot/luckyNumbers";
import { TOPICS } from "./constants";
import { StepHeader } from "./StepProgress";

interface StepTopicProps {
  selectedTopic: WallpaperTopic;
  hasSymbols: boolean;
  onSelectTopic: (topic: WallpaperTopic) => void;
  luckyNumbers: LuckyNumberOption[];
  selectedLucky: number | null;
  onSelectLucky: (num: number) => void;
}

const MAX_SCORE = 10;

export function StepTopic({
  selectedTopic,
  hasSymbols,
  onSelectTopic,
  luckyNumbers,
  selectedLucky,
  onSelectLucky,
}: StepTopicProps) {
  return (
    <div className="space-y-5">
      <StepHeader icon={Star} title="เลือกเรื่องที่ต้องการเสริม" caption="เลือกหมวดและเลขมงคลเสริมดวง" />

      <div className="grid grid-cols-3 gap-2" role="group" aria-label="เรื่องที่ต้องการเสริม">
        {TOPICS.map((t) => {
          const active = selectedTopic === t.id && hasSymbols;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTopic(t.id)}
              aria-pressed={active}
              className={cn(
                "flex min-h-[88px] flex-col items-center justify-center rounded-card border p-3 text-center transition-[border-color,background-color,transform] active:scale-[.97] motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                active ? "border-gold bg-gold-soft" : "border-line bg-surface hover:border-gold/60"
              )}
            >
              <Icon className={cn("mb-1 size-5", active ? "text-gold" : "text-fg-muted")} strokeWidth={1.5} aria-hidden="true" />
              <span className="text-sm font-medium text-fg">{t.label}</span>
              <span className="text-[13px] text-fg-muted">{t.sublabel}</span>
            </button>
          );
        })}
      </div>

      {hasSymbols && luckyNumbers.length > 0 ? (
        <div className="space-y-3">
          <div className="text-center">
            <Hash className="mx-auto mb-1 size-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="font-display text-lg font-semibold text-fg">เลขมงคลเสริมดวง</h3>
            <p className="mt-1 text-[13px] text-fg-muted">สำหรับเรื่อง{TOPIC_INFO[selectedTopic].labelTh}</p>
          </div>

          <div className="space-y-2" role="group" aria-label="เลขมงคล">
            {luckyNumbers.map((ln) => {
              const active = selectedLucky === ln.num;
              return (
                <button
                  key={ln.num}
                  type="button"
                  onClick={() => onSelectLucky(ln.num)}
                  aria-pressed={active}
                  aria-label={`เลข ${ln.num} พลังเสริม ${ln.score} จาก ${MAX_SCORE}`}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-card border p-4 text-left transition-[border-color,background-color,transform] active:scale-[.98] motion-reduce:transition-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                    active ? "border-gold bg-gold-soft" : "border-line bg-surface hover:border-gold/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-pill border font-sans text-xl font-bold tabular-nums",
                      active ? "border-gold bg-gold-soft text-gold" : "border-line-faint bg-sunk text-fg-muted"
                    )}
                  >
                    {ln.num}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-fg">{ln.reasonTh}</span>
                    <span className="mt-1 flex items-center gap-1.5">
                      <span className="text-[13px] text-fg-muted">พลังเสริม</span>
                      <span className="flex gap-0.5" aria-hidden="true">
                        {Array.from({ length: MAX_SCORE }).map((_, i) => (
                          <span
                            key={i}
                            className={cn("h-2 w-2 rounded-pill", i < ln.score ? "bg-gold" : "bg-sunk border border-line-faint")}
                          />
                        ))}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
