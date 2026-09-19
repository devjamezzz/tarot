"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/ui/PageContainer";
import { AppBar } from "@/components/nav/AppBar";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { useAuth } from "@/components/auth/AuthProvider";
import { LineLoginButton, LoginConsentNote } from "@/components/auth/LineLoginButton";

const DEFAULT_RETURN_TO = "/profile";

/** Only same-origin paths are honoured; anything else falls back to /profile. */
function safeReturnTo(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return DEFAULT_RETURN_TO;
  return raw;
}

/**
 * Full-page login for direct links (brief §2.7). Same content as the
 * LoginSheet; keeps the ?error and ?returnTo contract of the OAuth callback.
 */
export function LoginClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");
  const returnTo = safeReturnTo(params.get("returnTo"));

  React.useEffect(() => {
    if (!loading && user) router.replace(returnTo);
  }, [loading, user, returnTo, router]);

  return (
    <PageContainer variant="narrow">
      <AppBar label="บัญชี" title="เข้าสู่ระบบ" backHref="/" />

      <Card className="mt-2" data-testid="login-card">
        <CardTitle>เข้าสู่ระบบเพื่อดำเนินการต่อ</CardTitle>
        <CardDesc className="mt-2">
          เข้าสู่ระบบด้วย LINE เพื่อบันทึกไพ่ เครดิต และประวัติการดูดวงของคุณข้ามเครื่อง
        </CardDesc>

        {error ? (
          <p
            role="alert"
            data-testid="login-error"
            className="mt-4 rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-fg"
          >
            เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
          </p>
        ) : null}

        <div className="mt-6">
          <LineLoginButton />
        </div>
        <LoginConsentNote className="mt-4" />
      </Card>
    </PageContainer>
  );
}
