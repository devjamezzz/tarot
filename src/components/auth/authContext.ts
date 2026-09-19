"use client";

import * as React from "react";

export interface AuthUser {
  id: string;
  displayName: string | null;
  pictureUrl: string | null;
  statusMessage?: string | null;
  credits: number;
  membershipTier: string;
  isAdmin: boolean;
}

export interface LoginSheetState {
  open: boolean;
  /** One-line reason shown under the sheet title (e.g. "เพื่อบันทึกไพ่ข้ามเครื่อง"). */
  reason?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  /** Opens the LINE login bottom sheet; the optional reason is shown under the title. */
  openLoginSheet: (reason?: string) => void;
  closeLoginSheet: () => void;
  loginSheet: LoginSheetState;
}

export const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

/** Convenience hook for callers that only need to open/close the login sheet. */
export function useLoginSheet() {
  const { loginSheet, openLoginSheet, closeLoginSheet } = useAuth();
  return { ...loginSheet, openLoginSheet, closeLoginSheet };
}
