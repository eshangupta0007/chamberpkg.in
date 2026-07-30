import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug } from "@/lib/notion";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-[75ch] px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-gold-text">
        {post.category}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-charcoal/70">
        {post.date &&
          new Date(post.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        {post.date && " · "}
        {post.readingTimeMinutes} min read
      </p>

      <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-serif prose-headings:text-ink prose-a:text-gold-text">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
