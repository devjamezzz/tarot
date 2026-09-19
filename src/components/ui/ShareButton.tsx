"use client";

import * as React from "react";
import { Check, Share2 } from "lucide-react";
import { Button, ButtonProps } from "./Button";

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface ShareButtonProps extends ButtonProps {
  shareData: ShareData;
  onShareSuccess?: () => void;
}

export function ShareButton({ shareData, onShareSuccess, children, ...props }: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    // 1. Web Share API (mobile / modern browsers)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
        onShareSuccess?.();
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard copy
      }
    }

    // 2. Fallback: copy to clipboard
    try {
      const fullText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShareSuccess?.();
    } catch {
      // Clipboard unavailable (insecure context / permissions) — nothing else to try
    }
  };

  return (
    <Button onClick={handleShare} {...props}>
      {copied ? (
        <span className="flex items-center gap-1.5">
          <Check className="size-4" strokeWidth={2.5} />
          คัดลอกลิงก์แล้ว
        </span>
      ) : (
        children || (
          <span className="flex items-center gap-1.5">
            <Share2 className="size-4" strokeWidth={1.5} />
            แชร์
          </span>
        )
      )}
    </Button>
  );
}
