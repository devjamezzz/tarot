"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Coins,
  GraduationCap,
  Heart,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { EXAMPLE_QUESTIONS, MAX_QUESTION_LENGTH, type TopicId } from "@/lib/tarot/spreads";
import { useConfigStore, type FeatureToggles } from "@/store/useConfigStore";
import { cn } from "@/lib/cn";
import { buildTarotStartHref } from "./tarotStartHref";

interface TopicChip {
  id: TopicId;
  label: string;
  icon: LucideIcon;
  placeholder: string;
}

interface LinkChip {
  href: string;
  label: string;
  icon: LucideIcon;
  toggle?: keyof FeatureToggles;
}

const TOPIC_CHIPS: TopicChip[] = [
  { id: "love", label: "ความรัก", icon: Heart, placeholder: EXAMPLE_QUESTIONS.love[0] },
  { id: "work", label: "งาน", icon: Briefcase, placeholder: EXAMPLE_QUESTIONS.work[0] },
  { id: "money", label: "เงิน", icon: Coins, placeholder: EXAMPLE_QUESTIONS.money[0] },
  { id: "general", label: "สอบ", icon: GraduationCap, placeholder: "สอบครั้งนี้จะผ่านไหม" },
];

const LINK_CHIPS: LinkChip[] = [
  { href: "/daily-card", label: "ไพ่วันนี้", icon: CalendarDays, toggle: "enableDailyAuspicious" },
  { href: "/esiimsi", label: "เซียมซี", icon: ScrollText },
];

const DEFAULT_PLACEHOLDER = `พิมพ์คำถาม เช่น ${EXAMPLE_QUESTIONS.general[0]}`;

export function HeroQuestion({ className }: { className?: string }) {
  const router = useRouter();
  const toggles = useConfigStore((state) => state.toggles);
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState<TopicId | null>(null);

  const tarotEnabled = toggles.enableTarot;
  const activeChip = TOPIC_CHIPS.find((chip) => chip.id === topic);
  const placeholder = activeChip ? `เช่น ${activeChip.placeholder}` : DEFAULT_PLACEHOLDER;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tarotEnabled) return;
    router.push(buildTarotStartHref({ question, topic }));
  };

  return (
    <section aria-labelledby="home-hero-title" className={cn("animate-fade-up", className)}>
      <p className="eyebrow">ถามไพ่กับเรฟได้ทันที</p>
      <h1
        id="home-hero-title"
        className="mt-1 text-balance font-display text-[30px] font-semibold leading-tight text-fg md:text-[40px]"
      >
        อยากให้ไพ่ตอบเรื่องอะไรวันนี้
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        ตั้งจิต พิมพ์คำถาม แล้วเปิดไพ่ได้เลย ไม่ต้องสมัครสมาชิก อยากอ่านลึกค่อยส่งไพ่ให้หมอดูเรฟ
      </p>

      <form onSubmit={submit} className="relative mt-5">
        <label htmlFor="home-question" className="sr-only">
          คำถามของคุณ
        </label>
        <Input
          id="home-question"
          data-testid="home-question"
          name="question"
          type="text"
          autoComplete="off"
          maxLength={MAX_QUESTION_LENGTH}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={placeholder}
          disabled={!tarotEnabled}
          className="h-14 rounded-pill pl-5 pr-16 text-base"
        />
        <Button
          type="submit"
          variant="gold"
          size="icon"
          aria-label="เริ่มเปิดไพ่"
          disabled={!tarotEnabled}
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
        >
          <ArrowRight className="size-5" strokeWidth={2} />
        </Button>
      </form>
      <p className="mt-2 text-[13px] text-fg-muted">
        {tarotEnabled ? "คำถามนี้จะแนบไปกับไพ่ที่ส่งให้หมอดูเท่านั้น" : "ไพ่ทาโรต์ปิดปรับปรุงชั่วคราว"}
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="หัวข้อที่อยากถาม">
        {TOPIC_CHIPS.map((chip) => {
          const Icon = chip.icon;
          const selected = topic === chip.id;
          return (
            <Chip
              key={chip.id}
              selected={selected}
              disabled={!tarotEnabled}
              onClick={() => setTopic(selected ? null : chip.id)}
              leadingIcon={<Icon strokeWidth={1.5} className="text-gold" />}
            >
              {chip.label}
            </Chip>
          );
        })}
        {LINK_CHIPS.filter((chip) => !chip.toggle || toggles[chip.toggle]).map((chip) => {
          const Icon = chip.icon;
          return (
            <Chip
              key={chip.href}
              onClick={() => router.push(chip.href)}
              leadingIcon={<Icon strokeWidth={1.5} className="text-gold" />}
            >
              {chip.label}
            </Chip>
          );
        })}
      </div>
    </section>
  );
}
