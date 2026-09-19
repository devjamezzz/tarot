"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { dayKeyToDate, toDayKey } from "./dailyCardStorage";

const WEEKDAYS_TH = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

export interface WeekStripProps {
  /** Day keys ('YYYY-MM-DD') on which a card was opened. */
  history: string[];
  todayKey: string;
}

function lastSevenDays(todayKey: string): { key: string; weekday: string }[] {
  const today = dayKeyToDate(todayKey);
  const days: { key: string; weekday: string }[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    days.push({ key: toDayKey(date), weekday: WEEKDAYS_TH[date.getDay()] });
  }
  return days;
}

/** 7-day strip: gold dot = opened, empty ring = not opened. */
export function WeekStrip({ history, todayKey }: WeekStripProps) {
  const days = lastSevenDays(todayKey);
  const openedCount = days.filter((day) => history.includes(day.key)).length;

  return (
    <Card variant="sunk" role="group" aria-label="การเปิดไพ่ 7 วันล่าสุด" data-testid="week-strip">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">7 วันล่าสุด</p>
        <p aria-live="polite" className="text-[13px] tabular-nums text-fg-muted">
          เปิดแล้ว {openedCount}/7 วัน
        </p>
      </div>
      <ol className="mt-3 flex items-start justify-between gap-1">
        {days.map((day) => {
          const opened = history.includes(day.key);
          const isToday = day.key === todayKey;
          return (
            <li key={day.key} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn(
                  "h-3.5 w-3.5 rounded-pill border transition-colors",
                  opened ? "border-gold bg-gold shadow-gold-glow" : "border-line bg-transparent",
                  isToday && !opened && "border-gold"
                )}
              />
              <span className={cn("text-[13px]", isToday ? "font-bold text-gold" : "text-fg-muted")}>
                {day.weekday}
              </span>
              <span className="sr-only">
                {isToday ? "วันนี้" : day.key} {opened ? "เปิดแล้ว" : "ยังไม่เปิด"}
              </span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
