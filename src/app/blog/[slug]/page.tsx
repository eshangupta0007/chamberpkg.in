import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { practiceAreas } from "@/lib/practice-areas";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

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

  const relatedArea = post.relatedPracticeArea
    ? practiceAreas.find((a) => a.slug === post.relatedPracticeArea)
    : undefined;
  const showPublicationsLink = post.category === "Law & Policy";

  return (
    <article className="mx-auto max-w-[75ch] px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-gold-text">
        {post.category}
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-charcoal/90">
        {post.date &&
          new Date(post.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        {post.date && " · "}
        {post.readingTimeMinutes} min read
      </p>

      <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-serif prose-headings:text-ivory prose-a:text-gold-text">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      {(relatedArea || showPublicationsLink) && (
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-sm">
          <span className="text-charcoal/90">Related:</span>
          {relatedArea && (
            <Link
              href={`/practice-areas#${relatedArea.slug}`}
              className="text-gold-text underline hover:text-gold-primary"
            >
              {relatedArea.title}
            </Link>
          )}
          {showPublicationsLink && (
            <Link
              href="/publications"
              className="text-gold-text underline hover:text-gold-primary"
            >
              Publications
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
