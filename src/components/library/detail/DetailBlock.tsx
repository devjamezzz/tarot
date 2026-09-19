import { Card } from "@/components/ui/Card";

/** One labelled paragraph of a saved reading. `ai` tone marks AI-written text. */
export function DetailBlock({ title, body, tone = "default" }: { title: string; body?: string | null; tone?: "default" | "ai" }) {
  if (!body || !body.trim()) return null;
  return (
    <Card variant={tone === "ai" ? "sunk" : "default"}>
      <p className="eyebrow">{title}</p>
      <p className="mt-2 whitespace-pre-line text-base leading-[1.65] text-fg">{body}</p>
    </Card>
  );
}

export function TagList({ title, tags }: { title: string; tags: string[] }) {
  if (!tags.length) return null;
  return (
    <Card>
      <p className="eyebrow">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-pill border border-line px-2.5 py-0.5 text-[13px] text-fg-muted">
            {t}
          </span>
        ))}
      </div>
    </Card>
  );
}

export function NoSnapshotNote() {
  return <p className="text-[13px] text-fg-muted">รายการนี้ไม่มีข้อมูลฉบับเต็ม (อาจเป็นบันทึกเก่า)</p>;
}
