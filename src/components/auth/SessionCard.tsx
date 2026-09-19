"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "./authContext";
import { LineLoginButton, LoginConsentNote } from "./LineLoginButton";

const TIER_LABELS: Record<string, string> = {
  free: "สมาชิกทั่วไป",
  premium: "สมาชิกพรีเมียม",
  vip: "สมาชิก VIP",
};

export function membershipTierLabel(tier: string): string {
  return TIER_LABELS[tier.toLowerCase()] ?? `ระดับ ${tier}`;
}

function Avatar({ name, pictureUrl }: { name: string; pictureUrl: string | null }) {
  if (pictureUrl) {
    return (
      // LINE avatars live on profile.line-scdn.net, outside next/image remotePatterns.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pictureUrl}
        alt={`รูปโปรไฟล์ของ ${name}`}
        className="size-14 shrink-0 rounded-pill border border-line object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid size-14 shrink-0 place-items-center rounded-pill border border-gold bg-gold-soft font-display text-xl font-semibold text-gold"
    >
      {name.slice(0, 1)}
    </span>
  );
}

/**
 * Account summary: avatar, name, tier and credits when logged in; a LINE login
 * button otherwise. Shared by /settings and /profile.
 */
export function SessionCard({ className }: { className?: string }) {
  const { user, loading, logout } = useAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
  };

  if (loading) {
    return (
      <Card className={className} data-testid="session-card">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-pill" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <span className="sr-only" role="status">
          กำลังโหลด…
        </span>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={className} data-testid="session-card">
        <p className="eyebrow mb-1">บัญชี</p>
        <CardTitle>ยังไม่ได้เข้าสู่ระบบ</CardTitle>
        <CardDesc className="mt-1">
          เข้าสู่ระบบด้วย LINE เพื่อบันทึกไพ่ เครดิต และประวัติการดูดวงของคุณข้ามเครื่อง
        </CardDesc>
        <div className="mt-5">
          <LineLoginButton />
        </div>
        <LoginConsentNote className="mt-3" />
      </Card>
    );
  }

  const name = user.displayName?.trim() || "สมาชิก";

  return (
    <Card className={className} data-testid="session-card">
      <p className="eyebrow mb-3">บัญชี</p>
      <div className="flex items-center gap-4">
        <Avatar name={name} pictureUrl={user.pictureUrl} />
        <div className="min-w-0">
          <CardTitle className="truncate">{name}</CardTitle>
          <CardDesc className="mt-0.5">{membershipTierLabel(user.membershipTier)}</CardDesc>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3 rounded-card border border-line-faint bg-sunk px-4 py-3">
        <span className="text-sm text-fg-muted">เครดิตคงเหลือ</span>
        <span className="font-display text-2xl font-semibold tabular-nums text-gold" aria-live="polite">
          {user.credits.toLocaleString("th-TH")}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button asChild variant="gold">
          <Link href="/pricing">เติมเครดิต</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => void handleLogout()}
          disabled={signingOut}
        >
          {signingOut ? "กำลังออก…" : "ออกจากระบบ"}
        </Button>
      </div>
    </Card>
  );
}
