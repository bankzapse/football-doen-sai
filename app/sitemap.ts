import type { MetadataRoute } from "next";
import { getTournaments } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://doensai.fc";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tournaments = await getTournaments();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/live`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/venues`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/sponsors`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const tournamentPages: MetadataRoute.Sitemap = tournaments.map((t) => ({
    url: `${SITE_URL}/tournament/${t.slug}`,
    lastModified: t.match_start,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [...staticPages, ...tournamentPages];
}
