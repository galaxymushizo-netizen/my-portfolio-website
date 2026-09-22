import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell username={user.username}>{children}</AdminShell>;
}
