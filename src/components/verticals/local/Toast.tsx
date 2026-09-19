"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

const TOAST_MS = 1800;

export const TOAST_SAVED = "บันทึกเรียบร้อย";
export const TOAST_REMOVED = "เอาออกจากคลังแล้ว";
export const TOAST_COPIED = "คัดลอกลิงก์แล้ว";

/** Tiny toast state: `show(text)` displays it for ~1.8s above the tab bar. */
export function useToast() {
  const [message, setMessage] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const show = React.useCallback((text: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(null), TOAST_MS);
  }, []);

  return { message, show };
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="toast"
      className={cn(
        "pointer-events-none fixed left-1/2 z-[10001] -translate-x-1/2 above-tabbar mb-4",
        "motion-safe-fade transition-opacity duration-200",
        message ? "opacity-100" : "opacity-0"
      )}
    >
      {message ? (
        <div className="rounded-pill border border-line bg-surface px-4 py-2 text-sm text-fg shadow-card">
          {message}
        </div>
      ) : null}
    </div>
  );
}
