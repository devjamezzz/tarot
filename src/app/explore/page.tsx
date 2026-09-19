"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, ChevronRight, Hash, Layers, type LucideIcon } from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ConsultTeaser } from "@/components/home/ConsultTeaser";
import { ToolGrid } from "@/components/home/ToolGrid";
import { buildTarotStartHref } from "@/components/home/tarotStartHref";
import { EXAMPLE_QUESTIONS, MAX_QUESTION_LENGTH } from "@/lib/tarot/spreads";
import { useConfigStore, type FeatureToggles } from "@/store/useConfigStore";

interface Popular {
  href: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  toggle?: keyof FeatureToggles;
}

const POPULAR: Popular[] = [
  { href: "/tarot", title: "ไพ่ทาโรต์ 3 ใบ", desc: "อดีต · ปัจจุบัน · อนาคต", icon: Layers, toggle: "enableTarot" },
  { href: "/daily-card", title: "ไพ่ประจำวัน", desc: "พลังงานวันนี้ของคุณ", icon: CalendarDays, toggle: "enableDailyAuspicious" },
  { href: "/numerology", title: "วิเคราะห์เบอร์มงคล", desc: "เลขศาสตร์เบอร์โทร", icon: Hash, toggle: "enableNumerology" },
];

function ExploreSearch() {
  const router = useRouter();
  const tarotEnabled = useConfigStore((state) => state.toggles.enableTarot);
  const [question, setQuestion] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!tarotEnabled) return;
    router.push(buildTarotStartHref({ question }));
  };

  return (
    <form onSubmit={submit} className="relative">
      <label htmlFor="explore-question" className="sr-only">
        คำถามของคุณ
      </label>
      <Input
        id="explore-question"
        data-testid="explore-question"
        name="question"
        type="text"
        autoComplete="off"
        maxLength={MAX_QUESTION_LENGTH}
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder={`พิมพ์คำถามให้ไพ่ตอบ เช่น ${EXAMPLE_QUESTIONS.general[0]}`}
        disabled={!tarotEnabled}
        className="h-14 rounded-pill pl-5 pr-16 text-base"
      />
      <Button
        type="submit"
        variant="gold"
        size="icon"
        aria-label="เริ่มเปิดไพ่"
        disabled={!tarotEnabled}
        className="absolute right-1.5 top-1/2 -translate-y-1/2"
      >
        <ArrowRight className="size-5" strokeWidth={2} />
      </Button>
    </form>
  );
}

function PopularList() {
  const toggles = useConfigStore((state) => state.toggles);
  const items = POPULAR.filter((item) => !item.toggle || toggles[item.toggle]);

  return (
    <section aria-labelledby="explore-popular-title">
      <SectionHeader label="คนถามบ่อย" title={<span id="explore-popular-title">ยอดนิยม</span>} />
      <div className="mt-4 grid gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Card interactive className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-line bg-sunk text-gold">
                  <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-semibold text-fg">{item.title}</span>
                  <span className="block text-[13px] text-fg-muted">{item.desc}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** Rail: popular picks + fortune-teller teaser; sticky on md+, stacked after the grid on mobile. */
function ExploreAside() {
  return (
    <div className="md:sticky md:top-6">
      <PopularList />
      <ConsultTeaser className="mt-6" />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <main className="min-h-screen">
      <PageContainer variant="wide" aside={<ExploreAside />}>
        <AppBar
          className="px-0"
          label="สำรวจ"
          title="สำรวจศาสตร์ทั้งหมด"
          caption="เลือกศาสตร์ที่คุณสนใจ หรือพิมพ์คำถามแล้วให้ไพ่ตอบ"
          largeTitle
        />
        <ExploreSearch />
        <ToolGrid className="mt-8" />
      </PageContainer>
    </main>
  );
}
