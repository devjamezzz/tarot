"use client";

import { MessageCircle, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useHistoryStore } from "@/store/useHistoryStore";
import { cn } from "@/lib/cn";
import { useDayIndex } from "./hooks";

/**
 * Estimated total readings shown on the home page.
 * BASE_COUNT + DAILY_GROWTH per day since EPOCH is deterministic (same number
 * for every visitor on a given day); the visitor's own local history is added
 * on top. Owner: replace with a real analytics figure when available.
 */
const BASE_COUNT = 12_840;
const DAILY_GROWTH = 23;
const EPOCH_DAY = Math.floor(Date.UTC(2026, 8, 1) / 86_400_000); // 1 ก.ย. 2569

interface Review {
  name: string;
  service: string;
  time: string;
  text: string;
  /** true = sample copy; owner replaces with real LINE reviews and flips to false. */
  placeholder: boolean;
}

// ตัวอย่างรีวิว (placeholder) — เจ้าของแทนที่ด้วยข้อความจริงจากแชท LINE แล้วตั้ง placeholder: false
const REVIEWS: Review[] = [
  {
    name: "คุณพลอย",
    service: "ไพ่ 3 ใบ · เรื่องงาน",
    time: "20:14 น.",
    text: "ถามเรื่องย้ายงาน ไพ่บอกให้รอจังหวะก่อน สุดท้ายได้ย้ายแผนกที่อยากไปจริง ๆ ขอบคุณมาก",
    placeholder: true,
  },
  {
    name: "คุณเบียร์",
    service: "ถาม 1 คำถาม · พิมพ์ตอบ",
    time: "12:40 น.",
    text: "ส่งไพ่ทาง LINE แล้วหมอดูตอบเร็วมาก อธิบายเพิ่มให้ละเอียด เข้าใจง่าย ไม่ต้องรอนาน",
    placeholder: true,
  },
  {
    name: "คุณมิ้นท์",
    service: "เซียมซี",
    time: "09:05 น.",
    text: "เขย่าได้ใบที่ตรงกับเรื่องที่คิดอยู่พอดี อ่านคำทำนายแล้วสบายใจขึ้นเยอะเลย",
    placeholder: true,
  },
];

function formatCount(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="flex w-[280px] shrink-0 snap-start flex-col gap-3 md:w-auto">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-line bg-sunk font-display text-sm font-semibold text-gold">
          {review.name.replace(/^คุณ/, "").slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-fg">{review.name}</span>
          <span className="block truncate text-xs text-fg-muted">{review.service}</span>
        </span>
        <MessageCircle className="size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <blockquote className="rounded-card rounded-tl-none bg-sunk px-3 py-2.5 text-sm leading-relaxed text-fg">
        {review.text}
      </blockquote>
      <p className="text-xs text-fg-subtle">{review.time}</p>
    </Card>
  );
}

export function SocialProof({ className }: { className?: string }) {
  const dayIndex = useDayIndex();
  const localCount = useHistoryStore((state) => state.history.length);
  const daysSinceEpoch = Math.max(0, (dayIndex ?? EPOCH_DAY) - EPOCH_DAY);
  const estimate = BASE_COUNT + daysSinceEpoch * DAILY_GROWTH + localCount;
  const allPlaceholders = REVIEWS.every((review) => review.placeholder);

  return (
    <section aria-labelledby="home-social-title" className={cn("animate-fade-up", className)}>
      <Card className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill border border-line bg-sunk text-gold">
          <Users className="size-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="eyebrow">ผู้ใช้ทั้งหมด</p>
          <p
            id="home-social-title"
            data-testid="home-social-count"
            aria-live="polite"
            className="font-sans text-2xl font-bold tabular-nums tracking-[0.02em] text-fg"
          >
            ดูดวงไปแล้ว {formatCount(estimate)} ครั้ง
          </p>
          <p className="text-[13px] text-fg-muted">
            ตัวเลขประมาณการ · รวมของคุณ {formatCount(localCount)} ครั้งในเครื่องนี้
          </p>
        </div>
      </Card>

      <SectionHeader
        className="mt-6"
        label={allPlaceholders ? "รีวิวตัวอย่าง" : "จากแชท LINE ของลูกดวง"}
        title="เสียงจากลูกดวง"
      />
      <div className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>
    </section>
  );
}
