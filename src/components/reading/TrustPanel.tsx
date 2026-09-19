import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

/** Line 3 of every result page. Change the wording here only. */
export const TRUST_DISCLAIMER = "เพื่อการสะท้อนตนเอง ไม่ใช่คำทำนายทางการแพทย์/การเงิน";

export type TrustConfidence = "สูง" | "ปานกลาง" | "ต่ำ";

export type TrustPanelProps = {
  /** What the result was computed from, e.g. "ตำแหน่งไพ่ในสเปรดและความหมายตามตำรา". */
  computedFrom: string;
  confidence: TrustConfidence;
  /** Set only when an AI section actually rendered on the page. */
  aiUsed?: boolean;
  className?: string;
};

export function TrustPanel({ computedFrom, confidence, aiUsed = false, className }: TrustPanelProps) {
  return (
    <Card
      variant="sunk"
      data-testid="trust-panel"
      className={cn("space-y-1 text-[13px] leading-relaxed text-fg-muted", className)}
    >
      <p>คำนวณจาก: {computedFrom}</p>
      <p>
        ระดับความเชื่อมั่น: {confidence}
        {aiUsed ? " · AI ช่วยขยายความ" : ""}
      </p>
      <p>{TRUST_DISCLAIMER}</p>
    </Card>
  );
}
