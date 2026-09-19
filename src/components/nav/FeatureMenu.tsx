"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Flame,
  Hash,
  Heart,
  Layers,
  Moon,
  PenLine,
  Sparkles,
  Star,
  Target,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";

interface FeatureItem {
  href: string;
  label: string;
  icon: LucideIcon;
  desc: string;
}

/** Feature menu items for all fortune-telling features */
const features: ReadonlyArray<FeatureItem> = [
  { href: "/tarot", label: "ไพ่ทาโรต์", icon: Layers, desc: "ดูดวงด้วยไพ่ทาโรต์" },
  { href: "/spirit-card", label: "ไพ่จิตวิญญาณ", icon: Sparkles, desc: "ค้นหาไพ่ประจำตัว" },
  { href: "/numerology", label: "เลขศาสตร์", icon: Hash, desc: "ดูดวงจากเบอร์โทร" },
  { href: "/daily-card", label: "ไพ่ประจำวัน", icon: CalendarDays, desc: "ดูดวงรายวัน" },
  { href: "/horoscope", label: "ดูดวงราศี", icon: Star, desc: "ดูดวงตามราศี" },
  { href: "/astrology", label: "โหราศาสตร์ไทย", icon: Moon, desc: "ดูฤกษ์ ปฏิทิน ลัคนา ทักษา" },
  { href: "/compatibility", label: "ดูดวงความรัก", icon: Heart, desc: "ดูความเข้ากันได้" },
  { href: "/chinese-zodiac", label: "ดูดวงจีน", icon: Flame, desc: "ดูดวง 12 นักษัตร" },
  { href: "/specialized", label: "ดูดวงเฉพาะด้าน", icon: Target, desc: "ดูดวงเจาะลึก" },
  { href: "/name-numerology", label: "เลขศาสตร์ชื่อ", icon: PenLine, desc: "ดูดวงจากชื่อ" },
];

export interface FeatureMenuProps {
  className?: string;
  title?: string;
  showTitle?: boolean;
}

/**
 * Navigation grid linking to every divination feature. Used on feature pages
 * so people can hop between methods.
 *
 * @example
 * <FeatureMenu title="ลองดูดวงแบบอื่น" />
 */
export function FeatureMenu({
  className,
  title = "ลองดูดวงแบบอื่น",
  showTitle = true,
}: FeatureMenuProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {showTitle && (
        <h2 className="px-1 font-display text-lg font-semibold text-fg">{title}</h2>
      )}

      <div className="grid grid-cols-2 gap-3">
        {features.map((feature) => {
          const active = isActive(feature.href);
          const Icon = feature.icon;

          return (
            <Link
              key={feature.href}
              href={feature.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-card transition-transform active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                active && "pointer-events-none"
              )}
            >
              <Card
                className={cn(
                  "h-full p-4 transition-colors",
                  active ? "border-gold bg-gold-soft" : "hover:bg-sunk"
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        active ? "text-gold" : "text-fg"
                      )}
                    >
                      {feature.label}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-fg-muted">{feature.desc}</p>
                  {active && (
                    <div className="flex items-center gap-1 text-xs text-gold">
                      <span aria-hidden="true">•</span>
                      <span>กำลังดูอยู่</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
