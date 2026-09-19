"use client";

import * as React from "react";
import { Bookmark, Package, ShieldCheck, FileText, Users } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SessionCard } from "@/components/auth/SessionCard";
import { LinkListCard, AboutCard, type SettingsLink } from "@/components/auth/SettingsRows";

const PROFILE_LINKS: SettingsLink[] = [
  { href: "/library/saved", label: "บันทึกของฉัน", desc: "ไพ่และผลดูดวงที่บันทึกไว้", icon: Bookmark },
  { href: "/pricing", label: "แพ็กเกจ", desc: "ดูหรืออัปเกรดแพ็กเกจของคุณ", icon: Package },
  { href: "/privacy", label: "ความเป็นส่วนตัว", desc: "นโยบายการเก็บและใช้ข้อมูล", icon: ShieldCheck },
  { href: "/terms", label: "ข้อกำหนด", desc: "เงื่อนไขการใช้บริการ", icon: FileText },
];

const ADMIN_LINKS: SettingsLink[] = [
  { href: "/admin/customers", label: "ลูกค้า (CRM)", desc: "รายชื่อสมาชิกและเครดิต", icon: Users },
];

export function ProfileClient({ version }: { version?: string }) {
  const { user } = useAuth();

  return (
    <div className="mt-2 space-y-4">
      <SessionCard />
      <LinkListCard title="เมนู" links={PROFILE_LINKS} testId="profile-menu" />
      {user?.isAdmin ? (
        <LinkListCard title="ผู้ดูแลระบบ" links={ADMIN_LINKS} testId="profile-admin" />
      ) : null}
      <AboutCard version={version} />
    </div>
  );
}
