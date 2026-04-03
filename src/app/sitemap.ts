import type { MetadataRoute } from "next";
import { HOME_CAROUSEL_CATEGORIES } from "@/lib/portfolio-data";
import { createPublicClient } from "@/lib/supabase/public";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/noticias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/sobre-mi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/aviso-legal`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const portfolioRoutes: MetadataRoute.Sitemap = HOME_CAROUSEL_CATEGORIES.map((category) => ({
    url: `${SITE_URL}/portfolio/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  let newsRoutes: MetadataRoute.Sitemap = [];

  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from("news_posts").select("slug, created_at");

    newsRoutes = (data ?? []).map((post) => ({
      url: `${SITE_URL}/noticias/${post.slug}`,
      lastModified: post.created_at ? new Date(post.created_at) : now,
      changeFrequency: "daily",
      priority: 0.75,
    }));
  } catch {
    newsRoutes = [];
  }

  return [...staticRoutes, ...portfolioRoutes, ...newsRoutes];
}
