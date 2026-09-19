import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";

/** Suspense fallback for the /tarot start flow (useSearchParams). */
export function TarotStartSkeleton() {
  return (
    <PageContainer variant="narrow">
      <div className="px-1 pt-6" aria-busy="true" aria-label="กำลังโหลด">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-8 w-3/4" />
        <div className="mt-8 grid grid-cols-2 gap-2 sm:flex">
          <Skeleton className="h-11 rounded-pill sm:w-28" />
          <Skeleton className="h-11 rounded-pill sm:w-28" />
          <Skeleton className="h-11 rounded-pill sm:w-28" />
          <Skeleton className="h-11 rounded-pill sm:w-28" />
        </div>
        <Skeleton className="mt-8 h-24 w-full" />
        <Skeleton className="mt-8 h-28 w-full" />
        <Skeleton className="mt-3 h-28 w-full" />
      </div>
    </PageContainer>
  );
}
