"use client";

import { useState } from "react";
import { LanguageToggle, type Lang } from "./LanguageToggle";
import { SealDivider } from "./SealDivider";
import { practiceAreas } from "@/lib/practice-areas";
import { hiPracticeAreas } from "@/lib/i18n-hi";

export function PracticeAreasContent() {
  const [lang, setLang] = useState<Lang>("en");
  const isHi = lang === "hi";

  return (
    <div lang={isHi ? "hi" : undefined}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="label-caps text-xs text-gold-text">
            Chamber of Praveen Kumar Gupta
          </p>
          <h1 className="display-tight mt-3 font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.95] text-ivory">
            {isHi ? "अभ्यास क्षेत्र" : "Practice Areas"}
          </h1>
        </div>
        <div className="flex items-center gap-6 lg:col-span-4 lg:justify-end lg:pb-3">
          <p className="label-caps text-xs text-muted">§01 – §09</p>
          <LanguageToggle lang={lang} onChange={setLang} />
        </div>
      </div>

      {/* Set as an indexed document: the section numeral sits in its own rail
          in the margin, the way a printed statute carries its numbering, and
          the prose keeps a single readable measure beside it. */}
      <div className="mt-16 max-w-[64rem]">
        {practiceAreas.map((area, i) => {
          const hi = hiPracticeAreas[area.slug];
          const numeral = String(i + 1).padStart(2, "0");
          return (
            <div key={area.slug}>
              <section
                id={area.slug}
                className="scroll-mt-28 md:grid md:grid-cols-[7rem_1fr] md:gap-10"
              >
                <div className="md:pt-2">
                  <span
                    aria-hidden="true"
                    className="hidden font-serif text-[4.5rem] font-semibold leading-none text-gold-primary/40 tabular-nums md:block"
                  >
                    {numeral}
                  </span>
                  <p className="label-caps text-sm text-gold-text md:hidden">
                    §{numeral}
                  </p>
                </div>

                <div>
                  <h2 className="display-tight font-serif text-[1.9rem] font-semibold leading-[1.08] text-ivory md:text-[2.25rem]">
                    {isHi ? hi.title : area.title}
                  </h2>
                  <p className="mt-4 max-w-[62ch] text-lg leading-[1.7] text-charcoal">
                    {isHi ? hi.description : area.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {(isHi ? hi.covers : area.covers).map((item) => (
                      <li
                        key={item}
                        className="border border-line bg-paper px-3 py-1.5 text-xs text-charcoal"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
              {i < practiceAreas.length - 1 && (
                <div className="py-14">
                  <SealDivider className="max-w-[30rem]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
