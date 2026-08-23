import type { NextConfig } from "next";

/**
 * Headers applied to every response. The site serves only its own content and
 * embeds Google Maps in iframes, so it can afford strict defaults: deny being
 * framed elsewhere, refuse MIME sniffing, send referrers only cross-origin as
 * a bare origin, and switch off device APIs the site never asks for.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
