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

const wrap = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-14";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const isHi = lang === "hi";

  return (
    <div lang={isHi ? "hi" : undefined}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attorneyJsonLd()) }}
      />

      {/* Hero. The name of the chamber set at the largest scale on the site,
          flush left; the seal held to the right with a soft gilt bloom; the
          standing line and the two actions ruled off beneath. */}
      <section className={`${wrap} flex min-h-[calc(100svh-4.75rem)] flex-col pb-14 pt-8`}>
        <div className="rise rise-1 flex items-center justify-between gap-4">
          <p className="label-caps text-xs text-gold-text">
            {isHi ? "स्थापना 1991" : "Established 1991"}
          </p>
          <LanguageToggle lang={lang} onChange={setLang} />
        </div>

        <div className="mt-auto grid items-end gap-10 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <Image
              src="/images/logo-seal.png"
              alt="Chamber of Praveen Kumar Gupta seal"
              width={72}
              height={72}
              className="rise rise-2 gilt-glow mb-8 h-16 w-16 lg:hidden"
              priority
            />
            <h1 className="display-tight font-serif text-[clamp(3.1rem,10.5vw,9rem)] font-semibold leading-[0.92] text-ivory">
              <span className="rise rise-2 block">Chamber of</span>
              <span className="rise rise-3 block">Praveen Kumar</span>
              <span className="rise rise-4 block">Gupta</span>
            </h1>
          </div>
          <div className="rise rise-3 relative hidden justify-end lg:col-span-3 lg:flex">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold-primary/[0.13] blur-3xl"
            />
            <Image
              src="/images/logo-seal.png"
              alt="Chamber of Praveen Kumar Gupta seal"
              width={240}
              height={240}
              className="gilt-glow relative h-44 w-44 xl:h-56 xl:w-56"
              priority
            />
          </div>
        </div>

        <div className="rise rise-5 mt-12 grid gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:items-center">
          <p className="max-w-[40ch] text-lg leading-relaxed text-charcoal md:text-xl lg:col-span-6">
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
          <div className="flex flex-wrap items-center gap-4 lg:col-span-6 lg:justify-end">
            <Link
              href="/practice-areas"
              className="label-caps border border-line-strong px-6 py-3 text-sm text-ivory transition-colors hover:border-gold-primary hover:text-gold-text"
            >
              {isHi ? hiHome.ctaPractice : "View Practice Areas"}
            </Link>
            <Link
              href="/contact"
              className="label-caps bg-cherry-red px-6 py-3 text-sm text-deep-text transition-colors hover:bg-cherry-red-deep"
            >
              {isHi ? hiHome.ctaContact : "Contact the Chamber"}
            </Link>
          </div>
        </div>
      </section>

      {/* Legacy. Set as a single large statement beside a short marginal
          label, the way a foreword opens. */}
      <section className="border-t border-line bg-paper">
        <div className={`${wrap} grid gap-10 py-20 lg:grid-cols-12 lg:py-24`}>
          <div className="lg:col-span-3">
            <p className="label-caps text-xs text-gold-text">
              {isHi ? "स्थापना 1991" : "Since 1991"}
            </p>
            <SealDivider className="mt-6 max-w-[12rem]" />
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <p className="display-tight font-serif text-2xl font-semibold leading-[1.28] text-ivory md:text-[2.1rem] md:leading-[1.25]">
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
              className="label-caps mt-8 inline-block text-sm text-gold-text transition-colors hover:text-gold-bright"
            >
              {isHi ? hiHome.historyLink : "Read the Chamber’s history →"}
            </Link>
          </div>
        </div>
      </section>

      {/* Areas of practice, as the contents leaf of a bound volume: numeral,
          title, summary, in ruled rows. Nine entries, §01–§09. */}
      <section className={`${wrap} py-20 lg:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-tight font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.02] text-ivory">
            {isHi ? hiHome.practiceHeading : "Areas of Practice"}
          </h2>
          <p className="label-caps text-xs text-muted">§01 – §09</p>
        </div>

        <ol className="mt-10 border-t border-line">
          {practiceAreas.map((area, i) => {
            const n = String(i + 1).padStart(2, "0");
            const hi = hiPracticeAreas[area.slug];
            return (
              <li key={area.slug} className="border-b border-line">
                <Link
                  href={`/practice-areas#${area.slug}`}
                  className="group grid gap-x-8 gap-y-2 py-7 transition-colors hover:bg-paper md:-mx-4 md:grid-cols-12 md:items-baseline md:px-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-serif text-3xl font-semibold leading-none text-gold-primary/45 tabular-nums transition-colors group-hover:text-gold-primary md:col-span-2 md:text-5xl"
                  >
                    {n}
                  </span>
                  <h3 className="display-tight font-serif text-xl font-semibold leading-tight text-ivory transition-colors group-hover:text-gold-text md:col-span-5 md:text-[1.7rem]">
                    {isHi ? hi.title : area.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-charcoal md:col-span-4 md:text-base">
                    {isHi ? hi.summary : area.summary}
                  </p>
                  <span
                    aria-hidden="true"
                    className="hidden text-gold-primary/60 transition-all group-hover:translate-x-1 group-hover:text-gold-primary md:col-span-1 md:block md:text-right"
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* The Chamber. Portraits large, names beneath. */}
      <section className="border-t border-line bg-paper">
        <div className={`${wrap} py-20 lg:py-24`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-tight font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.02] text-ivory">
              {isHi ? hiHome.teamHeading : "The Chamber"}
            </h2>
            <Link
              href="/team"
              className="label-caps text-xs text-gold-text transition-colors hover:text-gold-bright"
            >
              {isHi ? "सभी सदस्य →" : "All members →"}
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <Link
                key={member.slug}
                href={`/team#${member.slug}`}
                className="group block"
              >
                <div className="overflow-hidden border border-line bg-ink transition-colors group-hover:border-gold-primary/70">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={600}
                      height={750}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="portrait-tone aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <PhotoPlaceholder className="aspect-[4/5] w-full" />
                  )}
                </div>
                <p className="display-tight mt-4 font-serif text-xl font-semibold text-ivory transition-colors group-hover:text-gold-text">
                  {member.name}
                </p>
                <p className="label-caps mt-1 text-xs text-gold-text">
                  {member.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
