import type { MetadataRoute } from "next";
import hubs from "@/data/hubs.json";
import keywords from "@/data/keywords.json";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.domain.replace(/\/$/, "");
  const renewed = new Date("2026-09-30");

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: renewed,
      changeFrequency: "weekly",
      priority: 1.0
    },
    {
      url: `${base}/longterm-rent-guide`,
      lastModified: renewed,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${base}/hub`,
      lastModified: renewed,
      changeFrequency: "weekly",
      priority: 0.6
    }
  ];

  for (const hub of hubs as { slug: string }[]) {
    routes.push({
      url: `${base}/hub/${hub.slug}`,
      lastModified: renewed,
      changeFrequency: "weekly",
      priority: 0.7
    });
  }

  for (const item of keywords as { slug: string }[]) {
    routes.push({
      url: `${base}/${item.slug}`,
      lastModified: renewed,
      changeFrequency: "monthly",
      priority: 0.6
    });
  }

  return routes;
}

