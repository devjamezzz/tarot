"use client";

import * as React from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { LineLoginButton, LoginConsentNote } from "./LineLoginButton";

export interface LoginSheetProps {
  open: boolean;
  onClose: () => void;
  /** One-line reason shown under the title, e.g. "เพื่อบันทึกไพ่ข้ามเครื่อง". */
  reason?: string;
}

/**
 * LINE-first login bottom sheet (brief §2.7). Rendered once inside
 * AuthProvider; open it from anywhere with useAuth().openLoginSheet(reason).
 */
export function LoginSheet({ open, onClose, reason }: LoginSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="เข้าสู่ระบบเพื่อดำเนินการต่อ">
      <div data-testid="login-sheet" className="space-y-4">
        {reason ? <p className="text-sm text-fg-muted">{reason}</p> : null}
        <LineLoginButton />
        <LoginConsentNote />
      </div>
    </BottomSheet>
  );
}
