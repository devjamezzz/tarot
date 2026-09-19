"use client";

import React, { useEffect } from "react";

/**
 * REFFORTUNE ships a single dark purple + gold theme. The provider is a no-op
 * kept for API compatibility: `theme` is always "dark" and the setters do
 * nothing. Legacy theme names stay in the union so untouched callers compile.
 */
export type Theme = "dark" | "light" | "pastel" | "rainbow" | "soft";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const STALE_THEME_KEY = "reffortune-theme";

const DARK_THEME: ThemeContextType = {
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      localStorage.removeItem(STALE_THEME_KEY);
    } catch {
      // storage unavailable — nothing to clean up
    }
  }, []);

  return <>{children}</>;
}

export function useTheme(): ThemeContextType {
  return DARK_THEME;
}
