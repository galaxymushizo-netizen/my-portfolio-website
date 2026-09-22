import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AccountForm } from "@/components/admin/AccountForm";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await requireAdmin();
  const [row] = await db.select().from(users).where(eq(users.id, session.id)).limit(1);
  return <AccountForm email={row?.email ?? ""} username={row?.username ?? ""} />;
}
