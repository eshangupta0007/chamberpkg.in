import { addresses, courts, mapEmbedSrc } from "@/lib/site-data";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Where We Practice",
  "Courts and jurisdiction where the Chamber of Praveen Kumar Gupta appears, and its chamber addresses.",
);

export default function WhereWePracticePage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
        Where We Practice
      </h1>
      <p className="mt-4 max-w-[70ch] text-base leading-relaxed text-charcoal">
        The Chamber, established in Lucknow, Uttar Pradesh, appears before the
        following courts and tribunals.
      </p>

      <section className="mt-12">
        <h2 className="font-serif text-xl font-semibold text-ivory">
          Courts & Jurisdiction
        </h2>
        <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {courts.map((court) => (
            <li
              key={court}
              className="border-b border-line py-2 text-sm text-charcoal"
            >
              {court}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-xl font-semibold text-ivory">
          Chamber Addresses
        </h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {addresses.map((addr) => (
            <div
              key={addr.label}
              className="overflow-hidden rounded border border-line bg-paper"
            >
              <iframe
                title={addr.label}
                src={mapEmbedSrc(addr.mapQuery)}
                className="h-48 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-gold-text">
                  {addr.label}
                </p>
                <p className="mt-1.5 text-sm text-charcoal">
                  {addr.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
