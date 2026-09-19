"use client";

import * as React from "react";
import { Download, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { TarotShareData } from "../types";
import { buildTarotShareText } from "./shareText";
import { TarotShareTemplate, type TarotShareFormat } from "./TarotShareTemplate";
import { useTarotShareImage } from "./useTarotShareImage";

export interface TarotShareableCardProps {
  data: TarotShareData;
  /** Fired after an image was produced (download / share) — used for analytics. */
  onShare?: () => void;
  className?: string;
  /** Extra buttons rendered in the same secondary row (e.g. "บันทึกลงคลัง"). */
  extraActions?: React.ReactNode;
  format?: TarotShareFormat;
}

/** Shared sizing for every button in the secondary row. */
export const SHARE_ACTION_CLASS = "min-w-0 px-3 text-sm";

/**
 * Secondary share actions ("บันทึกรูป" · "แชร์") plus the off-screen share
 * template they rasterise. Nothing card-like is visible on the page — the
 * result page shows the cards exactly once.
 */
export function TarotShareableCard({
  data,
  onShare,
  className,
  extraActions,
  format = "portrait",
}: TarotShareableCardProps) {
  const text = React.useMemo(() => buildTarotShareText(data), [data]);
  const { templateRef, busy, error, download, share } = useTarotShareImage({
    text,
    onGenerated: onShare,
  });

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className={SHARE_ACTION_CLASS}
          onClick={download}
          disabled={busy !== null}
          aria-busy={busy === "download"}
          data-testid="share-download"
        >
          {busy === "download" ? (
            <Loader2 className="animate-spin text-gold" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Download className="text-gold" strokeWidth={1.5} aria-hidden="true" />
          )}
          {busy === "download" ? "กำลังสร้างรูป…" : "บันทึกรูป"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="lg"
          className={SHARE_ACTION_CLASS}
          onClick={share}
          disabled={busy !== null}
          aria-busy={busy === "share"}
          data-testid="share-native"
        >
          {busy === "share" ? (
            <Loader2 className="animate-spin text-gold" strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Share2 className="text-gold" strokeWidth={1.5} aria-hidden="true" />
          )}
          {busy === "share" ? "กำลังสร้างรูป…" : "แชร์"}
        </Button>

        {extraActions}
      </div>

      {error ? (
        <p role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : null}

      <TarotShareTemplate ref={templateRef} data={data} format={format} />
    </div>
  );
}
