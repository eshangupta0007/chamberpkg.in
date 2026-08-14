import { InternshipForm } from "@/components/InternshipForm";
import { pageMetadata } from "@/lib/page-metadata";
import { email, phones, whatsappHref } from "@/lib/site-data";

export const metadata = pageMetadata(
  "Internships",
  "Apply for an internship with the Chamber of Praveen Kumar Gupta.",
);

export default function InternshipsPage() {
  return (
    <div className="mx-auto max-w-[65ch] px-6 py-16">
      <p className="label-caps text-xs text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
        Internships
      </h1>
      <p className="mt-4 text-base leading-relaxed text-charcoal">
        Law students seeking an internship with the Chamber may apply using
        the form below.
      </p>

      <div className="mt-10">
        <InternshipForm />
      </div>

      <div className="mt-10 border border-line bg-paper p-6">
        <p className="text-sm leading-relaxed text-charcoal">
          Alternatively, this information &mdash; full name, email, phone
          number, law college/university, and a copy of your resume/CV
          &mdash; may be sent directly by WhatsApp to{" "}
          <a
            href={whatsappHref(phones[0].number)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-text underline hover:text-gold-primary"
          >
            {phones[0].display}
          </a>{" "}
          or{" "}
          <a
            href={whatsappHref(phones[1].number)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-text underline hover:text-gold-primary"
          >
            {phones[1].display}
          </a>
          , or by email to{" "}
          <a
            href={`mailto:${email}`}
            className="text-gold-text underline hover:text-gold-primary"
          >
            {email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
