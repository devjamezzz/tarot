"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { ChartWheel } from "./ChartWheel";
import { PlanetTable } from "./PlanetTable";
import { PhromchartSquare } from "./PhromchartSquare";
import { SubWheel } from "./SubWheels";
import { DashaTable } from "./DashaTable";
import { TriwaiTable } from "./TriwaiTable";
import { ZODIAC_SIGNS } from "@/lib/astrology/zodiac";
import { THAI_MONTHS } from "@/components/ui/BirthDateField";
import { toBuddhistYear } from "@/lib/format/thaiDate";
import type { NatalChart } from "@/lib/astrology/types";

export interface ChartResultProps {
  natal: NatalChart;
  transit: NatalChart;
  asOf: Date;
  view: "natal" | "transit" | "overlay";
  className?: string;
}

const WEEKDAY_PLANETS = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];
const WEEKDAY_TH = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

function formatHM(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} น.`;
}

function ayanamsaDMS(deg: number): string {
  const total = Math.abs(deg);
  const d = Math.floor(total);
  const m = Math.floor((total - d) * 60);
  const s = Math.round(((total - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

function describeChart(chart: NatalChart): string {
  const sun = chart.planets.find((p) => p.id === "sun");
  const lagna = chart.planets[0];
  if (!sun) return "";
  return `อาทิตย์ ${sun.zodiac.degree}°${String(sun.zodiac.minute).padStart(2, "0")}' ราศี${ZODIAC_SIGNS[sun.zodiac.sign].thaiName} · ลัคนา ${lagna.zodiac.degree}°${String(lagna.zodiac.minute).padStart(2, "0")}' ราศี${ZODIAC_SIGNS[lagna.zodiac.sign].thaiName}`;
}

function SunriseLine({ chart }: { chart: NatalChart }) {
  if (!chart.sunrise) return null;
  return (
    <p className="mt-1 text-[13px] text-fg-subtle">
      สมผุสอาทิตย์อุทัย {formatHM(chart.sunrise.hourLocal, chart.sunrise.minuteLocal)} · อาทิตย์{" "}
      {chart.sunrise.sunDegree}°{String(chart.sunrise.sunMinute).padStart(2, "0")}&apos; ราศี
      {ZODIAC_SIGNS[chart.sunrise.sunSign].thaiName}
    </p>
  );
}

function ChartHeader({ chart, label, prefix, tone }: { chart: NatalChart; label: string; prefix: string; tone: "gold" | "plain" }) {
  return (
    <div className={cn("rounded-card border p-3", tone === "gold" ? "border-gold/40 bg-gold-soft" : "border-line bg-sunk")}>
      <p className="eyebrow mb-1">{label}</p>
      <p className="text-sm text-fg">
        {prefix}{" "}
        <span className="font-medium">
          {chart.input.day} {THAI_MONTHS[chart.input.month - 1]} พ.ศ. {toBuddhistYear(chart.input.year)}
        </span>{" "}
        เวลา <span className="font-medium tabular-nums">{formatHM(chart.input.hour, chart.input.minute)}</span>
      </p>
      <p className="mt-1 text-[13px] text-fg-muted">{describeChart(chart)}</p>
      <SunriseLine chart={chart} />
    </div>
  );
}

export function ChartResult({ natal, transit, asOf, view, className }: ChartResultProps) {
  const primary = view === "transit" ? transit : natal;
  const overlayWith = view === "overlay" ? transit : undefined;

  const birthDate = new Date(natal.input.year, natal.input.month - 1, natal.input.day, natal.input.hour, natal.input.minute);
  const ageMs = asOf.getTime() - birthDate.getTime();
  const ageYears = ageMs / (365.2425 * 24 * 3600 * 1000);

  const weekdayIdx = WEEKDAY_PLANETS.indexOf(natal.weekday);
  const weekdayName = WEEKDAY_TH[weekdayIdx] ?? "";

  return (
    <div className={cn("space-y-5", className)}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ChartHeader chart={natal} label="ดวงกำเนิด" prefix={`วัน${weekdayName} ที่`} tone="gold" />
        <ChartHeader chart={transit} label="ดวงจร / วันที่ทำนาย" prefix="วันที่" tone="plain" />
      </div>

      <div className="flex justify-center overflow-x-auto">
        <ChartWheel chart={primary} transit={overlayWith} size={480} />
      </div>

      <div className="overflow-x-auto">
        <PlanetTable chart={primary} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center rounded-card border border-line-faint bg-sunk p-4">
          <p className="eyebrow mb-2 self-start">ดวงพรหมชาติ</p>
          <PhromchartSquare chart={primary} size={300} />
        </div>

        <div className="space-y-3 rounded-card border border-line-faint bg-sunk p-4">
          <p className="eyebrow">ทักษิณาวัฏ — จักรขนาดเล็ก</p>
          <div className="grid grid-cols-2 gap-2">
            <SubWheel title="นวางค์จักร" chart={primary} signOf={(p) => p.navamshaSign} size={150} />
            <SubWheel title="ตรียางค์จักร" chart={primary} signOf={(p) => p.decanateSign} size={150} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <DashaTable chart={natal} asOfDate={asOf} />
      </div>

      <div className="overflow-x-auto">
        <TriwaiTable chart={natal} ageYears={ageYears} />
      </div>

      <p className="text-center text-[13px] text-fg-subtle">
        ระบบ{primary.system === "suriyayatra" ? "สุริยยาตร์" : "นิรายนะ (Lahiri)"}
        {" · "}อายนางศะ {ayanamsaDMS(primary.ayanamsa)}
        {" · "}© พ.ศ. {toBuddhistYear(transit.input.year)} REFFORTUNE
      </p>
    </div>
  );
}
