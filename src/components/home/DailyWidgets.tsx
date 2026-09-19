"use client";

import Link from "next/link";
import { useId, type ReactNode } from "react";
import {
  Bookmark,
  CalendarDays,
  ChevronRight,
  Compass,
  Hash,
  Heart,
  ImageIcon,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useConfigStore, type FeatureToggles } from "@/store/useConfigStore";
import { cn } from "@/lib/cn";
import { useDailyCardWeek } from "./hooks";

const WEEK_LENGTH = 7;

interface Shortcut {
  href: string;
  label: string;
  icon: LucideIcon;
  toggle?: keyof FeatureToggles;
}

const SHORTCUTS: Shortcut[] = [
  { href: "/library/saved", label: "การอ่านของฉัน", icon: Bookmark },
  { href: "/love-tarot", label: "ดูดวงความรัก", icon: Heart, toggle: "enableLoveTarot" },
  { href: "/lucky-numbers", label: "ไพ่เลขมงคล", icon: Hash },
  { href: "/explore", label: "สำรวจทั้งหมด", icon: Compass },
];

function WeekStrip() {
  const week = useDailyCardWeek();
  const days = week?.days ?? Array.from({ length: WEEK_LENGTH }, (_, i) => ({ key: String(i), opened: false, isToday: false }));
  const opened = week?.openedCount ?? 0;

  return (
    <div className="mt-3 flex items-center gap-3">
      <ol className="flex items-center gap-1.5" aria-label={`เปิดไพ่แล้ว ${opened} จาก ${WEEK_LENGTH} วันล่าสุด`}>
        {days.map((day) => (
          <li
            key={day.key}
            aria-hidden="true"
            className={cn(
              "h-2.5 w-2.5 rounded-pill transition-colors",
              day.opened ? "bg-gold" : "border border-line",
              day.isToday && !day.opened && "border-gold"
            )}
          />
        ))}
      </ol>
      <span className="text-[13px] tabular-nums text-fg-muted" aria-live="polite">
        เปิดแล้ว {opened}/{WEEK_LENGTH} วัน
      </span>
    </div>
  );
}

interface WidgetLinkProps {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  children?: ReactNode;
}

function WidgetLink({ href, icon: Icon, title, desc, children }: WidgetLinkProps) {
  return (
    <Link
      href={href}
      className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      <Card interactive className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-line bg-sunk text-gold">
          <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="font-display text-lg font-semibold text-fg">{title}</span>
            <ChevronRight className="size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="mt-0.5 block text-[13px] leading-relaxed text-fg-muted">{desc}</span>
          {children}
        </span>
      </Card>
    </Link>
  );
}

/**
 * Daily hooks (brief §2.1 item 4). Rendered twice on the home page (mobile
 * inline + desktop rail), so the heading id comes from useId. The shortcut
 * row is mobile-only: on desktop the rail gives that room to ConsultTeaser
 * and every target is one tap away in the tab bar / explore.
 */
export function DailyWidgets({ className }: { className?: string }) {
  const toggles = useConfigStore((state) => state.toggles);
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className={className}>
      <SectionHeader label="ประจำวัน" title={<span id={titleId}>เปิดดวงวันนี้</span>} />

      <div className="mt-4 grid gap-3">
        {toggles.enableDailyAuspicious ? (
          <WidgetLink href="/daily-card" icon={CalendarDays} title="ไพ่ประจำวัน" desc="เปิดไพ่ 1 ใบ รับข้อความประจำวันของคุณ">
            <WeekStrip />
          </WidgetLink>
        ) : null}
        <WidgetLink href="/esiimsi" icon={ScrollText} title="เซียมซีวันนี้" desc="ตั้งจิตอธิษฐาน แล้วเขย่าติ้วรับคำทำนายจากตำราโบราณ" />
        <WidgetLink href="/wallpaper" icon={ImageIcon} title="วอลเปเปอร์เสริมดวง" desc="สร้างภาพมงคลประจำตัว วันละ 1 ครั้ง" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 md:hidden" aria-label="ทางลัด">
        {SHORTCUTS.filter((item) => !item.toggle || toggles[item.toggle]).map((item) => {
          const Icon = item.icon;
          return (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <Link href={item.href}>
                <Icon className="text-gold" strokeWidth={1.5} aria-hidden="true" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
