import type { Metadata } from "next";

/**
 * Per-page metadata. `path` sets the canonical URL and og:url — without it a
 * page carries neither, which leaves search engines to guess which host and
 * path is authoritative. Pass the route ("/about"); omit for the home page.
 */
export function pageMetadata(
  title: string,
  description: string,
  path = "/",
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}
