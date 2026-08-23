// The apex chamberpkg.in 308-redirects to the www host, so www is the origin
// that actually serves a 200. Emitting the apex made every sitemap entry, the
// metadataBase, and the url in the Attorney structured data point at a
// redirect. Normalise here so the canonical host is correct no matter what the
// deployment environment sets NEXT_PUBLIC_SITE_URL to.
const configured =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const siteUrl = configured.replace(
  /^https:\/\/chamberpkg\.in/,
  "https://www.chamberpkg.in",
);
