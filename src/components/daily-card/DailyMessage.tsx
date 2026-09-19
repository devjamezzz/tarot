import { AiTypingDots } from "@/components/ui/AiTypingDots";
import { Card } from "@/components/ui/Card";

export interface AiReading {
  summary: string;
  cardStructure: string;
}

export interface DailyMessageProps {
  /** Deterministic engine text — always rendered first. */
  engineText: string;
  aiEnabled: boolean;
  aiLoading: boolean;
  ai: AiReading | null;
}

/** "ข้อความวันนี้" (ตำรา) followed, when enabled, by the AI expansion. */
export function DailyMessage({ engineText, aiEnabled, aiLoading, ai }: DailyMessageProps) {
  return (
    <>
      <Card data-testid="daily-message">
        <p className="eyebrow">ข้อความวันนี้</p>
        <p className="mt-2 leading-relaxed text-fg">{engineText}</p>
        <p className="mt-3 text-[13px] text-fg-muted">ความหมายตามตำรา</p>
      </Card>

      {aiEnabled && aiLoading ? (
        <Card variant="sunk" data-testid="daily-ai-loading">
          <AiTypingDots label="AI กำลังขยายความไพ่ของคุณ…" />
        </Card>
      ) : null}

      {aiEnabled && ai ? (
        <Card data-testid="daily-ai">
          <p className="eyebrow">AI ขยายความ</p>
          <p className="mt-2 whitespace-pre-line leading-relaxed text-fg">{ai.summary}</p>
          {ai.cardStructure ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{ai.cardStructure}</p>
          ) : null}
        </Card>
      ) : null}
    </>
  );
}
