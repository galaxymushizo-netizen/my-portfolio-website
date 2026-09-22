import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getSiteData, getThoughtBySlug } from "@/lib/data";
import { DetailShell } from "@/components/DetailShell";
import { ThoughtDetail } from "@/components/sections/ThoughtDetail";
import type { Lang } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [thought, data] = await Promise.all([getThoughtBySlug(slug), getSiteData()]);
  if (!thought || !thought.published) notFound();

  const store = await cookies();
  const initialLang: Lang = store.get("galaxy_lang")?.value === "sw" ? "sw" : "en";

  return (
    <DetailShell
      name={data.profile.name}
      shortBio={data.profile.shortBio}
      initialLang={initialLang}
    >
      <ThoughtDetail thought={thought} name={data.profile.name} symbols={data.settings.symbols} />
    </DetailShell>
  );
}
