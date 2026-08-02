import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { team } from "@/lib/team";
import { teamJsonLd } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Team",
  "The advocates and associates of the Chamber of Praveen Kumar Gupta.",
);

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamJsonLd(team)) }}
      />
      <p className="text-xs uppercase tracking-wide text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
        Team
      </h1>

      <p className="mt-6 max-w-[70ch] text-base leading-relaxed text-charcoal">
        The Chamber&rsquo;s practice is carried by the advocates and associates
        below, under the direction of the Proprietor.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member) => (
          <div
            key={member.slug}
            className="overflow-hidden rounded border border-line bg-paper"
          >
            <PhotoPlaceholder className="aspect-[4/5] w-full" />
            <div className="p-5">
              <h2 className="font-serif text-lg font-semibold text-ivory">
                {member.name}
              </h2>
              <p className="mt-0.5 text-sm text-gold-text">{member.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">
                {member.practiceNote}
              </p>
              {member.courts && (
                <ul className="mt-3 space-y-1 border-t border-line pt-3 text-xs text-charcoal/80">
                  {member.courts.map((court) => (
                    <li key={court}>{court}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
