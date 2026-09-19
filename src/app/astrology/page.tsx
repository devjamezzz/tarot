import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Car,
  Clock,
  Compass,
  Hash,
  HeartHandshake,
  House,
  Layers,
  Moon,
  Orbit,
  PenLine,
  Sparkle,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  Telescope,
  Triangle,
  type LucideIcon,
} from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FAB } from "@/components/ui/FAB";

export const metadata: Metadata = {
  title: "โหราศาสตร์ไทย — ดูดวง ดูฤกษ์ ปฏิทินโหราศาสตร์ ทักษา ลัคนา",
  description:
    "ศูนย์รวมเมนูโหราศาสตร์ไทย ดูดวง 2569 ดูฤกษ์ยาม ปฏิทินโหราศาสตร์ไทย สุริยยาตร์/นิรายนะวิธี ลัคนา ทักษา ตรีวัย ดาวเกษตร และดาราศาสตร์",
  alternates: { canonical: "/astrology" },
  openGraph: {
    title: "โหราศาสตร์ไทย — REFFORTUNE",
    description:
      "ศูนย์รวมเมนูโหราศาสตร์ไทย ดูดวง ดูฤกษ์ ปฏิทินโหราศาสตร์ และเครื่องมือคำนวณดวงชะตา",
    url: "/astrology",
  },
};

type AstrologyItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  comingSoon?: boolean;
};

type AstrologySection = {
  heading: string;
  subheading: string;
  items: AstrologyItem[];
};

const sections: AstrologySection[] = [
  {
    heading: "ดูดวง",
    subheading: "พยากรณ์ดวงชะตาด้วยศาสตร์โหราศาสตร์ไทยและไพ่",
    items: [
      { title: "ดูดวง 2569", description: "ดวงชะตารายปี เห็นจังหวะชีวิตล่วงหน้า", icon: Sparkles, href: "/horoscope" },
      { title: "ดูดวงรายวัน", description: "พลังงานและจังหวะของวันนี้", icon: CalendarDays, href: "/horoscope/daily" },
      { title: "ดูดวงรายสัปดาห์", description: "ทิศทางสัปดาห์นี้ของคุณ", icon: CalendarRange, href: "/horoscope/weekly" },
      { title: "ดูดวงรายเดือน", description: "ภาพรวมและแนวโน้มรายเดือน", icon: Calendar, href: "/horoscope/monthly" },
      { title: "หมอดูไพ่ทาโรต์", description: "เปิดไพ่หาคำตอบเรื่องที่ค้างคาใจ", icon: Layers, href: "/tarot" },
      { title: "ไพ่ประจำวัน", description: "ไพ่ใบเดียวสำหรับวันนี้", icon: Sun, href: "/daily-card" },
    ],
  },
  {
    heading: "ดูฤกษ์",
    subheading: "เลือกวันเวลามงคลสำหรับเรื่องสำคัญในชีวิต",
    items: [
      { title: "ฤกษ์มงคลทั่วไป", description: "วันดี เวลาดี ตามหลักโหราศาสตร์ไทย", icon: Clock, href: "/astrology/auspicious", comingSoon: true },
      { title: "ฤกษ์แต่งงาน", description: "เลือกวันแต่งให้ชีวิตคู่ราบรื่น", icon: HeartHandshake, href: "/astrology/auspicious/wedding", comingSoon: true },
      { title: "ฤกษ์ขึ้นบ้านใหม่", description: "วันดีสำหรับเริ่มต้นชีวิตในบ้านหลังใหม่", icon: House, href: "/astrology/auspicious/housewarming", comingSoon: true },
      { title: "ฤกษ์ออกรถ", description: "วันดีสำหรับการรับรถใหม่", icon: Car, href: "/astrology/auspicious/car", comingSoon: true },
    ],
  },
  {
    heading: "ปฏิทินโหราศาสตร์ไทย",
    subheading: "ปฏิทินดวงดาวสำหรับการคำนวณดวงชะตา",
    items: [
      { title: "ปฏิทินสุริยยาตร์", description: "ปฏิทินโหราศาสตร์ไทยแบบสุริยยาตร์", icon: Sunrise, href: "/astrology/calendar/surya", comingSoon: true },
      { title: "ปฏิทินนิรายนะวิธี", description: "ปฏิทินโหราศาสตร์ไทยแบบนิรายนะ", icon: Moon, href: "/astrology/calendar/nirayana", comingSoon: true },
      { title: "ดาราศาสตร์", description: "ตำแหน่งดาวและปรากฏการณ์ท้องฟ้า", icon: Telescope, href: "/astrology/astronomy", comingSoon: true },
    ],
  },
  {
    heading: "เครื่องมือคำนวณดวงชะตา",
    subheading: "วางลัคนา คำนวณทักษา และวิเคราะห์ดาวประจำตัว",
    items: [
      { title: "จักรราศีวิภาค", description: "ผังดวงชะตาแบบไทย สุริยยาตร์ / นิรายนะ", icon: Orbit, href: "/astrology/chart" },
      { title: "ลัคนา", description: "คำนวณลัคนาราศีจากวันเวลาเกิด", icon: Compass, href: "/astrology/chart" },
      { title: "ทักษา", description: "ดาวประจำวันเกิดและช่วงอายุ", icon: Star, href: "/astrology/taksa", comingSoon: true },
      { title: "ตรีวัย", description: "วิเคราะห์ชีวิตสามช่วงวัย", icon: Triangle, href: "/astrology/triwai", comingSoon: true },
      { title: "ดาวเกษตร", description: "ดาวประจำราศีและความสัมพันธ์", icon: Sparkle, href: "/astrology/dao-kaset", comingSoon: true },
      { title: "เลข 7 ตัว", description: "ดวงเลข 7 ตัวจากวันเดือนปีเกิด", icon: Hash, href: "/numerology" },
      { title: "เลขศาสตร์ชื่อ", description: "วิเคราะห์ชื่อภาษาไทยตามเลขศาสตร์", icon: PenLine, href: "/name-numerology" },
    ],
  },
];

