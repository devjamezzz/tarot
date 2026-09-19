// Fortune Reading Blocks Component
// Displays structured fortune readings for all new reading types
// Feature: popular-fortune-features
//
// NOTE: no hooks in this file — FortuneReadingBlocks.test.tsx calls the
// component as a plain function.

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Clover,
  Coins,
  Compass,
  Drama,
  Dumbbell,
  Footprints,
  Heart,
  HeartHandshake,
  HeartPulse,
  Lightbulb,
  ListChecks,
  MessageCircle,
  Palette,
  Sparkles,
  Star,
  TriangleAlert,
} from "lucide-react";
import type { HoroscopeReading } from "@/lib/horoscope/types";
import type { CompatibilityReading } from "@/lib/compatibility/types";
import type { ChineseZodiacReading } from "@/lib/chinese-zodiac/types";
import type { NameNumerologyReading } from "@/lib/name-numerology/types";
import type { SpecializedReading } from "@/lib/horoscope/specialized";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatThaiDate } from "@/lib/format/thaiDate";

// Union type for all fortune reading types
type FortuneReading =
  | { type: 'horoscope'; data: HoroscopeReading }
  | { type: 'compatibility'; data: CompatibilityReading }
  | { type: 'chinese_zodiac'; data: ChineseZodiacReading }
  | { type: 'name_numerology'; data: NameNumerologyReading }
  | { type: 'specialized'; data: SpecializedReading };

interface FortuneReadingBlocksProps {
  reading: FortuneReading;
  onViewAnother?: () => void;
  onShare?: () => void;
  onReturnToMenu?: () => void;
}

type Tone = "default" | "positive" | "caution";

const TONE_CLASS: Record<Tone, string> = {
  default: "border-line bg-surface",
  positive: "border-gold bg-gold-soft",
  caution: "border-warning/40 bg-warning/10",
};

/**
 * Format date range for display (Buddhist year, Thai short months)
 */
function formatDateRange(start: Date, end: Date): string {
  const startStr = formatThaiDate(start);
  const endStr = formatThaiDate(end);
  return startStr === endStr ? startStr : `${startStr} - ${endStr}`;
}

function Block({
  icon: Icon,
  title,
  tone = "default",
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={cn("rounded-card border p-5 shadow-card", TONE_CLASS[tone], className)}>
      <h3 className="flex items-center gap-2 font-display text-lg text-fg">
        <Icon className="size-5 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
        {title}
      </h3>
      {children}
    </article>
  );
}

function TextBlock({ text, ...rest }: { text: string } & Omit<Parameters<typeof Block>[0], "children">) {
  return (
    <Block {...rest}>
      <p className="mt-2 whitespace-pre-line text-base leading-[1.65] text-fg">{text}</p>
    </Block>
  );
}

