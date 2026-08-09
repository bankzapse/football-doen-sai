import type { MetadataRoute } from "next";
import { getTournaments } from "@/lib/data";
import { getTeams } from "@/lib/teams";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://doensai.fc";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tournaments, teams] = await Promise.all([getTournaments(), getTeams()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/live`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/results`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/teams`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/community`, changeFrequency: "daily", priority: 0.6 },
    { url: `${SITE_URL}/venues`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/sponsors`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const tournamentPages: MetadataRoute.Sitemap = tournaments.map((t) => ({
    url: `${SITE_URL}/tournament/${t.slug}`,
    lastModified: t.match_start,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const teamPages: MetadataRoute.Sitemap = teams.map((t) => ({
    url: `${SITE_URL}/teams/${t.id}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticPages, ...tournamentPages, ...teamPages];
}
