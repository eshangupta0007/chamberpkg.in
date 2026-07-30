import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/notion";
import { siteUrl } from "@/lib/site-url";

const staticRoutes = [
  "",
  "/about",
  "/team",
  "/practice-areas",
  "/where-we-practice",
  "/blog",
  "/internships",
  "/contact",
  "/disclaimer",
  "/privacy-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts().catch(() => []);

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const postEntries = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
  }));

  return [...staticEntries, ...postEntries];
}
