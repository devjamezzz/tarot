"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Home, Compass, Sparkles, Settings, Bookmark } from "lucide-react";

const bottomTabs = [
  { label: "หน้าแรก", href: "/", icon: Home },
  { label: "สำรวจ", href: "/explore", icon: Compass },
  { label: "ดูดวง", href: "/tarot", icon: Sparkles },
  { label: "บันทึก", href: "/library/saved", icon: Bookmark },
  { label: "ตั้งค่า", href: "/settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="เมนูหลัก"
      className="fixed bottom-0 left-0 right-0 z-[9999] w-full border-t border-line-faint bg-surface/95 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex h-14 max-w-lg items-stretch justify-between gap-1 px-2">
        {bottomTabs.map((tab) => {
          const active = isActive(pathname, tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-card px-1",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset",
                active ? "text-gold" : "text-fg-muted hover:text-fg"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 h-1 w-1 rounded-pill bg-gold"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