function HubCard({ item }: { item: AstrologyItem }) {
  const Icon = item.icon;
  const body = (
    <Card interactive={!item.comingSoon} className="h-full">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card border border-line-faint bg-gold-soft">
          <Icon className="size-5 text-gold" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-display text-base font-semibold leading-snug text-fg">{item.title}</h3>
            {item.comingSoon ? (
              <span className="rounded-pill border border-line-faint bg-sunk px-2 py-0.5 text-[13px] text-fg-subtle">
                เร็ว ๆ นี้
              </span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-fg-muted">{item.description}</p>
        </div>
      </div>
    </Card>
  );

  if (item.comingSoon) {
    return (
      <div aria-disabled="true" className="opacity-60">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {body}
    </Link>
  );
}

export default function AstrologyHubPage() {
  return (
    <PageContainer variant="wide">
      <AppBar
        label="โหราศาสตร์"
        title="โหราศาสตร์ไทย"
        caption="ศูนย์รวมเมนูโหราศาสตร์ไทย ดูดวง ดูฤกษ์ ปฏิทินโหราศาสตร์ และเครื่องมือคำนวณดวงชะตา"
        backHref="/explore"
        largeTitle
      />

      <div className="mt-2 space-y-8">
        {sections.map((section) => (
          <section key={section.heading} aria-label={section.heading}>
            <SectionHeader title={section.heading} label={section.subheading} className="mb-3" />
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {section.items.map((item) => (
                <HubCard key={`${section.heading}-${item.title}`} item={item} />
              ))}
            </div>
          </section>
        ))}

        <FeatureMenu title="ลองดูดวงแบบอื่น" />
      </div>

      <FAB label="เพิ่มเพื่อน LINE" />
    </PageContainer>
  );
}
