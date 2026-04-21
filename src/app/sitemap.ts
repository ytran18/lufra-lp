import type { MetadataRoute } from "next";

import { defaultSiteConfig } from "@/constants/default-site-config";
import { getAllPosts } from "@/lib/notion/notion-public";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = defaultSiteConfig.siteUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    const posts = await getAllPosts();
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.lastEditedTime
        ? new Date(post.lastEditedTime)
        : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    return [...staticRoutes, ...postRoutes];
  } catch (error) {
    console.error("[sitemap] failed to fetch posts:", error);
    return staticRoutes;
  }
}
