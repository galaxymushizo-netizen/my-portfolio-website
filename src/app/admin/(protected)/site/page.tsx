import { getSiteData } from "@/lib/data";
import { SiteEditor } from "@/components/admin/SiteEditor";
import { LinksManager } from "@/components/admin/LinksManager";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  const data = await getSiteData();
  return (
    <>
      <SiteEditor initial={data.settings} />
      <LinksManager items={data.links} />
    </>
  );
}
