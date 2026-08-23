import { addresses, email, phones, siteName } from "./site-data";
import { siteUrl } from "./site-url";
import { practiceAreas } from "./practice-areas";
import type { TeamMember } from "./team";

export function attorneyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Attorney", "LegalService", "Organization"],
    name: siteName,
    url: siteUrl,
    email,
    telephone: phones.map((p) => `+91${p.number}`),
    foundingDate: "1991",
    address: addresses.map((addr) => ({
      "@type": "PostalAddress",
      name: addr.label,
      streetAddress: addr.lines.join(", "),
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    })),
    areaServed: {
      "@type": "State",
      name: "Uttar Pradesh",
    },
    // Same hours every day, so one specification covers the week. This is
    // what search results read to show opening hours.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
    knowsAbout: practiceAreas.map((area) => area.title),
  };
}

export function teamJsonLd(team: TeamMember[]) {
  return {
    "@context": "https://schema.org",
    "@graph": team.map((member) => ({
      "@type": "Person",
      name: member.name,
      jobTitle: member.title,
      worksFor: {
        "@type": "Attorney",
        name: siteName,
      },
    })),
  };
}

/** Article schema for a single blog post. */
export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date || undefined,
    articleSection: post.category,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    url: `${siteUrl}/blog/${post.slug}`,
    inLanguage: "en-IN",
    author: { "@type": "Person", name: "Eshan Kumar Gupta" },
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
  };
}

/** The blog itself, listing its posts. */
export function blogJsonLd(posts: { slug: string; title: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteName} — Blog`,
    url: `${siteUrl}/blog`,
    inLanguage: "en-IN",
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${siteUrl}/blog/${p.slug}`,
    })),
  };
}

/**
 * The draft statute. Typed as Legislation, schema.org's type for a legal
 * instrument, rather than Book — it is a proposal, not a published volume.
 */
export function publicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: "The Artificial Intelligence Code, 2026",
    alternateName:
      "The Artificial Intelligence (Regulation of Use and Prevention of Misuse) Act, 2026",
    legislationType: "Draft legislative proposal",
    jurisdiction: { "@type": "AdministrativeArea", name: "India" },
    inLanguage: "en-IN",
    url: `${siteUrl}/publications`,
    author: { "@type": "Person", name: "Eshan Kumar Gupta" },
    creator: { "@type": "Person", name: "Eshan Kumar Gupta" },
    numberOfPages: undefined,
    description:
      "A draft statute allocating liability across the persons who design, train, deploy, and profit from an AI system. 60 sections across 11 chapters and 3 Schedules.",
  };
}

/** The contact page, tied back to the chamber entity. */
export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Attorney",
      name: siteName,
      url: siteUrl,
      email,
      telephone: phones.map((p) => `+91${p.number}`),
    },
  };
}
