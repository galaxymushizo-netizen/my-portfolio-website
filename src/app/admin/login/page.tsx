import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/data";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (user) redirect("/admin");
  return <LoginForm />;
}
