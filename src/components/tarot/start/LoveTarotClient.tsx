"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { useConfigStore } from "@/store/useConfigStore";
import { buildPickHref, getSpread } from "@/lib/tarot/spreads";
import { DisabledFeature } from "./DisabledFeature";
import { QuestionField } from "./QuestionField";
import { SpreadSection } from "./SpreadSection";
import { StartActionBar } from "./StartActionBar";
import { RECOMMENDED_BADGE, chooseSpreads } from "./spreadOptions";

const LOVE_TOPIC = "love" as const;
const LOVE_SPREADS = ["their-feelings", "past-present-future"].map((id) => getSpread(id));

/** /love-tarot — preset entry: topic=love, "ความรู้สึกของเขา" pre-selected, 3-card one tap away. */
export function LoveTarotClient() {
  const router = useRouter();
  const { toggles } = useConfigStore();
  const [question, setQuestion] = useState("");
  const [pendingSpreadId, setPendingSpreadId] = useState<string | null>(null);

  const choice = useMemo(() => chooseSpreads(LOVE_TOPIC, null, LOVE_SPREADS), []);

  if (!toggles.enableLoveTarot) {
    return (
      <DisabledFeature description="ฟีเจอร์ดูดวงความรักกำลังอยู่ในช่วงอัปเดต โปรดกลับมาใหม่ภายหลัง" />
    );
  }

  const goToPick = (spreadId: string) => {
    if (pendingSpreadId) return;
    setPendingSpreadId(spreadId);
    router.push(buildPickHref({ spreadId, topic: LOVE_TOPIC, question }));
  };

  return (
    <PageContainer variant="narrow">
      <AppBar
        label="ไพ่ทาโรต์ · ความรัก"
        title="เปิดไพ่ถามเรื่องหัวใจ"
        caption="ไม่ว่าคุณจะโสด มีคู่ หรือกำลังคุยกับใคร ให้ไพ่ช่วยสะท้อนสิ่งที่อยู่ในใจ"
        backHref="/"
      />

      <div className="space-y-8 px-1 pt-2">
        <QuestionField
          topic={LOVE_TOPIC}
          value={question}
          onChange={setQuestion}
          placeholder="เช่น เขาคิดยังไงกับเรา หรือความสัมพันธ์นี้จะไปทางไหน"
        />

        <SpreadSection
          choice={choice}
          badge={RECOMMENDED_BADGE[LOVE_TOPIC]}
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
