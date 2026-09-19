import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/PageContainer";
import { AppBar } from "@/components/nav/AppBar";
import { ProfileClient } from "@/app/profile/ProfileClient";

export const metadata: Metadata = {
  title: "บัญชีของฉัน",
  robots: { index: false, follow: false },
};

// Server component: session state stays inside the client component.
export default async function ProfilePage() {
  let version: string | undefined;
  try {
    const pkg = (await import("../../../package.json")).default as { version?: string };
    version = pkg.version;
  } catch {
    version = undefined;
  }

  return (
    <PageContainer variant="narrow">
      <AppBar label="บัญชี" title="บัญชีของฉัน" backHref="/settings" largeTitle />
      <ProfileClient version={version} />
    </PageContainer>
  );
}
