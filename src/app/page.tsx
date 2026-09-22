import { cookies } from "next/headers";
import { getSiteData } from "@/lib/data";
import { SiteExperience } from "@/components/SiteExperience";
import type { Lang } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const data = await getSiteData();
  return {
    title: data.settings.siteTitle,
    description: data.settings.siteDescription.en,
  };
}

export default async function HomePage() {
  const data = await getSiteData();
  const store = await cookies();
  const initialLang: Lang = store.get("galaxy_lang")?.value === "sw" ? "sw" : "en";
  return <SiteExperience data={data} initialLang={initialLang} />;
}
