import { ReadingBlocks } from "@/components/reading/ReadingBlocks";
import type { InterpretationBlock } from "@/lib/reading/types";

/**
 * Deterministic engine interpretation, labelled "ความหมายตามตำรา".
 * Rendered only when `toggles.showAiReading` is on; never AI text.
 */
export function EngineMeaning({ blocks }: { blocks: InterpretationBlock[] }) {
  return (
    <section data-testid="engine-meaning" aria-labelledby="engine-meaning-title">
      <p className="eyebrow">ความหมายตามตำรา</p>
      <h2 id="engine-meaning-title" className="mt-1 font-display text-[22px] font-semibold text-fg">
        ความหมายพื้นฐานของไพ่
      </h2>
      <p className="mt-1 text-[13px] text-fg-muted">
        สรุปจากตำแหน่งไพ่ในสเปรดและความหมายตามตำรา ไม่ใช้ AI
      </p>
      <ReadingBlocks blocks={blocks} className="mt-4" />
    </section>
  );
}
