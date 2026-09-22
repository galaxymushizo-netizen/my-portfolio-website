import { getSiteData } from "@/lib/data";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const data = await getSiteData();
  return <ProjectsManager projects={data.projects} />;
}
