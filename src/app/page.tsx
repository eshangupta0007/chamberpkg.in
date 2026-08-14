"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { SealDivider } from "@/components/SealDivider";
import { LanguageToggle, type Lang } from "@/components/LanguageToggle";
import { practiceAreas } from "@/lib/practice-areas";
import { team } from "@/lib/team";
import { attorneyJsonLd } from "@/lib/structured-data";
import { hiHome, hiPracticeAreas } from "@/lib/i18n-hi";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const isHi = lang === "hi";

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attorneyJsonLd()) }}
      />
      <section className="bg-ink">
        <div className="mx-auto max-w-[1200px] px-6 py-20 text-center">
          <div className="flex justify-center">
            <LanguageToggle lang={lang} onChange={setLang} />
          </div>
          <Image
            src="/images/logo-seal.png"
            alt="Chamber of Praveen Kumar Gupta seal"
            width={96}
            height={96}
            className="mx-auto mt-6 h-24 w-24"
            priority
          />
          <h1 className="mx-auto mt-6 max-w-[30ch] font-serif text-3xl font-semibold leading-tight text-ivory md:text-5xl">
            Chamber of Praveen Kumar Gupta
          </h1>
          <p className="mx-auto mt-4 max-w-[55ch] text-base text-charcoal md:text-lg">
            {isHi ? (
              hiHome.heroLine
            ) : (
              <>
                Advocates, Hon&rsquo;ble Supreme Court of India, Allahabad
                High Court, and District Courts, Uttar Pradesh. Established
                1991.
              </>
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link
              href="/practice-areas"
              className="rounded border border-line px-5 py-2.5 text-ivory hover:border-gold-primary hover:text-gold-text"
            >
              {isHi ? hiHome.ctaPractice : "View Practice Areas"}
            </Link>
            <Link
              href="/contact"
              className="rounded bg-cherry-red px-5 py-2.5 text-deep-text hover:bg-cherry-red-deep"
            >
              {isHi ? hiHome.ctaContact : "Contact the Chamber"}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 pt-10">
          <SealDivider className="mx-auto max-w-[480px]" />
        </div>
        <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-6 text-center">
          <p className="mx-auto max-w-[70ch] text-base leading-relaxed text-charcoal md:text-lg">
            {isHi ? (
              hiHome.legacyLine
            ) : (
              <>
                Established in 1991, the Chamber has practiced continuously
                across the district judiciary of Lucknow and the Allahabad
                High Court — today under the stewardship of Eshan Kumar
                Gupta, Proprietor.
              </>
            )}
          </p>
          <Link
            href="/about"
            className="mt-4 inline-block text-sm font-medium text-gold-text underline hover:text-gold-primary"
          >
            {isHi ? hiHome.historyLink : "Read the Chamber’s history →"}
          </Link>
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto max-w-[1200px] px-6 pt-10">
          <SealDivider className="mx-auto max-w-[480px]" />
        </div>
        <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-6">
          <h2 className="text-center font-serif text-2xl font-semibold text-ivory">
            {isHi ? hiHome.practiceHeading : "Areas of Practice"}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {practiceAreas.map((area, i) => (
              <Link
                key={area.slug}
                href={`/practice-areas#${area.slug}`}
                className="group rounded border border-line bg-paper p-6 transition-colors hover:border-gold-primary"
              >
                <p className="label-caps text-xs text-gold-text">
                  §{String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 font-serif text-lg font-semibold text-ivory group-hover:text-gold-text">
                  {isHi ? hiPracticeAreas[area.slug].title : area.title}
                </h3>
                <p className="mt-2 text-sm text-charcoal">
                  {isHi ? hiPracticeAreas[area.slug].summary : area.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 pt-10">
          <SealDivider className="mx-auto max-w-[480px]" />
        </div>
        <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-6">
          <h2 className="text-center font-serif text-2xl font-semibold text-ivory">
            {isHi ? hiHome.teamHeading : "The Chamber"}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Link
                key={member.slug}
                href={`/team#${member.slug}`}
                className="group overflow-hidden rounded border border-line bg-ink transition-colors hover:border-gold-primary"
              >
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={600}
                    height={750}
                    sizes="(max-width: 640px) 100vw, 280px"
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <PhotoPlaceholder className="aspect-[4/5] w-full" />
                )}
                <div className="p-4">
                  <p className="font-serif text-base font-semibold text-ivory group-hover:text-gold-text">
                    {member.name}
                  </p>
                  <p className="mt-1 text-xs text-charcoal">{member.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
