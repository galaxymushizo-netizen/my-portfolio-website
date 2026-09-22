import { getSiteData } from "@/lib/data";
import { ProfileEditor } from "@/components/admin/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const data = await getSiteData();
  return (
    <ProfileEditor profile={data.profile} timeline={data.timeline} skills={data.skills} />
  );
}
