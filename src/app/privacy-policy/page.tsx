import { email } from "@/lib/site-data";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Privacy Policy",
  "How the Chamber of Praveen Kumar Gupta collects, uses, and retains information submitted through this website.",
  "/privacy-policy",
);

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-[75ch] px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-ivory">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-charcoal/90">Last updated: 30 July 2026</p>

      <div className="mt-8 space-y-8 text-base leading-relaxed text-charcoal">
        <p>
          This Privacy Policy describes how the Chamber of Praveen Kumar
          Gupta (&ldquo;the Chamber,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;)
          collects, uses, and safeguards information submitted through this
          website, in accordance with the Information Technology Act, 2000
          and the Information Technology (Reasonable Security Practices and
          Procedures and Sensitive Personal Data or Information) Rules, 2011
          (&ldquo;SPDI Rules&rdquo;).
        </p>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ivory">
            Information we collect
          </h2>
          <p className="mt-3">
            We collect information you voluntarily submit through the forms
            on this website:
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-6">
            <li>
              <strong>Contact form:</strong> name, email address, phone
              number, and message content.
            </li>
            <li>
              <strong>Internship application form:</strong> name, email
              address, phone number, law college/university, and an
              uploaded resume/CV.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ivory">
            How we use this information
          </h2>
          <p className="mt-3">
            Information submitted is used solely to respond to your inquiry
            or to evaluate an internship application. It is not used for
            marketing, profiling, or any purpose beyond responding to the
            specific submission made.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ivory">
            Retention
          </h2>
          <p className="mt-3">
            Form submissions and uploaded resumes are retained only for as
            long as reasonably necessary to address the inquiry or
            application, and are deleted thereafter unless retention is
            required for legal or record-keeping purposes.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ivory">
            Sharing
          </h2>
          <p className="mt-3">
            Information you submit, including resumes, is not sold, rented,
            or shared with third parties, except with service providers
            strictly necessary to operate this website (for example, email
            delivery and file storage providers), who are bound to
            confidentiality and are not permitted to use the information for
            any other purpose.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ivory">
            Security
          </h2>
          <p className="mt-3">
            We maintain reasonable security practices and procedures, as
            contemplated under the SPDI Rules, to protect submitted
            information from unauthorized access, alteration, or
            disclosure.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-ivory">
            Your rights and queries
          </h2>
          <p className="mt-3">
            For any question about the information you have submitted,
            including a request for its correction or deletion, you may
            write to us at{" "}
            <a href={`mailto:${email}`} className="text-gold-text underline hover:text-gold-primary">
              {email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
