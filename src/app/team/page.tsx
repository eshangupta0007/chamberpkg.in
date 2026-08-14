import Image from "next/image";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { SealDivider } from "@/components/SealDivider";
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
      <p className="label-caps text-xs text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
        Team
      </h1>

      <p className="mt-6 max-w-[70ch] text-base leading-relaxed text-charcoal">
        The Chamber&rsquo;s practice is carried by the advocates and associates
        below, under the direction of the Proprietor.
      </p>

      <div className="mt-10">
        <SealDivider className="max-w-[480px]" />
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member) => (
          <div
            key={member.slug}
            id={member.slug}
            className="overflow-hidden border border-line bg-paper"
          >
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                width={600}
                height={750}
                sizes="(max-width: 640px) 100vw, 280px"
                className="portrait-tone aspect-[4/5] w-full object-cover"
              />
            ) : (
              <PhotoPlaceholder className="aspect-[4/5] w-full" />
            )}
            <div className="p-5">
              <h2 className="font-serif text-lg font-semibold text-ivory">
                {member.name}
              </h2>
              <p className="label-caps mt-0.5 text-xs text-gold-text">{member.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">
                {member.practiceNote}
              </p>
              {member.courts && (
                <ul className="mt-3 space-y-1 border-t border-line pt-3 text-xs text-charcoal/90">
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
