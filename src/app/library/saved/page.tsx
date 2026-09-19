import type { Metadata } from "next";
import { Suspense } from "react";
import { AppBar } from "@/components/nav/AppBar";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";
import SavedClient from "./savedClient";

export const metadata: Metadata = {
  title: "คลังคำทำนายของฉัน — บันทึกผลการดูดวง",
  description: "ดูบันทึกผลการดูดวงที่คุณเคยทำไว้ ทาโรต์ ดวงชะตา ความรัก ราศีจีน และอื่น ๆ",
  robots: { index: false, follow: true },
};

export default function SavedReadingsPage() {
  return (
    <Suspense
      fallback={
        <PageContainer variant="narrow">
          <AppBar label="คลังของฉัน" title="บันทึก" caption="กำลังโหลด…" />
          <div className="mt-4 space-y-3" aria-busy="true">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </PageContainer>
      }
    >
      <SavedClient />
    </Suspense>
  );
}
