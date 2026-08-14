import Link from "next/link";
import { getActiveCategories, getPublishedPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Blog",
  "Writing on law & policy, Jyotish, political philosophy, and Chamber notes from the Chamber of Praveen Kumar Gupta.",
);

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [posts, activeCategories] = await Promise.all([
    getPublishedPosts(),
    getActiveCategories(),
  ]);
  const filtered = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <p className="label-caps text-xs text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
        Blog
      </h1>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/blog"
          className={
            !category
              ? "label-caps bg-gold-primary px-3 py-1 text-ivory"
              : "label-caps border border-line px-3 py-1 text-charcoal hover:border-gold-primary"
          }
        >
          All
        </Link>
        {activeCategories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}`}
            className={
              category === cat
                ? "label-caps bg-gold-primary px-3 py-1 text-ivory"
                : "label-caps border border-line px-3 py-1 text-charcoal hover:border-gold-primary"
            }
          >
            {cat}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        /* Two different empty states. A category with nothing in it is not the
           same as an empty blog, and saying so would be inaccurate wherever an
           old category link is still in circulation. */
        <div className="mt-16">
          {category && posts.length > 0 ? (
            <p className="text-base text-charcoal/90">
              There are no posts under {category}.{" "}
              <Link
                href="/blog"
                className="text-gold-text underline hover:text-gold-primary"
              >
                View all posts
              </Link>
              .
            </p>
          ) : (
            <p className="text-base text-charcoal/90">
              No posts published yet. Check back soon.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group border border-line bg-paper p-6 transition-colors hover:border-gold-primary"
            >
              <p className="label-caps text-xs text-gold-text">
                {post.category}
              </p>
              <h2 className="mt-2 font-serif text-lg font-semibold text-ivory group-hover:text-gold-text">
                {post.title}
              </h2>
              {post.date && (
                <p className="mt-1 text-xs text-charcoal/90">
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
