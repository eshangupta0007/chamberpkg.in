import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { practiceAreas } from "@/lib/practice-areas";
import { SealDivider } from "@/components/SealDivider";
import { blogPostingJsonLd } from "@/lib/structured-data";

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
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `/blog/${slug}`,
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

  return (
    <article className="mx-auto max-w-[74ch] px-6 py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(post)) }}
      />
      <p className="label-caps text-xs text-gold-text">
        {post.category}
      </p>
      <h1 className="display-tight mt-4 font-serif text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.05] text-ivory">
        {post.title}
      </h1>
      <p className="mt-5 text-sm text-muted">
        {post.date &&
          new Date(post.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        {post.date && " · "}
        {post.readingTimeMinutes} min read
      </p>

      <div className="drop-cap-first prose prose-invert prose-lg mt-12 max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-ivory prose-p:text-charcoal prose-li:text-charcoal prose-strong:text-ivory prose-em:text-charcoal prose-a:text-gold-text prose-a:decoration-gold-primary/40 prose-blockquote:border-l-gold-primary prose-blockquote:text-charcoal prose-hr:border-line prose-code:text-ivory prose-th:text-ivory prose-td:text-charcoal">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <div className="mt-10">
        <SealDivider className="max-w-[20rem]" />
      </div>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span className="label-caps text-muted">Related:</span>
        {relatedArea && (
          <Link
            href={`/practice-areas#${relatedArea.slug}`}
            className="text-gold-text underline hover:text-gold-primary"
          >
            {relatedArea.title}
          </Link>
        )}
        <Link
          href="/publications"
          className="text-gold-text underline hover:text-gold-primary"
        >
          Publications
        </Link>
      </div>
    </article>
  );
}
