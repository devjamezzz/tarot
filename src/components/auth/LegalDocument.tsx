import * as React from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { AppBar } from "@/components/nav/AppBar";
import { Card } from "@/components/ui/Card";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalDocumentProps {
  title: string;
  /** Short line under the title, e.g. "ปรับปรุงล่าสุด 19 ก.ย. 2569". */
  caption?: string;
  sections: LegalSection[];
  /** Marks the text as a draft awaiting the owner's final wording. */
  draft?: boolean;
  backHref?: string;
}

/** Shared layout for /privacy and /terms: app bar → draft notice → sections. */
export function LegalDocument({
  title,
  caption,
  sections,
  draft = false,
  backHref = "/settings",
}: LegalDocumentProps) {
  return (
    <PageContainer variant="narrow">
      <AppBar label="ข้อมูลบริการ" title={title} caption={caption} backHref={backHref} />

      {draft ? (
        <Card variant="sunk" className="mt-2" data-testid="legal-draft-notice">
          <p className="eyebrow mb-1">ฉบับร่าง</p>
          <p className="text-sm text-fg-muted">
            เนื้อหานี้เป็นร่างเบื้องต้น ข้อความฉบับสมบูรณ์จะประกาศบนหน้านี้เมื่อพร้อม
          </p>
        </Card>
      ) : null}

      <div className="mt-4 space-y-4">
        {sections.map((section, index) => (
          <Card key={section.heading} data-testid="legal-section">
            <h2 className="font-display text-lg font-semibold text-fg">
              <span className="mr-2 text-gold">{index + 1}.</span>
              {section.heading}
            </h2>
            <div className="mt-2 space-y-2">
              {section.paragraphs.map((text) => (
                <p key={text} className="text-sm leading-relaxed text-fg-muted">
                  {text}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
