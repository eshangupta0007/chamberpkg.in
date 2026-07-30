// Set NEXT_PUBLIC_SITE_URL once the domain is registered (spec §5.2); falls
// back to localhost so sitemap/robots/metadata still work in development.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
