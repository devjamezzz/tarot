"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/ui/PageContainer";
import { AiTypingDots } from "@/components/ui/AiTypingDots";
import { Button } from "@/components/ui/Button";
import { ensureLiff, loginWithLiff } from "@/lib/auth/liff";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * LIFF endpoint page. Configure this URL (e.g. https://<host>/liff) as the LIFF
 * app endpoint in the LINE console. It initializes LIFF, completes login, then
 * forwards the user into the app.
 */
export function LiffClient() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [unavailable, setUnavailable] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await ensureLiff();
      if (!ok) {
        if (!cancelled) setUnavailable(true);
        return;
      }
      const loggedIn = await loginWithLiff();
      if (cancelled) return;
      if (loggedIn) {
        await refresh();
        router.replace("/profile");
      }
      // If not logged in, loginWithLiff() has triggered a redirect.
    })();
    return () => {
      cancelled = true;
    };
  }, [router, refresh]);

  return (
    <PageContainer variant="narrow">
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
        <p className="eyebrow">บัญชี</p>
        {unavailable ? (
          <>
            <p className="text-sm text-fg-muted" role="status">
              ไม่สามารถเชื่อมต่อกับ LINE ได้ในขณะนี้
            </p>
            <Button asChild variant="ghost">
              <Link href="/login">ไปหน้าเข้าสู่ระบบ</Link>
            </Button>
          </>
        ) : (
          <AiTypingDots label="กำลังเชื่อมต่อกับ LINE…" />
        )}
      </div>
    </PageContainer>
  );
}
