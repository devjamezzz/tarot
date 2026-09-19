"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Video, type LucideIcon } from "lucide-react";
import { LINE_OA_URL } from "@/lib/site";

interface SocialLink {
  name: string;
  ariaLabel: string;
  url: string;
  icon: LucideIcon;
}

const socials: ReadonlyArray<SocialLink> = [
  {
    name: "Facebook",
    ariaLabel: "เฟซบุ๊ก ดูดวงกับเรฟ",
    url: "https://www.facebook.com/reffortune",
    icon: Facebook,
  },
  {
    name: "LINE",
    ariaLabel: "LINE Official Account @reffortune",
    url: LINE_OA_URL,
    icon: MessageCircle,
  },
  {
    name: "Instagram",
    ariaLabel: "อินสตาแกรม Refmade",
    url: "https://instagram.com/reffortune",
    icon: Instagram,
  },
  {
    name: "TikTok",
    ariaLabel: "ติ๊กต็อก Refmade",
    url: "https://tiktok.com/@reffortune",
    icon: Video,
  },
];

export function SocialFooter() {
  return (
    <footer className="px-5 pb-20 pt-8 text-center">
      <div className="mb-8 h-px w-full bg-line-faint" />

      <h3 className="mb-4 font-sans text-sm font-medium text-fg-muted">ติดตามเราได้ที่</h3>

      <div className="mb-6 flex justify-center gap-4">
        {socials.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.ariaLabel}
            className="flex items-center justify-center rounded-pill border border-line bg-surface p-3 text-gold transition-colors hover:bg-sunk active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <social.icon size={20} strokeWidth={1.5} />
          </Link>
        ))}
      </div>

      <div className="space-y-2 text-xs text-fg-subtle">
        <p>© 2026 REFFORTUNE</p>
        <div className="flex justify-center gap-3">
          <Link href="/terms" className="hover:text-fg-muted hover:underline">
            ข้อกำหนดการใช้งาน
          </Link>
          <span aria-hidden="true">•</span>
          <Link href="/privacy" className="hover:text-fg-muted hover:underline">
            นโยบายความเป็นส่วนตัว
          </Link>
        </div>
      </div>
    </footer>
  );
}
