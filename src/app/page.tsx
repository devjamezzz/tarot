"use client";

import { useEffect } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { SocialFooter } from "@/components/ui/SocialFooter";
import { HomeAppBar } from "@/components/home/HomeAppBar";
import { HeroQuestion } from "@/components/home/HeroQuestion";
import { BirthdayTeaser } from "@/components/home/BirthdayTeaser";
import { DailyWidgets } from "@/components/home/DailyWidgets";
import { ConsultTeaser } from "@/components/home/ConsultTeaser";
import { SocialProof } from "@/components/home/SocialProof";
import { PackageCards } from "@/components/home/PackageCards";
import { trackEvent } from "@/lib/analytics/tracking";

/** Desktop rail: daily widgets + fortune-teller teaser, sticky as one block. */
function HomeAside() {
  return (
    <div className="hidden md:sticky md:top-6 md:block">
      <DailyWidgets />
      <ConsultTeaser className="mt-6" />
    </div>
  );
}

/**
 * Intent-first home (brief §2.1): question hero → birthday teaser → daily
 * widgets → social proof → fortune-teller packages. On md+ the daily widgets
 * move into the 360px aside (with the ConsultTeaser below them so the rail is
 * never empty on the fold); the mobile copy is hidden there.
 */
export default function Home() {
  useEffect(() => {
    trackEvent("landing_view", { step: "home" });
  }, []);

  return (
    <main className="min-h-screen">
      <PageContainer variant="wide" aside={<HomeAside />}>
        <HomeAppBar />
        <HeroQuestion className="mt-4" />
        <BirthdayTeaser className="mt-8" />
        <DailyWidgets className="mt-8 md:hidden" />
        <SocialProof className="mt-8" />
        <PackageCards className="mt-8" />
        <SocialFooter />
      </PageContainer>
    </main>
  );
}
