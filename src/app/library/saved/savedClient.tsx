"use client";

import Link from "next/link";
import * as React from "react";
import { BookMarked, Plus, Search } from "lucide-react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMounted } from "@/components/library/useMounted";
import { SavedEntryRow } from "@/components/library/SavedEntryRow";
import { buildSearchText, normalizeForSearch } from "@/components/library/entryPresenters";
import { READING_TYPE_TH } from "@/components/library/labels";
import { ChipScroller } from "@/components/verticals/local/ChipScroller";
import { Toast, TOAST_REMOVED, useToast } from "@/components/verticals/local/Toast";
import { StepsCard } from "@/components/verticals/local/StepsCard";
import { ExploreMore } from "@/components/verticals/local/ExploreMore";
import { useLibrary } from "@/lib/library/useLibrary";
import { ReadingType } from "@/lib/reading/types";

type ChipKey = "all" | ReadingType;

const CHIP_TYPES: ReadingType[] = [
  ReadingType.TAROT,
  ReadingType.DAILY_CARD,
  ReadingType.SPIRIT_CARD,
  ReadingType.HOROSCOPE,
  ReadingType.COMPATIBILITY,
  ReadingType.CHINESE_ZODIAC,
  ReadingType.SPECIALIZED,
  ReadingType.NAME_NUMEROLOGY,
];

const HOW_TO_SAVE_STEPS: ReadonlyArray<string> = [
  "ดูดวงศาสตร์ไหนก็ได้จนถึงหน้าผลลัพธ์",
  "แตะปุ่ม \"บันทึกลงคลัง\" (รูปหัวใจ) ใต้คำทำนาย",
  "กลับมาเปิดอ่านที่นี่ได้ทุกเมื่อ เก็บไว้ในเครื่องนี้ ไม่ต้องเข้าสู่ระบบ",
];

export default function SavedClient() {
  const mounted = useMounted();
  const lib = useLibrary();
  const toast = useToast();
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<ChipKey>("all");
  const [confirmClear, setConfirmClear] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = normalizeForSearch(query.trim());
    const byType = typeFilter === "all" ? lib.entries : lib.entries.filter((e) => e.type === typeFilter);
    if (!q) return byType;
    return byType.filter((entry) => buildSearchText(entry).includes(q));
  }, [lib.entries, query, typeFilter]);

  const total = lib.entries.length;
  const hasAnySaved = mounted && total > 0;
  const hasResults = filtered.length > 0;

  function removeEntry(id: string) {
    lib.remove(id);
    toast.show(TOAST_REMOVED);
  }

  function clearAll() {
    lib.clear();
    setConfirmClear(false);
    toast.show("ล้างคลังแล้ว");
  }

  return (
    <PageContainer variant="narrow">
      <AppBar
        label="คลังของฉัน"
        title="บันทึก"
        caption={hasAnySaved ? `ทั้งหมด ${total} รายการ · เก็บในเครื่องนี้` : "ผลดูดวงที่คุณบันทึกไว้ เก็บในเครื่องนี้"}
        right={
          <Button asChild size="sm">
            <Link href="/">
              <Plus strokeWidth={1.5} />
              ใหม่
            </Link>
          </Button>
        }
      />

      <div className="relative mt-2">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gold"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาบันทึกของคุณ…"
          aria-label="ค้นหาบันทึกการดูดวง"
          className="pl-11"
        />
      </div>

      <ChipScroller className="mt-3" role="group" aria-label="กรองตามประเภท">
        <Chip onClick={() => setTypeFilter("all")} selected={typeFilter === "all"}>
          ทั้งหมด
        </Chip>
        {CHIP_TYPES.map((type) => (
          <Chip key={type} onClick={() => setTypeFilter(type)} selected={typeFilter === type}>
            {READING_TYPE_TH[type]}
          </Chip>
        ))}
      </ChipScroller>

      {!mounted ? (
        <div className="mt-5 space-y-3" aria-busy="true" aria-label="กำลังโหลด…">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : !hasAnySaved ? (
        <>
          <Card className="mt-5 text-center" data-testid="saved-empty">
            <BookMarked className="mx-auto size-10 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-3 font-display text-lg font-semibold text-fg">ยังไม่มีรายการที่บันทึกไว้</p>
            <p className="mt-2 text-sm text-fg-muted">เริ่มดูดวงแล้วแตะรูปหัวใจ เพื่อบันทึกไว้ในคลังนี้</p>
            <Button asChild size="lg" className="mt-4 w-full">
              <Link href="/tarot">เริ่มดูดวงทาโรต์</Link>
            </Button>
          </Card>
          <StepsCard label="วิธีบันทึก" title="เก็บผลดูดวงไว้อ่านย้อนหลัง" steps={HOW_TO_SAVE_STEPS} />
          <ExploreMore title="เลือกศาสตร์ที่อยากเริ่ม" />
        </>
      ) : !hasResults ? (
        <Card className="mt-5 text-center">
          <p className="font-display text-lg font-semibold text-fg">ไม่พบผลลัพธ์</p>
          <p className="mt-2 text-sm text-fg-muted">ลองใช้คำค้นหาอื่น หรือล้างการค้นหา</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setQuery("");
                setTypeFilter("all");
              }}
            >
              ล้างการค้นหา
            </Button>
          </div>
        </Card>
      ) : (
        <div className="mt-5 grid gap-3" aria-live="polite">
          {filtered.map((entry) => (
            <SavedEntryRow key={entry.id} entry={entry} onRemove={() => removeEntry(entry.id)} />
          ))}
        </div>
      )}

      {hasAnySaved ? (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {confirmClear ? (
            <>
              <span className="text-[13px] text-fg-muted">ล้างบันทึกทั้งหมด {total} รายการ?</span>
              <Button variant="destructive" size="sm" onClick={clearAll}>
                ยืนยันล้างทั้งหมด
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmClear(false)}>
                ยกเลิก
              </Button>
            </>
          ) : (
            <Button variant="link" size="sm" className="px-0 text-fg-subtle" onClick={() => setConfirmClear(true)}>
              ล้างทั้งหมด
            </Button>
          )}
        </div>
      ) : null}

      <Toast message={toast.message} />
    </PageContainer>
  );
}
