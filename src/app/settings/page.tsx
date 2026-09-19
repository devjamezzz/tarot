import type { Metadata } from "next";
import { PageContainer } from "@/components/ui/PageContainer";
import { AppBar } from "@/components/nav/AppBar";
import { SettingsHubClient } from "@/components/auth/SettingsHubClient";

export const metadata: Metadata = {
  title: "ตั้งค่า",
  robots: { index: false, follow: false },
};

async function readAppVersion(): Promise<string | undefined> {
  try {
    const pkg = (await import("../../../package.json")).default as { version?: string };
    return pkg.version;
  } catch {
    return undefined;
  }
}

/** Account & settings hub — target of the ตั้งค่า tab. */
export default async function SettingsPage() {
  const version = await readAppVersion();

  return (
    <PageContainer variant="wide">
      <AppBar
        label="บัญชี"
        title="ตั้งค่า"
        caption="บัญชี แพ็กเกจ และข้อมูลของแอป"
        largeTitle
      />
      <div className="mt-2">
        <SettingsHubClient version={version} />
      </div>
    </PageContainer>
  );
}