function ListBlock({ items, ...rest }: { items: string[] } & Omit<Parameters<typeof Block>[0], "children">) {
  return (
    <Block {...rest}>
      <ul className="mt-2 space-y-1 text-base leading-[1.65] text-fg">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-gold" aria-hidden="true">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: ReactNode; highlight?: boolean }) {
  return (
    <div className={cn("rounded-card border p-3 text-center", highlight ? "border-gold bg-gold-soft" : "border-line bg-sunk")}>
      <p className="text-[13px] text-fg-muted">{label}</p>
      <p className="font-display text-2xl text-fg tabular-nums">{value}</p>
    </div>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="text-[13px] text-fg-muted">{children}</p>;
}

/**
 * Render horoscope reading
 */
function HoroscopeBlocks({ data }: { data: HoroscopeReading }) {
  const isAIEnhanced = data.confidence > 50;

  return (
    <>
      <div className="mb-4 text-center">
        <Caption>{formatDateRange(data.dateRange.start, data.dateRange.end)}</Caption>
      </div>

      {isAIEnhanced && (
        <div className="mb-4 flex items-center gap-2 rounded-card border border-gold bg-gold-soft p-3">
          <Sparkles className="size-4 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-[13px] text-gold">
            การตีความนี้ได้รับการปรับปรุงด้วย AI เพื่อความเฉพาะเจาะจงมากขึ้น
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <TextBlock icon={Heart} title="ความรัก" text={data.aspects.love} />
        <TextBlock icon={Briefcase} title="การงาน" text={data.aspects.career} />
        <TextBlock icon={Coins} title="การเงิน" text={data.aspects.finance} />
        <TextBlock icon={HeartPulse} title="สุขภาพ" text={data.aspects.health} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextBlock icon={Clover} title="เลขนำโชค" text={data.luckyNumbers.join(', ')} />
        <TextBlock icon={Palette} title="สีนำโชค" text={data.luckyColors.join(', ')} />
      </div>

      <TextBlock className="mt-4" icon={Lightbulb} title="คำแนะนำ" tone="positive" text={data.advice} />
    </>
  );
}

/**
 * Render compatibility reading
 */
function CompatibilityBlocks({ data }: { data: CompatibilityReading }) {
  return (
    <>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full border-4 border-gold bg-gold-soft">
          <span className="font-display text-3xl text-fg tabular-nums">{data.overallScore}</span>
        </div>
        <Caption>{data.elementCompatibility}</Caption>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Stat label="การสื่อสาร" value={`${data.scores.communication}%`} />
        <Stat label="ความเชื่อมโยงทางอารมณ์" value={`${data.scores.emotional}%`} />
        <Stat label="ศักยภาพระยะยาว" value={`${data.scores.longTerm}%`} />
        <Stat label="คะแนนรวม" value={`${data.scores.overall}%`} highlight />
      </div>

      <ListBlock className="mt-4" icon={Dumbbell} title="จุดแข็ง" tone="positive" items={data.strengths} />
      <ListBlock className="mt-4" icon={TriangleAlert} title="ความท้าทาย" tone="caution" items={data.challenges} />
      <TextBlock className="mt-4" icon={Lightbulb} title="คำแนะนำ" text={data.advice} />
    </>
  );
}

/**
 * Render Chinese zodiac reading
 */
function ChineseZodiacBlocks({ data }: { data: ChineseZodiacReading }) {
  return (
    <>
      <div className="mb-4 text-center">
        <h2 className="font-display text-[22px] leading-tight text-fg">{data.thaiName}</h2>
        <Caption>{data.chineseName}</Caption>
        <Caption>{formatDateRange(data.dateRange.start, data.dateRange.end)}</Caption>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextBlock icon={Star} title="โชคลาภโดยรวม" text={data.fortune.overall} />
        <TextBlock icon={Briefcase} title="การงาน" text={data.fortune.career} />
        <TextBlock icon={Coins} title="ความมั่งคั่ง" text={data.fortune.wealth} />
        <TextBlock icon={HeartPulse} title="สุขภาพ" text={data.fortune.health} />
        <TextBlock icon={HeartHandshake} title="ความสัมพันธ์" text={data.fortune.relationships} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <TextBlock icon={Palette} title="สีนำโชค" text={data.luckyColors.join(', ')} />
        <TextBlock icon={Clover} title="เลขนำโชค" text={data.luckyNumbers.join(', ')} />
        <TextBlock icon={Compass} title="ทิศนำโชค" text={data.luckyDirections.join(', ')} />
      </div>

      <TextBlock className="mt-4" icon={Lightbulb} title="คำแนะนำ" tone="positive" text={data.advice} />
    </>
  );
}

/**
 * Render name numerology reading
 */
function NameNumerologyBlocks({ data }: { data: NameNumerologyReading }) {
  return (
    <>
      <div className="mb-4 text-center">
        <h2 className="font-display text-[22px] leading-tight text-fg">
          {data.firstName} {data.lastName}
        </h2>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <Stat label="ชื่อ" value={data.scores.firstName} />
          <Stat label="นามสกุล" value={data.scores.lastName} />
          <Stat label="ชื่อเต็ม" value={data.scores.fullName} />
          <Stat label="เลขชะตา" value={data.scores.destiny} highlight />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextBlock icon={Drama} title="บุคลิกภาพ" text={data.interpretation.personality} />
        <ListBlock icon={Dumbbell} title="จุดแข็ง" tone="positive" items={data.interpretation.strengths} />
        <ListBlock icon={TriangleAlert} title="จุดอ่อน" tone="caution" items={data.interpretation.weaknesses} />
        <TextBlock icon={Footprints} title="เส้นทางชีวิต" text={data.interpretation.lifePath} />
        <TextBlock icon={Briefcase} title="การงาน" text={data.interpretation.career} />
        <TextBlock icon={HeartHandshake} title="ความสัมพันธ์" text={data.interpretation.relationships} />
      </div>

      <TextBlock className="mt-4" icon={Clover} title="เลขนำโชค" text={data.luckyNumbers.join(', ')} />
      <TextBlock className="mt-4" icon={Lightbulb} title="คำแนะนำ" tone="positive" text={data.advice} />
    </>
  );
}

/**
 * Render specialized reading
 */
function SpecializedBlocks({ data }: { data: SpecializedReading }) {
  return (
    <>
      <div className="mb-4 text-center">
        <Caption>{formatDateRange(data.dateRange.start, data.dateRange.end)}</Caption>
      </div>

      <TextBlock className="mb-4" icon={Sparkles} title="คำทำนาย" text={data.prediction} />

      <div className="grid gap-4 md:grid-cols-2">
        <ListBlock icon={Star} title="โอกาส" tone="positive" items={data.opportunities} />
        <ListBlock icon={TriangleAlert} title="ความท้าทาย" tone="caution" items={data.challenges} />
      </div>

      <ListBlock className="mt-4" icon={ListChecks} title="สิ่งที่ควรทำ" items={data.actionItems} />
      <TextBlock className="mt-4" icon={Lightbulb} title="คำแนะนำ" tone="positive" text={data.advice} />
    </>
  );
}

/**
 * Main FortuneReadingBlocks component
 *
 * Displays structured fortune readings with appropriate formatting
 * for each reading type. Shows confidence indicators for AI-enhanced
 * content and provides post-reading action buttons.
 */
export function FortuneReadingBlocks({
  reading,
  onViewAnother,
  onShare,
  onReturnToMenu
}: FortuneReadingBlocksProps) {
  return (
    <div className="w-full">
      {/* Reading Content */}
      <section className="mt-6">
        {reading.type === 'horoscope' && <HoroscopeBlocks data={reading.data} />}
        {reading.type === 'compatibility' && <CompatibilityBlocks data={reading.data} />}
        {reading.type === 'chinese_zodiac' && <ChineseZodiacBlocks data={reading.data} />}
        {reading.type === 'name_numerology' && <NameNumerologyBlocks data={reading.data} />}
        {reading.type === 'specialized' && <SpecializedBlocks data={reading.data} />}
      </section>

      {/* Post-Reading Actions */}
      <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {onViewAnother && (
          <Button onClick={onViewAnother} variant="default">
            ดูดวงอีกครั้ง
          </Button>
        )}
        {onShare && (
          <Button onClick={onShare} variant="outline">
            <MessageCircle strokeWidth={1.5} aria-hidden="true" />
            แชร์ผลการดูดวง
          </Button>
        )}
        {onReturnToMenu && (
          <Button onClick={onReturnToMenu} variant="ghost">
            กลับไปเมนูหลัก
          </Button>
        )}
      </section>
    </div>
  );
}
