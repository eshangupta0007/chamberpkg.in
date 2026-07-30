import { practiceAreas } from "@/lib/practice-areas";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Practice Areas",
  "Criminal, Constitutional & Writ, and Civil litigation practised by the Chamber of Praveen Kumar Gupta.",
);

// Specialization narrative per build spec §4.4 — drafted for Eshan's review;
// this is institutional-strategy framing, so he should confirm the reasoning
// reads accurately before launch.
const specializationNarrative = `The Chamber has, since 1991, concentrated its practice in these three areas rather than extending into every available forum or subject matter. That concentration reflects a working view that depth in litigation is built through sustained, repeated engagement with a defined set of courts and procedures, rather than distributed thinly across unrelated practice areas. Matters outside criminal, constitutional and writ, and civil litigation are, as a rule, not undertaken.`;

export default function PracticeAreasPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink md:text-4xl">
        Practice Areas
      </h1>

      <div className="mt-12 space-y-12">
        {practiceAreas.map((area) => (
          <section
            key={area.slug}
            className="border-b border-line pb-12 last:border-b-0"
          >
            <h2 className="font-serif text-2xl font-semibold text-ink">
              {area.title}
            </h2>
            <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-charcoal">
              {area.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {area.covers.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-charcoal"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-4 rounded border border-line bg-paper p-8">
        <h2 className="font-serif text-xl font-semibold text-ink">
          Why these three areas
        </h2>
        <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-charcoal">
          {specializationNarrative}
        </p>
      </section>
    </div>
  );
}
