"use client";

import * as React from "react";
import { PencilLine } from "lucide-react";
import { ChartForm, CHART_SYSTEMS } from "@/components/astrology/ChartForm";
import { ChartResult } from "@/components/astrology/ChartResult";
import { DateStepper, type DateValue } from "@/components/astrology/DateStepper";
import { computeNatalChart } from "@/lib/astrology/engine";
import type { BirthInput, ChartSystem, NatalChart } from "@/lib/astrology/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";

type View = "natal" | "transit" | "overlay";

const VIEW_TABS: { id: View; label: string }[] = [
  { id: "natal", label: "ดวงกำเนิด" },
  { id: "transit", label: "ดวงจร" },
  { id: "overlay", label: "ราศีจร (ซ้อน)" },
];

function todayDate(): DateValue {
  const d = new Date();
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  };
}

export function ChartClient() {
  const [birth, setBirth] = React.useState<BirthInput | null>(null);
  // Last submitted input, kept so "แก้ไข" reopens the form pre-filled.
  const [draft, setDraft] = React.useState<BirthInput | null>(null);
  const [system, setSystem] = React.useState<ChartSystem>("suriyayatra");
  const [transitDate, setTransitDate] = React.useState<DateValue>(todayDate);
  const [view, setView] = React.useState<View>("overlay");

  function handleSubmit(input: BirthInput, sys: ChartSystem) {
    setBirth(input);
    setDraft(input);
    setSystem(sys);
  }

  const charts = React.useMemo(() => {
    if (!birth) return null;
    const natal = computeNatalChart(birth, system);
    const transit = computeNatalChart(
      {
        ...transitDate,
        timezoneHours: birth.timezoneHours,
        latitude: birth.latitude,
        longitude: birth.longitude,
      },
      system
    );
    return { natal, transit };
  }, [birth, system, transitDate]);

  if (!charts || !birth) {
    return (
      <Card className="mt-4">
        <ChartForm onSubmit={handleSubmit} initialSystem={system} initial={draft ?? undefined} />
      </Card>
    );
  }

  const asOf = new Date(transitDate.year, transitDate.month - 1, transitDate.day, transitDate.hour, transitDate.minute);

  return (
    <div className="mt-4 space-y-4">
      <Card className="p-2 md:p-2">
        <Tabs view={view} onChange={setView} />
      </Card>

      <Card className="space-y-4">
        <DateStepper value={transitDate} onChange={setTransitDate} />
        <ResultDisplay charts={charts} view={view} asOf={asOf} />
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-fg-muted">สลับระบบคำนวณ</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="ระบบคำนวณ">
            {CHART_SYSTEMS.map((s) => (
              <Chip key={s.id} selected={system === s.id} onClick={() => setSystem(s.id)}>
                {s.label}
              </Chip>
            ))}
          </div>
        </div>
      </Card>

      <Button type="button" variant="ghost" className="w-full" onClick={() => setBirth(null)}>
        <PencilLine strokeWidth={1.5} />
        แก้ไขข้อมูลวันเดือนปีเกิด
      </Button>
    </div>
  );
}

function Tabs({ view, onChange }: { view: View; onChange: (v: View) => void }) {
  return (
    <div role="tablist" aria-label="มุมมองดวงชะตา" className="grid grid-cols-3 gap-1 rounded-pill bg-sunk p-1">
      {VIEW_TABS.map((t) => {
        const active = view === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "h-10 rounded-pill border text-[13px] font-medium transition-colors sm:text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              active ? "border-gold/60 bg-gold-soft text-gold" : "border-transparent text-fg-muted hover:text-fg"
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function ResultDisplay({
  charts,
  view,
  asOf,
}: {
  charts: { natal: NatalChart; transit: NatalChart };
  view: View;
  asOf: Date;
}) {
  return <ChartResult natal={charts.natal} transit={charts.transit} view={view} asOf={asOf} />;
}
