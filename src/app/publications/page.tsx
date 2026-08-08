import Link from "next/link";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Publications",
  "The Artificial Intelligence (Regulation of Use and Prevention of Misuse) Act, 2026 — a draft legislative proposal by Eshan Kumar Gupta, Advocate.",
);

const chapters = [
  { name: "Preliminary", note: "Extraterritorial reach by effect within India; core definitions (AI system, algorithmic decision, deployer/developer, synthetic content)." },
  { name: "General Principles", note: "Risk tiers (prohibited/high-risk/limited-risk/minimal-risk); human primacy over final algorithmic decisions on legal rights; disparate-impact non-discrimination." },
  { name: "Prohibited Practices", note: "Absolute, non-waivable prohibitions, including subliminal manipulation, social scoring, individual predictive policing, and autonomous lethal targeting." },
  { name: "Obligations", note: "Registration of high-risk systems, transparency and provenance-marking, bias audits, human oversight, incident reporting, and a right to explanation." },
  { name: "Sector Provisions", note: "Elections, courts, healthcare, financial services, employment, and children — sector-specific rules within each." },
  { name: "National AI Authority", note: "Composition, registration and standards functions, inquiry and suspension powers, a regulatory sandbox, and a public AI Incident Registry." },
  { name: "Offences", note: "Synthetic impersonation, non-consensual intimate synthetic imagery, synthetic CSAM, AI-enabled fraud, and corporate and abetment liability." },
  { name: "Civil Liability", note: "Strict deployer liability for high-risk systems, product-liability developer liability, a rebuttable presumption of causation, and compulsory insurance." },
  { name: "Adjudication", note: "Adjudicating officers separated from the Authority's investigative wing, civil penalties, an AI Appellate Tribunal, and preserved writ jurisdiction." },
  { name: "Evidence", note: "A new provision for the Bharatiya Sakshya Adhiniyam mandating disclosure and certification of AI-processed material, and notified Examiners of AI Evidence." },
  { name: "Miscellaneous", note: "Research exemption, a reviewable national-security carve-out, good-faith protection, and a mandatory tripartite review every three years." },
] as const;

export default function PublicationsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
        Publications
      </h1>

      <div className="mt-12 max-w-[75ch]">
        <h2 className="font-serif text-2xl font-semibold text-ivory">
          The Artificial Intelligence Code, 2026
        </h2>
        <p className="mt-1 text-sm text-charcoal/90">
          The Artificial Intelligence (Regulation of Use and Prevention of
          Misuse) Act, 2026 — a draft legislative proposal
        </p>

        <p className="mt-6 text-base leading-relaxed text-charcoal">
          India has no statute treating artificial intelligence as an
          independent subject of law. The Information Technology Act, 2000
          recognises electronic records; the Digital Personal Data Protection
          Act, 2023 governs personal data; the Bharatiya Nyaya Sanhita,
          Nagarik Suraksha Sanhita, and Sakshya Adhiniyam, 2023 modernised
          criminal law, procedure, and evidence. None of them allocates
          liability along the chain of persons who design, train, deploy, and
          profit from an AI system.
        </p>
        <p className="mt-4 text-base leading-relaxed text-charcoal">
          The Artificial Intelligence Code, 2026 is a draft statute addressed
          to that gap, authored by Eshan Kumar Gupta, Advocate, Hon&rsquo;ble
          High Court of Judicature at Allahabad, Lucknow Bench. It runs to 60
          sections across 11 chapters and 3 Schedules, and rests on the
          Concurrent List &mdash; criminal law and procedure, contract and
          actionable wrongs, and evidence &mdash; with the residuary power
          invoked narrowly for its regulatory tier alone.
        </p>

        <a
          href="/documents/the-artificial-intelligence-code-2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded border border-line px-5 py-2.5 text-sm text-ivory hover:border-gold-primary hover:text-gold-text"
        >
          Download the full text (PDF)
        </a>
      </div>

      <div className="mt-12 max-w-[75ch]">
        <h3 className="font-serif text-xl font-semibold text-ivory">
          Structure
        </h3>
        <dl className="mt-4 space-y-4">
          {chapters.map((chapter, i) => (
            <div key={chapter.name}>
              <dt className="text-sm font-medium text-ivory">
                {i + 1}. {chapter.name}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-charcoal">
                {chapter.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-12 max-w-[75ch]">
        <h3 className="font-serif text-xl font-semibold text-ivory">
          Status
        </h3>
        <p className="mt-4 text-base leading-relaxed text-charcoal">
          This is an independent legislative proposal, unaffiliated with any
          Government, Ministry, or constitutional authority. It has been
          offered for academic and professional consultation, and comments
          are invited for incorporation into future editions. For inquiries,
          the Chamber may be reached via the{" "}
          <Link
            href="/contact"
            className="text-gold-text underline hover:text-gold-primary"
          >
            contact page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
