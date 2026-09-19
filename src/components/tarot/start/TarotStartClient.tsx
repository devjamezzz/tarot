"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { useConfigStore } from "@/store/useConfigStore";
import { PICK_QUERY, buildPickHref, parsePickQuery, type TopicId } from "@/lib/tarot/spreads";
import { DisabledFeature } from "./DisabledFeature";
import { QuestionField } from "./QuestionField";
import { SpreadSection } from "./SpreadSection";
import { StartActionBar } from "./StartActionBar";
import { TopicChips } from "./TopicChips";
import { RECOMMENDED_BADGE, chooseSpreads } from "./spreadOptions";

/** /tarot — topic → optional question → one gold tap (recommended spread) → /tarot/pick. */
export function TarotStartClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toggles } = useConfigStore();

  const initial = useMemo(() => parsePickQuery(searchParams), [searchParams]);
  const requestedSpreadId = searchParams.get(PICK_QUERY.spread);
  const [topic, setTopic] = useState<TopicId>(initial.topic);
  const [question, setQuestion] = useState(initial.question);
  const [pendingSpreadId, setPendingSpreadId] = useState<string | null>(null);

  const choice = useMemo(() => chooseSpreads(topic, requestedSpreadId), [topic, requestedSpreadId]);

  if (!toggles.enableTarot) {
    return (
      <DisabledFeature description="ฟีเจอร์ไพ่ทาโรต์กำลังอยู่ในช่วงอัปเดต โปรดกลับมาใหม่ภายหลัง" />
    );
  }

  const goToPick = (spreadId: string) => {
    if (pendingSpreadId) return;
    setPendingSpreadId(spreadId);
    router.push(buildPickHref({ spreadId, topic, question }));
  };

  return (
    <PageContainer variant="narrow">
      <AppBar
        label="ไพ่ทาโรต์"
        title="ตั้งจิตแล้วถามไพ่"
        caption="เลือกหัวข้อ พิมพ์คำถามถ้าต้องการ แล้วแตะปุ่มทองเพื่อไปเลือกไพ่"
        backHref="/"
      />

      <div className="space-y-8 px-1 pt-2">
        <section aria-labelledby="tarot-topic-heading">
          <h2 id="tarot-topic-heading" className="eyebrow mb-3">
            หัวข้อที่อยากถาม
          </h2>
          <TopicChips value={topic} onChange={setTopic} />
        </section>

        <QuestionField topic={topic} value={question} onChange={setQuestion} />

        <SpreadSection
          choice={choice}
          badge={RECOMMENDED_BADGE[topic]}
          pendingSpreadId={pendingSpreadId}
          onSelect={goToPick}
        />
      </div>

      <StartActionBar
        spread={choice.current}
        submitting={pendingSpreadId !== null}
        onStart={() => goToPick(choice.current.id)}
      />
    </PageContainer>
  );
}
