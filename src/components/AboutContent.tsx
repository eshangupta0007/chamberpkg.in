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
      className="relative mx-auto max-w-[75ch] px-6 py-16"
      lang={isHi ? "hi" : undefined}
    >
      <div className="flex justify-between gap-4">
        <p className="label-caps text-xs text-gold-text">
          Chamber of Praveen Kumar Gupta
        </p>
        <LanguageToggle lang={lang} onChange={setLang} />
      </div>
      <h1 className="display-tight mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
        {isHi ? hiAbout.heading : "About the Chamber"}
      </h1>

      <div className="mt-8 space-y-4 text-base leading-relaxed text-charcoal">
        {/* Drop cap on the Latin text only — a Devanagari initial carries
            matras above and below the line and does not set as a drop cap. */}
        <p className={isHi ? undefined : "drop-cap"}>
          {isHi ? hiAbout.legacyParagraph : legacyParagraph}
        </p>
      </div>

      <figure className="mt-10">
        <Image
          src="/images/allahabad-high-court.jpg"
          alt="The Allahabad High Court building"
          width={2400}
          height={1172}
          sizes="(max-width: 900px) 100vw, 750px"
          className="w-full border border-line object-cover"
          priority
        />
        <figcaption className="mt-2 text-xs text-charcoal/90">
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

      <div className="mt-12">
        <SealDivider className="max-w-[320px]" />
      </div>
      <div className="mt-8">
        <p className="font-serif text-lg font-semibold text-ivory">
          {isHi ? hiAbout.name : "Eshan Kumar Gupta"}
        </p>
        <p className="mt-1 text-sm text-charcoal">
          {isHi ? hiAbout.proprietor : "Proprietor"}
        </p>
      </div>
    </div>
  );
}
