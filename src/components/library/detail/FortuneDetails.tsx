import { Card } from "@/components/ui/Card";
import type {
  ChineseZodiacData,
  CompatibilityData,
  HoroscopeData,
  NameNumerologyData,
  SpecializedData,
} from "@/lib/library/types";
import { formatThaiDate } from "@/lib/format/thaiDate";
import { animalTh, domainTh, elementTh, periodTh, zodiacTh } from "../labels";
import { DetailBlock } from "./DetailBlock";

function Header({ label, title, caption }: { label: string; title: string; caption?: string }) {
  return (
    <Card>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 font-display text-[22px] font-semibold leading-snug text-fg">{title}</p>
      {caption ? <p className="mt-1 text-[13px] text-fg-muted">{caption}</p> : null}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-card border border-line-faint bg-sunk p-3">
      <p className="text-[13px] text-fg-muted">{label}</p>
      <p className="mt-1 text-lg font-bold tabular-nums text-fg">{value}</p>
    </div>
  );
}

function dateRange(range?: { start: string; end: string }): string | undefined {
  if (!range?.start) return undefined;
  const start = formatThaiDate(range.start);
  const end = range.end ? formatThaiDate(range.end) : "";
  return end && end !== start ? `${start} – ${end}` : start;
}

function joinLines(items?: string[]): string {
  return (items ?? []).filter(Boolean).join("\n");
}

export function HoroscopeDetail({ reading }: { reading: HoroscopeData }) {
  return (
    <div className="space-y-4">
      <Header label="ดวงชะตา" title={`ราศี${zodiacTh(reading.zodiacSign)}`} caption={[periodTh(reading.period), dateRange(reading.dateRange)].filter(Boolean).join(" · ")} />
      <DetailBlock title="ความรัก" body={reading.aspects.love} />
      <DetailBlock title="การงาน" body={reading.aspects.career} />
      <DetailBlock title="การเงิน" body={reading.aspects.finance} />
      <DetailBlock title="สุขภาพ" body={reading.aspects.health} />
      {reading.luckyNumbers?.length || reading.luckyColors?.length ? (
        <div className="grid grid-cols-2 gap-3">
          {reading.luckyNumbers?.length ? <Stat label="เลขนำโชค" value={reading.luckyNumbers.join(", ")} /> : null}
          {reading.luckyColors?.length ? <Stat label="สีมงคล" value={reading.luckyColors.join(", ")} /> : null}
        </div>
      ) : null}
      <DetailBlock title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}

export function CompatibilityDetail({ reading }: { reading: CompatibilityData }) {
  return (
    <div className="space-y-4">
      <Header
        label="ความเข้ากัน"
        title={`ราศี${zodiacTh(reading.person1.zodiacSign)} + ราศี${zodiacTh(reading.person2.zodiacSign)}`}
        caption={reading.elementCompatibility}
      />
      <Card>
        <p className="eyebrow">คะแนนรวม</p>
        <p className="mt-1 font-sans text-[44px] font-bold leading-none tracking-[0.12em] tabular-nums text-gold">
          {reading.scores.overall}%
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="การสื่อสาร" value={`${reading.scores.communication}%`} />
          <Stat label="อารมณ์" value={`${reading.scores.emotional}%`} />
          <Stat label="ระยะยาว" value={`${reading.scores.longTerm}%`} />
        </div>
      </Card>
      <DetailBlock title="จุดแข็ง" body={joinLines(reading.strengths)} />
      <DetailBlock title="จุดท้าทาย" body={joinLines(reading.challenges)} />
      <DetailBlock title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}

export function ChineseZodiacDetail({ reading }: { reading: ChineseZodiacData }) {
  return (
    <div className="space-y-4">
      <Header
        label="ราศีจีน"
        title={animalTh(reading.animal)}
        caption={[`ธาตุ${elementTh(reading.element)}`, periodTh(reading.period), dateRange(reading.dateRange)].filter(Boolean).join(" · ")}
      />
      <DetailBlock title="ภาพรวม" body={reading.fortune.overall} />
      <DetailBlock title="การงาน" body={reading.fortune.career} />
      <DetailBlock title="การเงิน" body={reading.fortune.wealth} />
      <DetailBlock title="สุขภาพ" body={reading.fortune.health} />
      <DetailBlock title="ความสัมพันธ์" body={reading.fortune.relationships} />
      <div className="grid grid-cols-3 gap-2">
        {reading.luckyColors?.length ? <Stat label="สีมงคล" value={reading.luckyColors.join(", ")} /> : null}
        {reading.luckyNumbers?.length ? <Stat label="เลขนำโชค" value={reading.luckyNumbers.join(", ")} /> : null}
        {reading.luckyDirections?.length ? <Stat label="ทิศมงคล" value={reading.luckyDirections.join(", ")} /> : null}
      </div>
      <DetailBlock title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}

export function NameNumerologyDetail({ reading }: { reading: NameNumerologyData }) {
  return (
    <div className="space-y-4">
      <Header label="เลขศาสตร์ชื่อ" title={`${reading.firstName} ${reading.lastName}`.trim()} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="ชื่อ" value={reading.scores.firstName} />
        <Stat label="นามสกุล" value={reading.scores.lastName} />
        <Stat label="ชื่อเต็ม" value={reading.scores.fullName} />
        <Stat label="เลขชะตา" value={reading.scores.destiny} />
      </div>
      <DetailBlock title="บุคลิกภาพ" body={reading.interpretation.personality} />
      <DetailBlock title="จุดแข็ง" body={joinLines(reading.interpretation.strengths)} />
      <DetailBlock title="จุดอ่อน" body={joinLines(reading.interpretation.weaknesses)} />
      <DetailBlock title="เส้นทางชีวิต" body={reading.interpretation.lifePath} />
      <DetailBlock title="การงาน" body={reading.interpretation.career} />
      <DetailBlock title="ความสัมพันธ์" body={reading.interpretation.relationships} />
      {reading.luckyNumbers?.length ? <Stat label="เลขนำโชค" value={reading.luckyNumbers.join(", ")} /> : null}
      <DetailBlock title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}

export function SpecializedDetail({ reading }: { reading: SpecializedData }) {
  return (
    <div className="space-y-4">
      <Header
        label="เฉพาะทาง"
        title={domainTh(reading.domain)}
        caption={[`ราศี${zodiacTh(reading.zodiacSign)}`, periodTh(reading.period), dateRange(reading.dateRange)].filter(Boolean).join(" · ")}
      />
      <DetailBlock title="คำทำนาย" body={reading.prediction} />
      <DetailBlock title="โอกาส" body={joinLines(reading.opportunities)} />
      <DetailBlock title="ความท้าทาย" body={joinLines(reading.challenges)} />
      <DetailBlock title="สิ่งที่ควรทำ" body={joinLines(reading.actionItems)} />
      <DetailBlock title="คำแนะนำ" body={reading.advice} />
    </div>
  );
}
