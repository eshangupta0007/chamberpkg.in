import { InternshipForm } from "@/components/InternshipForm";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Internships",
  "Apply for an internship with the Chamber of Praveen Kumar Gupta.",
);

export default function InternshipsPage() {
  return (
    <div className="mx-auto max-w-[65ch] px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink md:text-4xl">
        Internships
      </h1>
      <p className="mt-4 text-base leading-relaxed text-charcoal">
        Law students seeking an internship with the Chamber may apply using
        the form below.
      </p>

      <div className="mt-10">
        <InternshipForm />
      </div>
    </div>
  );
}
