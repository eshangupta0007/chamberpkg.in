import Link from "next/link";
import { categories, getPublishedPosts } from "@/lib/notion";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Blog",
  "Writing on law & policy, Jyotish, political philosophy, and Chamber notes from the Chamber of Praveen Kumar Gupta.",
);

export const revalidate = 3600;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getPublishedPosts();
  const filtered = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink md:text-4xl">
        Blog
      </h1>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/blog"
          className={
            !category
              ? "rounded-full bg-ink px-3 py-1 text-ivory"
              : "rounded-full border border-line px-3 py-1 text-charcoal hover:border-gold-primary"
          }
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}`}
            className={
              category === cat
                ? "rounded-full bg-ink px-3 py-1 text-ivory"
                : "rounded-full border border-line px-3 py-1 text-charcoal hover:border-gold-primary"
            }
          >
            {cat}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-base text-charcoal/70">
          No posts published yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded border border-line bg-paper p-6 transition-colors hover:border-gold-primary"
            >
              <p className="text-xs uppercase tracking-wide text-gold-text">
                {post.category}
              </p>
              <h2 className="mt-2 font-serif text-lg font-semibold text-ink group-hover:text-gold-text">
                {post.title}
              </h2>
              {post.date && (
                <p className="mt-1 text-xs text-charcoal/70">
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
              <p className="mt-3 text-sm leading-relaxed text-charcoal">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
