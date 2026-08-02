import { practiceAreas } from "@/lib/practice-areas";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Practice Areas",
  "The areas of law practised by the Chamber of Praveen Kumar Gupta, before the Supreme Court, the Allahabad High Court, and the district judiciary of Uttar Pradesh.",
);

export default function PracticeAreasPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
        Practice Areas
      </h1>

      <div className="mt-12 space-y-12">
        {practiceAreas.map((area) => (
          <section
            key={area.slug}
            className="border-b border-line pb-12 last:border-b-0"
          >
            <h2 className="font-serif text-2xl font-semibold text-ivory">
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
    </div>
  );
}
