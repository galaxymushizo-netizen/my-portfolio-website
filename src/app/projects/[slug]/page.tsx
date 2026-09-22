import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getProjectBySlug, getSiteData } from "@/lib/data";
import { DetailShell } from "@/components/DetailShell";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import type { Lang } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, data] = await Promise.all([getProjectBySlug(slug), getSiteData()]);
  if (!project) notFound();

  const related = data.projects.filter((p) => p.id !== project.id).slice(0, 3);
  const store = await cookies();
  const initialLang: Lang = store.get("galaxy_lang")?.value === "sw" ? "sw" : "en";

  return (
    <DetailShell
      name={data.profile.name}
      shortBio={data.profile.shortBio}
      initialLang={initialLang}
    >
      <ProjectDetail
        project={project}
        related={related}
        symbols={data.settings.symbols}
      />
    </DetailShell>
  );
}
