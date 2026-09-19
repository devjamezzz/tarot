"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Markdown } from "@/components/ui/Markdown";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ReadingBlocks } from "@/components/reading/ReadingBlocks";
import { cn } from "@/lib/cn";
import type {
  SavedDailyCardReading,
  SavedSpiritCardReading,
  SavedSpiritPathReading,
  SavedTarotReading,
} from "@/lib/library/types";
import type { ReadingSession } from "@/lib/reading/types";
import { parseCardTokens } from "@/lib/tarot/engine";
import { getCardById } from "@/lib/tarot/deck";
import { formatThaiDate } from "@/lib/format/thaiDate";
import { CardFigure } from "../CardFigure";
import { cardNameTh, formatDateParts, orientationTh } from "../labels";
import { DetailBlock, NoSnapshotNote, TagList } from "./DetailBlock";

/** Engine blocks under the canonical "ความหมายตามตำรา" label (summary block is shown separately). */
function EngineSection({ session, skipIds = [] }: { session: ReadingSession; skipIds?: string[] }) {
  const blocks = session.blocks.filter((b) => !skipIds.includes(b.id));
  return (
    <div>
      <SectionHeader label="ความหมายตามตำรา" title="ภาพรวม" />
      {session.summary ? <p className="mt-2 text-base leading-[1.65] text-fg">{session.summary}</p> : null}
      {blocks.length ? <ReadingBlocks className="mt-3" blocks={blocks} /> : null}
    </div>
  );
}

export function TarotDetail({ reading }: { reading: SavedTarotReading }) {
  const snap = reading.snapshot;
  const cardsToken = snap?.input.cardsToken ?? reading.cardsToken;
  const count = snap?.input.count ?? reading.count;
  const question = snap?.input.question ?? reading.question;
  const session = snap?.session;
  const aiSummary = snap?.ai?.summary ?? reading.aiSummary;
  const aiCardStructure = snap?.ai?.cardStructure ?? reading.aiCardStructure;

  const drawnCards = React.useMemo(() => parseCardTokens(cardsToken), [cardsToken]);
  const cols = count <= 3 ? "grid-cols-3" : count <= 5 ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-4 sm:grid-cols-5";

  return (
    <div className="space-y-4">
      <Card>
        <p className="eyebrow">ทาโรต์ · {count} ใบ</p>
        {question ? <p className="mt-2 font-display text-lg leading-snug text-fg">&ldquo;{question}&rdquo;</p> : null}
      </Card>

      {drawnCards.length ? (
        <div className={cn("grid gap-3", cols)}>
          {drawnCards.map((drawn, index) => (
            <CardFigure key={`${drawn.card.id}-${index}`} card={drawn.card} orientation={drawn.orientation} hideEnglish sizes="120px" />
          ))}
        </div>
      ) : null}

      {session ? <EngineSection session={session} skipIds={["tarot-summary"]} /> : <NoSnapshotNote />}

      <DetailBlock title="สรุปโดย AI" body={aiSummary} tone="ai" />
      <DetailBlock title="รายละเอียดโดย AI" body={aiCardStructure} tone="ai" />
    </div>
  );
}

export function DailyCardDetail({ reading }: { reading: SavedDailyCardReading }) {
  const snap = reading.snapshot;
  const cardId = snap?.cardId ?? reading.cardId;
  const orientation = snap?.orientation ?? reading.orientation;
  const dayKey = snap?.dayKey ?? reading.dayKey;
  const card = getCardById(cardId);

  const message = snap?.output.message ?? reading.summary;
  const focus = snap?.output.focus ?? [];
  const action = snap?.output.advice.action;
  const avoid = snap?.output.advice.avoid;

  return (
    <div className="space-y-4">
      {card ? (
        <div className="mx-auto w-[180px]">
          <CardFigure card={card} orientation={orientation} label="ไพ่ประจำวัน" priority sizes="180px" />
        </div>
      ) : null}
      <p className="text-center text-[13px] text-fg-muted">
        {formatThaiDate(dayKey)} · {orientationTh(orientation)}
      </p>

      <TagList title="โฟกัสวันนี้" tags={focus} />
      <DetailBlock title="คำแนะนำ" body={message} />
      <DetailBlock title="สิ่งที่ควรทำ" body={action} />
      <DetailBlock title="สิ่งที่ควรเลี่ยง" body={avoid} />
      {!snap ? <NoSnapshotNote /> : null}
    </div>
  );
}

