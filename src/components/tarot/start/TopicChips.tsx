"use client";

import { Briefcase, Coins, Heart, Sparkles, type LucideIcon } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { TOPICS, type TopicId } from "@/lib/tarot/spreads";

const TOPIC_ICONS: Record<TopicId, LucideIcon> = {
  general: Sparkles,
  love: Heart,
  work: Briefcase,
  money: Coins,
};

export interface TopicChipsProps {
  value: TopicId;
  onChange: (topic: TopicId) => void;
}

/**
 * Topic capsules: ทั่วไป / ความรัก / การงาน / การเงิน.
 * A 2×2 grid under 640px (four capsules never fit one 390px row, and 3+1
 * wrapping leaves an orphan); a single wrapped row from `sm` up.
 */
export function TopicChips({ value, onChange }: TopicChipsProps) {
  return (
    <div
      role="group"
      aria-label="หัวข้อที่อยากถาม"
      className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap"
    >
      {TOPICS.map((topic) => {
        const Icon = TOPIC_ICONS[topic.id];
        return (
          <Chip
            key={topic.id}
            data-testid="topic-chip"
            data-topic={topic.id}
            selected={value === topic.id}
            onClick={() => onChange(topic.id)}
            className="h-11 px-5"
            leadingIcon={<Icon className="text-gold" strokeWidth={1.5} />}
          >
            {topic.labelTh}
          </Chip>
        );
      })}
    </div>
  );
}
