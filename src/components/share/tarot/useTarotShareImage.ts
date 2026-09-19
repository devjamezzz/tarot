"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { lineMessageUrl } from "@/lib/site";
import { SHARE_BG } from "./shareStyles";

export const SHARE_ERROR_TEXT = "สร้างรูปไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
export const SHARE_TITLE = "ไพ่ของคุณ — REFFORTUNE";

export type ShareBusy = "download" | "share" | null;

export interface UseTarotShareImageOptions {
  /** Text sent with the image (navigator.share) or as the LINE fallback message. */
  text: string;
  /** Called after an image was produced or handed to the LINE fallback. */
  onGenerated?: () => void;
}

function makeFileName(): string {
  return `reffortune-tarot-${Date.now()}.png`;
}

async function waitForFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await document.fonts.ready;
  } catch {
    // Font readiness is best-effort; the capture still works with fallbacks.
  }
}

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], fileName, { type: "image/png" });
}

/** True when the browser can hand a PNG file to the OS share sheet. */
function canShareFiles(): boolean {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") return false;
  if (typeof navigator.canShare !== "function") return false;
  try {
    const probe = new File([new Uint8Array(1)], "probe.png", { type: "image/png" });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/**
 * Rasterises the off-screen `TarotShareTemplate` (attach `templateRef`) with
 * html-to-image. `download` saves the PNG; `share` opens the OS share sheet
 * with the file, or LINE's text share when files cannot be shared.
 */
export function useTarotShareImage({ text, onGenerated }: UseTarotShareImageOptions) {
  const templateRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  const [busy, setBusy] = useState<ShareBusy>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const render = useCallback(async (): Promise<string> => {
    const node = templateRef.current;
    if (!node) throw new Error("share template is not mounted");
    await waitForFonts();
    return toPng(node, { pixelRatio: 2, backgroundColor: SHARE_BG, cacheBust: true });
  }, []);

  const download = useCallback(async () => {
    if (busy) return;
    setBusy("download");
    setError(null);
    try {
      const dataUrl = await render();
      const link = document.createElement("a");
      link.download = makeFileName();
      link.href = dataUrl;
      link.rel = "noopener";
      link.click();
      onGenerated?.();
    } catch (err) {
      console.error("[share] tarot image download failed", err);
      if (mounted.current) setError(SHARE_ERROR_TEXT);
    } finally {
      if (mounted.current) setBusy(null);
    }
  }, [busy, onGenerated, render]);

  const share = useCallback(async () => {
    if (busy) return;

    // No file sharing (desktop, some in-app browsers): open LINE synchronously
    // inside the click so popup blockers do not interfere.
    if (!canShareFiles()) {
      window.open(lineMessageUrl(text), "_blank", "noopener,noreferrer");
      onGenerated?.();
      return;
    }

    setBusy("share");
    setError(null);
    try {
      const dataUrl = await render();
      const file = await dataUrlToFile(dataUrl, makeFileName());
      await navigator.share({ title: SHARE_TITLE, text, files: [file] });
      onGenerated?.();
    } catch (err) {
      // The user closed the share sheet — not an error worth surfacing.
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("[share] tarot image share failed", err);
      if (mounted.current) setError(SHARE_ERROR_TEXT);
    } finally {
      if (mounted.current) setBusy(null);
    }
  }, [busy, onGenerated, render, text]);

  return { templateRef, busy, error, download, share };
}
