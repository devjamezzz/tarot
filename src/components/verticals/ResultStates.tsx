import Link from "next/link";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { ErrorDisplay } from "@/components/ui/ErrorDisplay";
import { PageContainer } from "@/components/ui/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";

export type ResultLoadingProps = {
  label: string;
  title: string;
  backHref: string;
};

/** Skeleton state shown while the client engine runs (and as the Suspense fallback). */
export function ResultLoading({ label, title, backHref }: ResultLoadingProps) {
  return (
    <PageContainer variant="narrow">
      <AppBar label={label} title={title} backHref={backHref} />
      <div className="mt-4 space-y-3" role="status" aria-live="polite">
        <span className="sr-only">กำลังโหลด…</span>
        <Skeleton className="h-32" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-24" />
      </div>
    </PageContainer>
  );
}

export type ResultErrorProps = {
  label: string;
  title: string;
  message: string;
  backHref: string;
  backLabel: string;
};

/** Missing/invalid query or engine failure: Thai message + a gold way back to the form. */
export function ResultError({ label, title, message, backHref, backLabel }: ResultErrorProps) {
  return (
    <PageContainer variant="narrow">
      <AppBar label={label} title={title} backHref={backHref} />
      <div className="mt-4 space-y-4" data-testid="result-error">
        <ErrorDisplay error={message} />
        <Button asChild variant="gold" size="lg" className="w-full">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
