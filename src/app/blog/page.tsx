import Link from "next/link";
import { getActiveCategories, getPublishedPosts } from "@/lib/blog";
import { blogJsonLd } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Blog",
  "Writing on law & policy, political philosophy, and Chamber notes from the Chamber of Praveen Kumar Gupta.",
  "/blog",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd(posts)) }}
      />
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
              ? "label-caps bg-gold-deep px-3 py-1 text-paper"
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
                ? "label-caps bg-gold-deep px-3 py-1 text-paper"
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
          {/* The most recent post is set wide and larger. An index of a dozen
              identical cards reads as a list; giving the lead its own weight
              makes the page read as edited. Only when nothing is filtered —
              a filtered view has no "latest" worth privileging. */}
          {filtered.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={
                i === 0 && !category
                  ? "group border border-line bg-paper p-8 transition-colors hover:border-gold-primary sm:col-span-2 lg:col-span-3"
                  : "group border border-line bg-paper p-6 transition-colors hover:border-gold-primary"
              }
            >
              <p className="label-caps text-xs text-gold-text">
                {post.category}
              </p>
              <h2
                className={
                  i === 0 && !category
                    ? "display-tight mt-2 max-w-[24ch] font-serif text-2xl font-semibold leading-[1.15] text-ivory group-hover:text-gold-text md:text-3xl"
                    : "mt-2 font-serif text-lg font-semibold text-ivory group-hover:text-gold-text"
                }
              >
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
              <p
                className={
                  i === 0 && !category
                    ? "mt-3 max-w-[68ch] text-base leading-relaxed text-charcoal"
                    : "mt-3 text-sm leading-relaxed text-charcoal"
                }
              >
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
