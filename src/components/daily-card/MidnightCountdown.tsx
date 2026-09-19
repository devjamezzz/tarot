"use client";

import { msUntilNextMidnight, useClockSeconds } from "./dailyCardStorage";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** "กลับมาเปิดไพ่ใหม่ได้ใน HH:MM:SS" — counts down to the next local midnight. */
export function MidnightCountdown() {
  const nowSeconds = useClockSeconds();
  if (!nowSeconds) return null;

  const remaining = msUntilNextMidnight(new Date(nowSeconds * 1000));

  return (
    <p data-testid="daily-countdown" className="text-center text-[13px] text-fg-muted">
      กลับมาเปิดไพ่ใหม่ได้ใน{" "}
      <span className="font-bold tabular-nums tracking-[.12em] text-gold">{formatCountdown(remaining)}</span>
    </p>
  );
}
