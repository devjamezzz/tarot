"use client";

import * as React from "react";
import { loginWithLiff, isInLineClient } from "@/lib/auth/liff";
import { syncLocalHistoryToServer } from "@/lib/auth/syncLocal";
import { AuthContext, useAuth, useLoginSheet } from "./authContext";
import type { AuthUser, AuthContextValue, LoginSheetState } from "./authContext";
import { LoginSheet } from "./LoginSheet";

export type { AuthUser, AuthContextValue, LoginSheetState };
export { useAuth, useLoginSheet };

const CLOSED_SHEET: LoginSheetState = { open: false };

/**
 * Client auth context. Effect-driven (no SSR state) to match the StoreHydrator
 * discipline and avoid React 19 hydration mismatches. On mount it fetches the
 * session; inside the LINE app it auto-attempts LIFF login. Also owns the
 * single LoginSheet instance so any page can call openLoginSheet(reason).
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loginSheet, setLoginSheet] = React.useState<LoginSheetState>(CLOSED_SHEET);

  const refresh = React.useCallback(async () => {
    try {
      const resp = await fetch("/api/auth/session", { cache: "no-store" });
      const data = (await resp.json()) as { user: AuthUser | null };
      setUser(data.user ?? null);
      if (data.user) void syncLocalHistoryToServer(data.user.id);
    } catch {
      setUser(null);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      // Auto-login when running inside the LINE app.
      try {
        if (await isInLineClient()) {
          await loginWithLiff();
        }
      } catch {
        // ignore — fall through to session check
      }
      if (cancelled) return;
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const login = React.useCallback(() => {
    // Inside LINE → LIFF; otherwise web OAuth redirect.
    void (async () => {
      if (await isInLineClient()) {
        await loginWithLiff();
        await refresh();
      } else {
        const returnTo = window.location.pathname + window.location.search;
        window.location.href = `/api/auth/line/login?returnTo=${encodeURIComponent(returnTo)}`;
      }
    })();
  }, [refresh]);

  const logout = React.useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const openLoginSheet = React.useCallback((reason?: string) => {
    setLoginSheet({ open: true, reason });
  }, []);

  const closeLoginSheet = React.useCallback(() => {
    setLoginSheet(CLOSED_SHEET);
  }, []);

  // A successful in-LINE (LIFF) login resolves without navigation — dismiss the sheet.
  const sheetOpen = loginSheet.open;
  React.useEffect(() => {
    if (user && sheetOpen) setLoginSheet(CLOSED_SHEET);
  }, [user, sheetOpen]);

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, loading, login, logout, refresh, openLoginSheet, closeLoginSheet, loginSheet }),
    [user, loading, login, logout, refresh, openLoginSheet, closeLoginSheet, loginSheet],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginSheet open={loginSheet.open} reason={loginSheet.reason} onClose={closeLoginSheet} />
    </AuthContext.Provider>
  );
}
