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

      <div className="mt-12">
        {practiceAreas.map((area, i) => {
          const hi = hiPracticeAreas[area.slug];
          return (
            <div key={area.slug}>
              <section id={area.slug}>
                <p className="label-caps text-sm text-gold-text">
                  §{String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-1.5 font-serif text-2xl font-semibold text-ivory">
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
              {i < practiceAreas.length - 1 && (
                <div className="py-12">
                  <SealDivider className="max-w-[480px]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
