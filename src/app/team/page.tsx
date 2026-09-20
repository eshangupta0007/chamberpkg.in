import Image from "next/image";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { SealDivider } from "@/components/SealDivider";
import { team } from "@/lib/team";
import { teamJsonLd } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Team",
  "The advocates and associates of the Chamber of Praveen Kumar Gupta.",
  "/team",
);

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-6 py-16 md:px-10 lg:px-14 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamJsonLd(team)) }}
      />
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label-caps text-xs text-gold-text">
            Chamber of Praveen Kumar Gupta
          </p>
          <h1 className="display-tight mt-3 font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.95] text-ivory">
            Team
          </h1>
        </div>
        <p className="max-w-[48ch] text-lg leading-relaxed text-charcoal lg:col-span-5 lg:pb-3">
          The Chamber&rsquo;s practice is carried by the advocates and
          associates below, under the direction of the Proprietor.
        </p>
      </div>

      <SealDivider className="mt-12" />

      <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member) => (
          <article key={member.slug} id={member.slug} className="scroll-mt-28">
            <div className="overflow-hidden border border-line bg-paper">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={600}
                  height={750}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="portrait-tone aspect-[4/5] w-full object-cover"
                />
              ) : (
                <PhotoPlaceholder className="aspect-[4/5] w-full" />
              )}
            </div>
            <h2 className="display-tight mt-5 font-serif text-2xl font-semibold text-ivory">
              {member.name}
            </h2>
            <p className="label-caps mt-1 text-xs text-gold-text">{member.title}</p>
            <p className="mt-4 text-base leading-relaxed text-charcoal">
              {member.practiceNote}
            </p>
            {member.courts && (
              <ul className="mt-4 space-y-1 border-t border-line pt-4 text-sm text-muted">
                {member.courts.map((court) => (
                  <li key={court}>{court}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
