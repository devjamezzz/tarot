import { MessageCircle, ListChecks, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const STEPS = [
  { icon: MessageCircle, title: "ทัก LINE", text: "กดปุ่ม LINE ข้อความจะระบุชื่อแพ็กเกจให้อัตโนมัติ" },
  { icon: ListChecks, title: "แจ้งข้อมูล", text: "บอกคำถามหรือวันเกิด แล้วชำระเงินครั้งเดียวตามราคาที่แสดง" },
  { icon: Clock, title: "รอรับผล", text: "หมอดูตัวจริงอ่านและส่งผลตามระยะเวลาของแพ็กเกจ" },
] as const;

/** Three-step "how to book" block shared by /pricing and /pricing/[id]. */
export function BookingSteps({ className }: { className?: string }) {
  return (
    <Card variant="sunk" className={cn("space-y-3", className)} data-testid="pricing-booking-steps">
      <p className="eyebrow">วิธีจอง</p>
      <ol className="space-y-3">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-pill border border-line bg-surface text-gold">
              <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-fg">
                <span className="tabular-nums text-gold">{index + 1}.</span> {title}
              </p>
              <p className="text-[13px] leading-relaxed text-fg-muted">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
