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
