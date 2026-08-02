import Image from "next/image";
import { Seal } from "@/components/Seal";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "About",
  "The history of the Chamber of Praveen Kumar Gupta, established 1991, and its continuation under Eshan Kumar Gupta, Proprietor.",
);

// Legacy paragraph per build spec §4.2 — drafted for Eshan's review; confirm
// or revise before launch, and add any specific founding detail he wants reflected.
const legacyParagraph = `The Chamber of Praveen Kumar Gupta was established in 1991, built on a simple premise: that rigorous preparation and quiet discipline serve a client's interest better than performance ever could. Over three decades, that premise held through the ordinary and the difficult alike, across the district judiciary of Lucknow and the Allahabad High Court. Today, the Chamber continues under the stewardship of Eshan Kumar Gupta, Proprietor, carrying the same founding discipline into a practice built for the present, conducted with the same precision the name has stood for since 1991.`;

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <Seal
        className="pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] text-gold-primary opacity-[0.08] md:h-[720px] md:w-[720px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[75ch] px-6 py-16">
        <p className="text-xs uppercase tracking-wide text-gold-text">
          Chamber of Praveen Kumar Gupta
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
          About the Chamber
        </h1>

        <div className="mt-8 space-y-4 text-base leading-relaxed text-charcoal">
          <p>{legacyParagraph}</p>
        </div>

        <figure className="mt-10">
          <Image
            src="/images/allahabad-high-court.jpg"
            alt="The Allahabad High Court building"
            width={2400}
            height={1170}
            className="w-full rounded border border-line object-cover"
            priority={false}
          />
          <figcaption className="mt-2 text-xs text-charcoal/80">
            The Allahabad High Court. Photo by Subhashish Panigrahi, licensed
            under{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gold-text"
            >
              CC BY-SA 4.0
            </a>
            .
          </figcaption>
        </figure>

        <div className="mt-12 border-t border-line pt-8">
          <p className="font-serif text-lg font-semibold text-ivory">
            Eshan Kumar Gupta
          </p>
          <p className="mt-1 text-sm text-charcoal">Proprietor</p>
        </div>
      </div>
    </div>
  );
}
