import Link from "next/link";
import { getActiveCategories, getPublishedPosts } from "@/lib/blog";
import { blogJsonLd } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Blog",
  "Writing on law & policy, political philosophy, and Chamber notes from the Chamber of Praveen Kumar Gupta.",
  "/blog",
);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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

  // The most recent post leads, set wide and large, so the index reads as
  // edited rather than listed. A filtered view has no "latest" worth
  // privileging, so it lists evenly.
  const lead = !category && filtered.length > 0 ? filtered[0] : null;
  const rest = lead ? filtered.slice(1) : filtered;

  const chip = (active: boolean) =>
    active
      ? "label-caps bg-gold-deep px-3 py-1.5 text-xs text-paper"
      : "label-caps border border-line px-3 py-1.5 text-xs text-charcoal transition-colors hover:border-gold-primary hover:text-ivory";

  return (
    <div className="mx-auto max-w-[90rem] px-6 py-16 md:px-10 lg:px-14 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd(posts)) }}
      />
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p className="label-caps text-xs text-gold-text">
            Chamber of Praveen Kumar Gupta
          </p>
          <h1 className="display-tight mt-3 font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.95] text-ivory">
            Blog
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 lg:col-span-6 lg:justify-end lg:pb-3">
          <Link href="/blog" className={chip(!category)}>
            All
          </Link>
          {activeCategories.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${encodeURIComponent(cat)}`}
              className={chip(category === cat)}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        /* Two different empty states. A category with nothing in it is not the
           same as an empty blog, and saying so would be inaccurate wherever an
           old category link is still in circulation. */
        <div className="mt-16">
          {category && posts.length > 0 ? (
            <p className="text-lg text-charcoal">
              There are no posts under {category}.{" "}
              <Link
                href="/blog"
                className="text-gold-text underline hover:text-gold-bright"
              >
                View all posts
              </Link>
              .
            </p>
          ) : (
            <p className="text-lg text-charcoal">
              No posts published yet. Check back soon.
            </p>
          )}
        </div>
      ) : (
        <>
          {lead && (
            <Link
              href={`/blog/${lead.slug}`}
              className="group mt-14 grid gap-8 border-y border-line py-12 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-7">
                <p className="label-caps text-xs text-gold-text">{lead.category}</p>
                <h2 className="display-tight mt-4 font-serif text-[clamp(2rem,4.6vw,3.9rem)] font-semibold leading-[1.02] text-ivory transition-colors group-hover:text-gold-text">
                  {lead.title}
                </h2>
              </div>
              <div className="lg:col-span-5 lg:pt-9">
                {lead.date && (
                  <p className="text-sm text-muted">{formatDate(lead.date)}</p>
                )}
                <p className="mt-4 text-lg leading-[1.7] text-charcoal">
                  {lead.excerpt}
                </p>
                <span className="label-caps mt-6 inline-block text-xs text-gold-text transition-colors group-hover:text-gold-bright">
                  Read →
                </span>
              </div>
            </Link>
          )}

          <div className={`grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 ${lead ? "mt-14" : "mt-14 border-t border-line pt-12"}`}>
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group border-t border-line pt-6"
              >
                <p className="label-caps text-xs text-gold-text">{post.category}</p>
                <h2 className="display-tight mt-3 font-serif text-2xl font-semibold leading-[1.15] text-ivory transition-colors group-hover:text-gold-text">
                  {post.title}
                </h2>
                {post.date && (
                  <p className="mt-2 text-xs text-muted">{formatDate(post.date)}</p>
                )}
                <p className="mt-4 text-base leading-relaxed text-charcoal">
                  {post.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
