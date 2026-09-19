"use client";

import type { ReactNode } from "react";
import { AppBar } from "@/components/nav/AppBar";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import type { ReadingType } from "@/lib/reading/types";

export type VerticalFormShellProps = {
  /** Gold eyebrow, e.g. "โหราศาสตร์ราศี". */
  label: string;
  /** Trirong h1 owned by the AppBar. */
  title: string;
  caption?: string;
  backHref?: string;
  privacy?: { featureType: ReadingType; featureName: string };
  submitLabel: string;
  submitDisabled?: boolean;
  onSubmit: () => void;
  /** Optional ghost action rendered left of the submit button. */
  secondary?: ReactNode;
  /** Form fields (rendered inside the <form>). */
  children: ReactNode;
  showFeatureMenu?: boolean;
};

/**
 * Shared frame for every vertical's input page: app bar → form → sticky gold
 * submit bar (sits above the BottomTabBar: 56px + safe-area) → feature menu.
 * No FAB here — it would cover the submit button on a 390px screen.
 */
export function VerticalFormShell({
  label,
  title,
  caption,
  backHref,
  privacy,
  submitLabel,
  submitDisabled = false,
  onSubmit,
  secondary,
  children,
  showFeatureMenu = true,
}: VerticalFormShellProps) {
  return (
    <PageContainer variant="narrow">
      {privacy ? (
        <PrivacyNotice featureType={privacy.featureType} featureName={privacy.featureName} />
      ) : null}
      <AppBar label={label} title={title} caption={caption} backHref={backHref} />

      <form
        noValidate
        className="mt-4 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {children}

        <div className="sticky above-tabbar z-40 -mx-4 border-t border-line-faint bg-bg/90 px-4 pb-3 pt-3 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-3">
            {secondary}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              disabled={submitDisabled}
              data-testid="vertical-submit"
              className="min-w-0 flex-1 px-4"
            >
              {submitLabel}
            </Button>
          </div>
        </div>
      </form>

      {showFeatureMenu ? <FeatureMenu className="mt-8" /> : null}
    </PageContainer>
  );
}
