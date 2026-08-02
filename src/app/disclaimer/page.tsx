import { disclaimerParagraphs } from "@/lib/disclaimer-text";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Disclaimer",
  "Disclaimer governing use of the Chamber of Praveen Kumar Gupta website.",
);

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-[75ch] px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-ivory">Disclaimer</h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal">
        {disclaimerParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
