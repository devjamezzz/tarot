"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useAuth } from "./authContext";

function LineGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0" fill="currentColor">
      <path d="M12 3C6.48 3 2 6.64 2 11.1c0 3.98 3.53 7.32 8.3 7.98.32.07.76.21.87.49.1.25.07.65.03.9l-.14.84c-.04.25-.2.98.86.53 1.06-.44 5.7-3.36 7.78-5.75C21.15 14.5 22 12.9 22 11.1 22 6.64 17.52 3 12 3z" />
    </svg>
  );
}

export interface LineLoginButtonProps {
  className?: string;
  size?: "default" | "lg";
}

/** Full-width LINE-green login button wired to useAuth().login(). */
export function LineLoginButton({ className, size = "lg" }: LineLoginButtonProps) {
  const { loading, login } = useAuth();
  return (
    <Button
      type="button"
      variant="line"
      size={size}
      onClick={login}
      disabled={loading}
      data-testid="line-login"
      className={cn("w-full", className)}
    >
      <LineGlyph />
      {loading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบด้วย LINE"}
    </Button>
  );
}

/** Consent caption shown under every LINE login button. */
export function LoginConsentNote({ className }: { className?: string }) {
  const linkClass =
    "text-gold underline underline-offset-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
  return (
    <p className={cn("text-[13px] leading-relaxed text-fg-subtle", className)}>
      เมื่อเข้าสู่ระบบ ถือว่าคุณยอมรับ{" "}
      <Link href="/terms" className={linkClass}>
        ข้อกำหนดการใช้งาน
      </Link>{" "}
      และ{" "}
      <Link href="/privacy" className={linkClass}>
        นโยบายความเป็นส่วนตัว
      </Link>
    </p>
  );
}
