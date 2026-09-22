import { getSiteData } from "@/lib/data";
import { ThoughtsManager } from "@/components/admin/ThoughtsManager";

export const dynamic = "force-dynamic";

export default async function AdminThoughtsPage() {
  const data = await getSiteData();
  return <ThoughtsManager thoughts={data.thoughts} />;
}
