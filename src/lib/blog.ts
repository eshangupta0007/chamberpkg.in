import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

/**
 * Canonical category order. This is the ORDER the filter chips appear in,
 * not the list that is rendered — the blog index shows only those with at
 * least one published post, so a category can never present the reader with
 * an empty result.
 */
export const categories = [
  "Law & Policy",
  "Political Philosophy",
  "Chamber Notes",
] as const;

export type Category = (typeof categories)[number];

export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
  readingTimeMinutes: number;
  /** Slug of a practice area this post is genuinely relevant to, if any. */
  relatedPracticeArea?: string;
};

const BLOG_DIR = path.join(process.cwd(), "content/blog");

async function readAllPosts(): Promise<
  (BlogPostSummary & { content: string; relatedPracticeArea?: string })[]
> {
  let files: string[];
  try {
    files = await readdir(BLOG_DIR);
  } catch {
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (file) => {
        const raw = await readFile(path.join(BLOG_DIR, file), "utf-8");
        const { data, content } = matter(raw);
        return {
          slug: file.replace(/\.md$/, ""),
          title: data.title ?? "",
          excerpt: data.excerpt ?? "",
          category: data.category ?? "Chamber Notes",
          date: data.date ?? "",
          relatedPracticeArea: data.relatedPracticeArea,
          content: content.trim(),
        };
      }),
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const posts = await readAllPosts();
  return posts.map(({ slug, title, excerpt, category, date }) => ({
    slug,
    title,
    excerpt,
    category,
    date,
  }));
}

/**
 * Categories that actually carry a published post, in canonical order, with
 * any category found only in frontmatter appended. Drives the filter chips
 * so none of them can lead to an empty page.
 */
export async function getActiveCategories(): Promise<string[]> {
  const posts = await readAllPosts();
  const present = new Set(posts.map((p) => p.category).filter(Boolean));
  const known = categories.filter((c) => present.has(c));
  const extra = [...present].filter(
    (c) => !categories.includes(c as (typeof categories)[number]),
  );
  return [...known, ...extra.sort()];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await readAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;

  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  return { ...post, readingTimeMinutes };
}
