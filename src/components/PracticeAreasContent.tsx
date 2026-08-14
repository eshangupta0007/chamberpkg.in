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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-caps text-xs text-gold-text">
            Chamber of Praveen Kumar Gupta
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
            {isHi ? "अभ्यास क्षेत्र" : "Practice Areas"}
          </h1>
        </div>
        <LanguageToggle lang={lang} onChange={setLang} />
      </div>

      {/* Set as an indexed document: the section numeral sits in its own rail
          in the margin, the way a printed statute carries its numbering, and
          the prose keeps a single readable measure beside it. */}
      <div className="mt-12 max-w-[52rem]">
        {practiceAreas.map((area, i) => {
          const hi = hiPracticeAreas[area.slug];
          const numeral = String(i + 1).padStart(2, "0");
          return (
            <div key={area.slug}>
              <section
                id={area.slug}
                className="scroll-mt-24 md:grid md:grid-cols-[5.5rem_1fr] md:gap-8"
              >
                <div className="md:pt-1">
                  <span
                    aria-hidden="true"
                    className="hidden font-serif text-[3.75rem] font-semibold leading-none text-gold-primary/25 md:block"
                  >
                    {numeral}
                  </span>
                  <p className="label-caps text-sm text-gold-text md:hidden">
                    §{numeral}
                  </p>
                </div>

                <div>
                  <h2 className="display-tight font-serif text-2xl font-semibold text-ivory">
                    {isHi ? hi.title : area.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-charcoal">
                    {isHi ? hi.description : area.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {(isHi ? hi.covers : area.covers).map((item) => (
                      <li
                        key={item}
                        className="border border-line bg-paper px-3 py-1 text-xs text-charcoal"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
              {i < practiceAreas.length - 1 && (
                <div className="py-12">
                  <SealDivider />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
