import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  CalendarRange,
  ChevronRight,
  Clock,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { Card } from "@/components/ui/Card";
import { FAB } from "@/components/ui/FAB";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { PageContainer } from "@/components/ui/PageContainer";

export const metadata: Metadata = {
  title: "ดูดวงรายวัน รายสัปดาห์ รายเดือน — ดวงชะตาตามราศี",
  description:
    "ดูดวงตามราศีออนไลน์ เลือกดูดวงรายวัน รายสัปดาห์ หรือรายเดือน รับคำทำนายแม่นยำ ใช้ได้จริง",
  alternates: { canonical: "/horoscope" },
  openGraph: {
    title: "ดูดวงตามราศี — REFFORTUNE",
    description: "เลือกช่วงเวลาที่เหมาะกับคุณ ดูดวงรายวัน รายสัปดาห์ หรือรายเดือน",
    url: "/horoscope",
  },
};

type PeriodCard = {
  period: "daily" | "weekly" | "monthly";
  title: string;
  description: string;
  eta: string;
  icon: LucideIcon;
};

const periods: ReadonlyArray<PeriodCard> = [
  {
    period: "daily",
    title: "ดูดวงรายวัน",
    description: "ดูดวงวันนี้ โฟกัสพลังงานและโอกาสในแต่ละวัน",
    eta: "อ่านจบใน 2 นาที",
    icon: Sun,
  },
  {
    period: "weekly",
    title: "ดูดวงรายสัปดาห์",
    description: "ดูดวงสัปดาห์นี้ วางแผนและเตรียมตัวล่วงหน้า",
    eta: "อ่านจบใน 3 นาที",
    icon: CalendarRange,
  },
  {
    period: "monthly",
    title: "ดูดวงรายเดือน",
    description: "ดูดวงเดือนนี้ เห็นภาพรวมและแนวโน้มระยะยาว",
    eta: "อ่านจบใน 5 นาที",
    icon: CalendarDays,
  },
];

const LINE_LABEL = "เพิ่มเพื่อน LINE";

export default function HoroscopePage() {
  return (
    <>
      <PageContainer
        variant="wide"
        aside={
          /* md+: pad the rail so its heading starts level with the AppBar eyebrow (pt-6)
             instead of at y=0, where the Thai tone marks clip against the viewport top. */
          <div className="md:pt-6">
            <FeatureMenu />
            {/* <md: the LINE CTA sits in the flow after the grid so nothing floats over a card. */}
            <div className="mt-6 md:hidden" data-testid="horoscope-line-inline">
              <p className="mb-3 text-center text-[13px] leading-relaxed text-fg-muted">
                มีคำถามเพิ่มเติม? คุยกับหมอดูได้โดยตรงทาง LINE
              </p>
              <LineCtaButton label={LINE_LABEL} />
            </div>
          </div>
        }
      >
        <AppBar
          label="โหราศาสตร์ราศี"
          title="ดูดวงตามราศี"
          caption="เลือกช่วงเวลาที่ต้องการ แล้วเลือกราศีของคุณในขั้นถัดไป"
          largeTitle
        />

        <div className="mt-4 flex flex-col gap-3" data-testid="horoscope-periods">
          {periods.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.period}
                href={`/horoscope/${item.period}`}
                className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <Card interactive className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card border border-line-faint bg-sunk">
                    <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold text-fg">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-fg-muted">{item.description}</span>
                    <span className="mt-2 flex items-center gap-1.5 text-[13px] text-fg-muted">
                      <Clock className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} aria-hidden="true" />
                      {item.eta}
                    </span>
                  </span>
                  <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                </Card>
              </Link>
            );
          })}
        </div>
      </PageContainer>

      {/* md+: floating button only where it clears the two-column layout. */}
      <FAB label={LINE_LABEL} className="hidden md:flex" />
    </>
  );
}
