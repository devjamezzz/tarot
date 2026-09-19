import * as React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight, ExternalLink, MessageCircle } from "lucide-react";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { LINE_OA_URL, SITE_NAME } from "@/lib/site";

export interface SettingsLink {
  href: string;
  label: string;
  desc?: string;
  icon: LucideIcon;
  external?: boolean;
}

const rowClass =
  "group flex min-h-[56px] items-center gap-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-card";

function RowBody({ label, desc, icon: Icon, external }: SettingsLink) {
  const Trailing = external ? ExternalLink : ChevronRight;
  return (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-pill border border-line-faint bg-sunk">
        <Icon className="size-5 text-gold" strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-fg transition-colors group-hover:text-gold">{label}</span>
        {desc ? <span className="mt-0.5 block text-[13px] text-fg-muted">{desc}</span> : null}
      </span>
      <Trailing className="size-5 shrink-0 text-fg-subtle" strokeWidth={1.5} aria-hidden="true" />
    </>
  );
}

/** A card listing navigation rows (icon · label · description · chevron). */
export function LinkListCard({
  title,
  links,
  className,
  testId,
}: {
  title?: string;
  links: SettingsLink[];
  className?: string;
  testId?: string;
}) {
  return (
    <Card className={className} data-testid={testId}>
      {title ? <p className="eyebrow mb-1">{title}</p> : null}
      <ul className="divide-y divide-line-faint">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
                <RowBody {...link} />
              </a>
            ) : (
              <Link href={link.href} className={rowClass}>
                <RowBody {...link} />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** "เกี่ยวกับ" card: app name, version and the LINE OA contact row. */
export function AboutCard({ version, className }: { version?: string; className?: string }) {
  return (
    <Card className={className} data-testid="about-card">
      <p className="eyebrow mb-1">เกี่ยวกับ</p>
      <CardTitle>{SITE_NAME}</CardTitle>
      <CardDesc className="mt-1">
        ดูดวงออนไลน์ ไพ่ทาโรต์ เซียมซี และโหราศาสตร์ไทย เพื่อการสะท้อนตนเอง
        {version ? ` · เวอร์ชัน ${version}` : ""}
      </CardDesc>
      <ul className="mt-2 divide-y divide-line-faint">
        <li>
          <a href={LINE_OA_URL} target="_blank" rel="noopener noreferrer" className={rowClass}>
            <RowBody
              href={LINE_OA_URL}
              label="ติดต่อเราทาง LINE"
              desc="สอบถามหรือแจ้งปัญหาการใช้งาน"
              icon={MessageCircle}
              external
            />
          </a>
        </li>
      </ul>
    </Card>
  );
}
