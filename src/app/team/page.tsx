import type { CSSProperties } from "react";
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
          <h1 className="display-tight mt-3 font-serif text-[clamp(2.1rem,4.2vw,3.6rem)] font-semibold leading-[0.95] text-ivory">
            Team
          </h1>
        </div>
        <p className="max-w-[48ch] text-base leading-relaxed text-charcoal lg:col-span-5 lg:pb-3">
          The Chamber&rsquo;s practice is carried by the advocates and
          associates below, under the direction of the Proprietor.
        </p>
      </div>

      <SealDivider className="mt-12" />

      <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, i) => (
          <article key={member.slug} id={member.slug} className="scroll-mt-28" data-reveal="img" style={{ "--reveal-delay": `${Math.min(i, 6) * 55}ms` } as CSSProperties}>
            <div className="overflow-hidden border border-line bg-paper transition-[border-color] duration-500 hover:border-gold-primary/60">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={600}
                  height={750}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="portrait-tone aspect-[4/5] w-full object-cover"
                  priority={i === 0}
                />
              ) : (
                <PhotoPlaceholder className="aspect-[4/5] w-full" />
              )}
            </div>
            <h2 className="display-tight mt-5 font-serif text-xl font-semibold text-ivory">
              {member.name}
            </h2>
            <p className="label-caps mt-1 text-xs text-gold-text">{member.title}</p>
            {member.practiceNote && (
              <p className="mt-4 text-base leading-relaxed text-charcoal">
                {member.practiceNote}
              </p>
            )}
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

      {/* Those who have been part of the Chamber before the present members:
          one statement, set like the legacy line on the home page. */}
      <div className="mt-24">
        <SealDivider className="max-w-[30rem]" />
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-12" data-reveal>
        <p className="label-caps text-xs text-gold-text lg:col-span-3">
          With gratitude
        </p>
        <p className="display-tight font-serif text-xl font-semibold leading-[1.3] text-ivory md:text-[1.6rem] md:leading-[1.28] lg:col-span-8 lg:col-start-5">
          The Chamber records its gratitude to every advocate, associate and
          intern who has been part of it since 1991, and on whose work its
          practice continues to stand.
        </p>
      </div>
    </div>
  );
}
