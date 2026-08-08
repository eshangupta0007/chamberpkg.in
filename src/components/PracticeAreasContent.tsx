"use client";

import { useState } from "react";
import { LanguageToggle, type Lang } from "./LanguageToggle";
import { practiceAreas } from "@/lib/practice-areas";
import { hiPracticeAreas } from "@/lib/i18n-hi";

export function PracticeAreasContent() {
  const [lang, setLang] = useState<Lang>("en");
  const isHi = lang === "hi";

  return (
    <div lang={isHi ? "hi" : undefined}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gold-text">
            Chamber of Praveen Kumar Gupta
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
            {isHi ? "अभ्यास क्षेत्र" : "Practice Areas"}
          </h1>
        </div>
        <LanguageToggle lang={lang} onChange={setLang} />
      </div>

      <div className="mt-12 space-y-12">
        {practiceAreas.map((area) => {
          const hi = hiPracticeAreas[area.slug];
          return (
            <section
              key={area.slug}
              id={area.slug}
              className="border-b border-line pb-12 last:border-b-0"
            >
              <h2 className="font-serif text-2xl font-semibold text-ivory">
                {isHi ? hi.title : area.title}
              </h2>
              <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-charcoal">
                {isHi ? hi.description : area.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(isHi ? hi.covers : area.covers).map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-charcoal"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
