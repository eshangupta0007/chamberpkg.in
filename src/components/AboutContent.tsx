"use client";

import { useState } from "react";
import Image from "next/image";
import { LanguageToggle, type Lang } from "./LanguageToggle";
import { SealDivider } from "./SealDivider";
import { hiAbout } from "@/lib/i18n-hi";

// Legacy paragraph per build spec §4.2 — drafted for Eshan's review; confirm
// or revise before launch, and add any specific founding detail he wants reflected.
const legacyParagraph = `The Chamber of Praveen Kumar Gupta was established in 1991, built on a simple premise: that rigorous preparation and quiet discipline serve a client's interest better than performance ever could. Over three decades, that premise held through the ordinary and the difficult alike, across the district judiciary of Lucknow and the Allahabad High Court. Today, the Chamber continues under the stewardship of Eshan Kumar Gupta, Proprietor, carrying the same founding discipline into a practice built for the present, conducted with the same precision the name has stood for since 1991.`;

export function AboutContent() {
  const [lang, setLang] = useState<Lang>("en");
  const isHi = lang === "hi";

  return (
    <div
      className="relative mx-auto max-w-[90rem] px-6 py-16 md:px-10 lg:px-14 lg:py-24"
      lang={isHi ? "hi" : undefined}
    >
      {/* Two columns: a sticky title column carrying the heading and the
          signature block, and a reading column for the text and plate. */}
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-4 lg:block">
              <p className="label-caps text-xs text-gold-text">
                Chamber of Praveen Kumar Gupta
              </p>
              <div className="lg:mt-6">
                <LanguageToggle lang={lang} onChange={setLang} />
              </div>
            </div>
            <h1 className="display-tight mt-5 font-serif text-[clamp(2.5rem,5.2vw,4.75rem)] font-semibold leading-[0.98] text-ivory">
              {isHi ? hiAbout.heading : "About the Chamber"}
            </h1>
            <SealDivider className="mt-10 max-w-[14rem]" />
            <div className="mt-8">
              <p className="display-tight font-serif text-xl font-semibold text-ivory">
                {isHi ? hiAbout.name : "Eshan Kumar Gupta"}
              </p>
              <p className="label-caps mt-1 text-xs text-gold-text">
                {isHi ? hiAbout.proprietor : "Proprietor"}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {/* Drop cap on the Latin text only — a Devanagari initial carries
              matras above and below the line and does not set as a drop cap. */}
          <p
            className={`${isHi ? "" : "drop-cap "}text-lg leading-[1.75] text-charcoal md:text-xl`}
          >
            {isHi ? hiAbout.legacyParagraph : legacyParagraph}
          </p>

          <figure className="mt-12">
            <Image
              src="/images/allahabad-high-court.jpg"
              alt="The Allahabad High Court building"
              width={2400}
              height={1172}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="w-full border border-line object-cover"
              priority
            />
            <figcaption className="mt-3 text-xs leading-relaxed text-muted">
              {isHi ? (
                hiAbout.photoCaption
              ) : (
                <>
                  The Allahabad High Court. Photo by Subhashish Panigrahi,
                  licensed under{" "}
                  <a
                    href="https://creativecommons.org/licenses/by-sa/4.0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-gold-text"
                  >
                    CC BY-SA 4.0
                  </a>
                  .
                </>
              )}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