export function SpiritCardDetail({ reading }: { reading: SavedSpiritCardReading }) {
  const snap = reading.snapshot;
  const dob = snap?.input.dob ?? reading.dob;
  const cardId = snap?.card.cardId ?? reading.cardId;
  const orientation = snap?.card.orientation ?? reading.orientation;
  const lifePathNumber = snap?.card.lifePathNumber ?? reading.lifePathNumber;
  const card = getCardById(cardId);

  const message = snap?.output?.message ?? reading.aiSummary;
  const practice = snap?.output?.practice ?? reading.aiCardStructure;

  return (
    <div className="space-y-4">
      {card ? (
        <div className="mx-auto w-[180px]">
          <CardFigure card={card} orientation={orientation} label="ไพ่จิตวิญญาณ" priority sizes="180px" />
        </div>
      ) : null}
      <p className="text-center text-[13px] text-fg-muted">
        เกิด {formatThaiDate(dob)}
        {lifePathNumber != null ? ` · เลขเส้นทางชีวิต ${lifePathNumber}` : ""}
      </p>

      {snap?.session ? <EngineSection session={snap.session} skipIds={["spirit-summary"]} /> : <NoSnapshotNote />}

      <DetailBlock title="สารจากจักรวาล" body={message} tone="ai" />
      <DetailBlock title="แนวทางปฏิบัติ" body={practice} tone="ai" />
    </div>
  );
}

export function SpiritPathDetail({ reading }: { reading: SavedSpiritPathReading }) {
  const snap = reading.snapshot;
  const day = snap?.input.day ?? reading.day;
  const month = snap?.input.month ?? reading.month;
  const year = snap?.input.year ?? reading.year;
  const zodiac = getCardById(snap?.cards.zodiacCardId ?? reading.zodiacCardId);
  const soul = getCardById(snap?.cards.soulCardId ?? reading.soulCardId);
  const md = snap?.output?.interpretationMarkdown ?? reading.interpretationMarkdown;

  return (
    <div className="space-y-4">
      <div className="mx-auto grid max-w-[420px] grid-cols-2 gap-4">
        {zodiac ? <CardFigure card={zodiac} label="ไพ่ราศี" priority /> : null}
        {soul ? <CardFigure card={soul} label="ไพ่จิตวิญญาณ" priority /> : null}
      </div>
      <p className="text-center text-[13px] text-fg-muted">เกิด {formatDateParts(day, month, year)}</p>

      {zodiac && soul ? (
        <Card>
          <p className="eyebrow">ความหมายตามตำรา</p>
          <div className="mt-2 space-y-3">
            <div>
              <p className="font-display text-base font-semibold text-fg">ไพ่ราศี · {cardNameTh(zodiac)}</p>
              <p className="mt-1 text-base leading-[1.65] text-fg">{zodiac.meaningUpright}</p>
            </div>
            <div>
              <p className="font-display text-base font-semibold text-fg">ไพ่จิตวิญญาณ · {cardNameTh(soul)}</p>
              <p className="mt-1 text-base leading-[1.65] text-fg">{soul.meaningUpright}</p>
            </div>
          </div>
        </Card>
      ) : null}

      {md ? (
        <Card variant="sunk">
          <p className="eyebrow">คำตีความ</p>
          <div className="mt-3">
            <Markdown>{md}</Markdown>
          </div>
        </Card>
      ) : (
        <NoSnapshotNote />
      )}
    </div>
  );
}
