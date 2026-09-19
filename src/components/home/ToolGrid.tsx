"use client";

import Link from "next/link";
import {
  CalendarDays,
  Compass,
  Flame,
  Ghost,
  Hash,
  Heart,
  HeartHandshake,
  ImageIcon,
  Layers,
  Moon,
  PenLine,
  ScrollText,
  Sparkles,
  Star,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useConfigStore, type FeatureToggles } from "@/store/useConfigStore";
import { cn } from "@/lib/cn";

export interface Tool {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  toggle?: keyof FeatureToggles;
}

/** Every divination tool, gated by the same feature toggles as the home page. */
export const TOOLS: Tool[] = [
  { href: "/tarot", label: "ไพ่ทาโรต์", desc: "ตั้งคำถาม เลือกไพ่ 1–10 ใบ", icon: Layers, toggle: "enableTarot" },
  { href: "/daily-card", label: "ไพ่ประจำวัน", desc: "เปิดไพ่ 1 ใบ รับข้อความประจำวัน", icon: CalendarDays, toggle: "enableDailyAuspicious" },
  { href: "/esiimsi", label: "เซียมซี", desc: "เขย่าติ้ว รับคำทำนายจากตำราโบราณ", icon: ScrollText },
  { href: "/love-tarot", label: "ดูดวงความรัก", desc: "เจาะลึกเรื่องหัวใจด้วยไพ่", icon: Heart, toggle: "enableLoveTarot" },
  { href: "/lucky-numbers", label: "ไพ่เลขมงคล", desc: "หยิบ 2 หรือ 4 ใบ รับเลขนำโชค", icon: Hash },
  { href: "/numerology", label: "เลขศาสตร์เบอร์โทร", desc: "วิเคราะห์พลังเบอร์โทรศัพท์", icon: Hash, toggle: "enableNumerology" },
  { href: "/spirit-card", label: "ไพ่จิตวิญญาณ", desc: "ค้นหาไพ่ประจำตัวของคุณ", icon: Sparkles, toggle: "enableSpiritCard" },
  { href: "/spirit-path", label: "เส้นทางจิตวิญญาณ", desc: "ไพ่ราศี + ไพ่จิตวิญญาณจากวันเกิด", icon: Ghost },
  { href: "/horoscope", label: "ดูดวงราศี", desc: "รายวัน รายสัปดาห์ รายเดือน", icon: Star },
  { href: "/astrology", label: "โหราศาสตร์ไทย", desc: "ฤกษ์ ปฏิทิน ลัคนา ทักษา", icon: Moon },
  { href: "/compatibility", label: "ความเข้ากัน", desc: "ดูดวงคู่รักและความสัมพันธ์", icon: HeartHandshake },
  { href: "/chinese-zodiac", label: "ดูดวงราศีจีน", desc: "12 นักษัตรและธาตุประจำปี", icon: Flame },
  { href: "/specialized", label: "ดูดวงเฉพาะด้าน", desc: "การงาน การเงิน หรือความรัก", icon: Target },
  { href: "/name-numerology", label: "เลขศาสตร์ชื่อ", desc: "วิเคราะห์ชื่อภาษาไทย", icon: PenLine },
  { href: "/wallpaper", label: "วอลเปเปอร์เสริมดวง", desc: "สร้างภาพมงคล วันละ 1 ครั้ง", icon: ImageIcon },
];

export function ToolGrid({ className }: { className?: string }) {
  const toggles = useConfigStore((state) => state.toggles);
  const tools = TOOLS.filter((tool) => !tool.toggle || toggles[tool.toggle]);

  return (
    <section aria-labelledby="explore-tools-title" className={cn(className)}>
      <div className="flex items-center gap-2">
        <Compass className="size-5 text-gold" strokeWidth={1.5} aria-hidden="true" />
        <h2 id="explore-tools-title" className="font-display text-[22px] font-semibold text-fg">
          ศาสตร์ทั้งหมด
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Card
                interactive
                className="flex h-full flex-col gap-2 animate-fade-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-pill border border-line bg-sunk text-gold">
                  <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-fg">{tool.label}</span>
                <span className="text-[13px] leading-relaxed text-fg-muted">{tool.desc}</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
