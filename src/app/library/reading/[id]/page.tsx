"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { HeartSave } from "@/components/ui/HeartSave";
import { Button } from "@/components/ui/Button";
import { LineCtaButton } from "@/components/ui/LineCtaButton";
import { ShareButton } from "@/components/ui/ShareButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { TrustPanel } from "@/components/reading/TrustPanel";
import { useMounted } from "@/components/library/useMounted";
import { readingTypeTh } from "@/components/library/labels";
import { entryUsedAi, isSpiritPath, presentEntry } from "@/components/library/entryPresenters";
import {
  DailyCardDetail,
  SpiritCardDetail,
  SpiritPathDetail,
  TarotDetail,
} from "@/components/library/detail/CardDetails";
import {
  ChineseZodiacDetail,
  CompatibilityDetail,
  HoroscopeDetail,
  NameNumerologyDetail,
  SpecializedDetail,
} from "@/components/library/detail/FortuneDetails";
import { useLibrary } from "@/lib/library/useLibrary";
import type {
  ChineseZodiacData,
  CompatibilityData,
  HoroscopeData,
  LibraryEntry,
  NameNumerologyData,
  SavedDailyCardReading,
  SavedSpiritCardReading,
  SavedTarotReading,
  SpecializedData,
} from "@/lib/library/types";
import { ReadingType } from "@/lib/reading/types";
import { formatThaiDate } from "@/lib/format/thaiDate";

const TRUST_BY_TYPE: Record<ReadingType, string> = {
  [ReadingType.TAROT]: "ตำแหน่งไพ่ในสเปรดและความหมายตามตำรา",
  [ReadingType.DAILY_CARD]: "ไพ่ประจำวันที่สุ่มจากวันที่ และความหมายตามตำรา",
  [ReadingType.SPIRIT_CARD]: "วันเกิดและเลขเส้นทางชีวิต จับคู่กับความหมายไพ่ตามตำรา",
  [ReadingType.NUMEROLOGY]: "ผลรวมและเลขรากของเบอร์ตามหลักเลขศาสตร์",
  [ReadingType.HOROSCOPE]: "ราศีและช่วงเวลาที่เลือก คำนวณจากตำราโหราศาสตร์",
  [ReadingType.COMPATIBILITY]: "ธาตุและคุณสมบัติของสองราศี คำนวณจากตำราโหราศาสตร์",
  [ReadingType.CHINESE_ZODIAC]: "ปีนักษัตรและธาตุประจำปีเกิดตามตำราจีน",
  [ReadingType.SPECIALIZED]: "ราศีและหมวดที่เลือก คำนวณจากตำราโหราศาสตร์",
  [ReadingType.NAME_NUMEROLOGY]: "ค่าตัวอักษรในชื่อ-นามสกุลตามหลักเลขศาสตร์ไทย",
};

function DetailBody({ entry }: { entry: LibraryEntry }) {
  switch (entry.type) {
    case ReadingType.TAROT:
      return <TarotDetail reading={entry.data as SavedTarotReading} />;
    case ReadingType.DAILY_CARD:
      return <DailyCardDetail reading={entry.data as SavedDailyCardReading} />;
    case ReadingType.SPIRIT_CARD:
      return isSpiritPath(entry.data) ? (
        <SpiritPathDetail reading={entry.data} />
      ) : (
        <SpiritCardDetail reading={entry.data as SavedSpiritCardReading} />
      );
    case ReadingType.HOROSCOPE:
      return <HoroscopeDetail reading={entry.data as HoroscopeData} />;
    case ReadingType.COMPATIBILITY:
      return <CompatibilityDetail reading={entry.data as CompatibilityData} />;
    case ReadingType.CHINESE_ZODIAC:
      return <ChineseZodiacDetail reading={entry.data as ChineseZodiacData} />;
    case ReadingType.NAME_NUMEROLOGY:
      return <NameNumerologyDetail reading={entry.data as NameNumerologyData} />;
    case ReadingType.SPECIALIZED:
      return <SpecializedDetail reading={entry.data as SpecializedData} />;
    default:
      return (
        <Card>
          <p className="text-sm text-fg-muted">รูปแบบนี้ยังไม่รองรับ</p>
        </Card>
      );
  }
}

function NotFoundState() {
  return (
    <PageContainer variant="narrow">
      <AppBar label="คลังของฉัน" title="รายละเอียด" backHref="/library/saved" />
      <Card className="mt-4 text-center">
        <p className="font-display text-lg font-semibold text-fg">ไม่พบรายการนี้ในคลัง</p>
        <p className="mt-2 text-sm text-fg-muted">อาจถูกลบไปแล้ว หรือข้อมูลในเครื่องถูกล้าง</p>
        <Button asChild variant="ghost" className="mt-4 w-full">
          <Link href="/library/saved">กลับไปหน้าบันทึก</Link>
        </Button>
      </Card>
    </PageContainer>
  );
}

export default function SavedReadingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lib = useLibrary();
  const mounted = useMounted();

  const id = params?.id;
  const entry = React.useMemo(() => lib.entries.find((e) => e.id === id), [id, lib.entries]);

  if (!mounted) {
    return (
      <PageContainer variant="narrow">
        <AppBar label="คลังของฉัน" title="รายละเอียด" caption="กำลังโหลด…" backHref="/library/saved" />
        <div className="mt-4 space-y-3" aria-busy="true">
          <Skeleton className="mx-auto aspect-[2/3] w-[180px]" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (!id || !entry) return <NotFoundState />;

  const typeLabel = readingTypeTh(entry.type);
  const { title } = presentEntry(entry);

  const remove = () => {
    lib.remove(entry.id);
    router.push("/library/saved");
  };

  return (
    <PageContainer variant="narrow">
      <AppBar
        label={typeLabel}
        title={title}
        caption={`บันทึกเมื่อ ${formatThaiDate(entry.createdAt, { withTime: true })}`}
        backHref="/library/saved"
        right={<HeartSave saved onToggle={remove} label="เอาออกจากคลัง" />}
      />

      <div className="mt-4">
        <DetailBody entry={entry} />
      </div>

      <div className="mt-6 flex flex-col gap-3" data-testid="result-cta">
        <LineCtaButton text={`อยากให้ช่วยอ่านผล${typeLabel}ที่ฉันบันทึกไว้เพิ่มเติม`} />
        <div className="grid grid-cols-2 gap-3">
          <ShareButton
            variant="ghost"
            shareData={{
              title: "คำทำนายจาก REFFORTUNE",
              text: title,
              url: typeof window !== "undefined" ? window.location.href : "",
            }}
          />
          <Button asChild variant="ghost">
            <Link href="/library/saved">กลับไปหน้าบันทึก</Link>
          </Button>
        </div>
      </div>

      <TrustPanel
        className="mt-6"
        computedFrom={TRUST_BY_TYPE[entry.type] ?? "ข้อมูลที่บันทึกไว้ในเครื่องของคุณ"}
        confidence="ปานกลาง"
        aiUsed={entryUsedAi(entry)}
      />
    </PageContainer>
  );
}
