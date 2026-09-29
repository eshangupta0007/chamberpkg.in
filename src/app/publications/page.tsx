import Image from "next/image";
import Link from "next/link";
import { SealDivider } from "@/components/SealDivider";
import { publicationJsonLd, rapeLawArticleJsonLd } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata(
  "Publications",
  "Published writing by Eshan Kumar Gupta, Advocate: Rape Law in Transition (International Journal for Multidisciplinary Research, 2026), and The Artificial Intelligence Code, 2026, a draft legislative proposal.",
  "/publications",
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

// Section headings of the article, verbatim from the published text.
const articleSections = [
  "Introduction",
  "The Temporal Question: Which Law Governs",
  "The Anatomy of the Offence",
  "Consent and Will",
  "The False Promise of Marriage: Section 376 with Section 90 IPC, and Section 69 BNS",
  "Investigation",
  "Delay in Lodging the First Information",
  "Medical Evidence",
  "DNA Evidence",
  "Electronic Evidence: Photographs, Videos and Chats",
  "Bail and Anticipatory Bail",
  "Charge, Discharge and Quashing",
  "The Trial",
  "Final Arguments",
  "Sentence, Compensation and Appeal",
  "Conclusion",
] as const;

const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI"];

const IJFMR_PAGE = "https://www.ijfmr.com/research-paper.php?id=88715";
const IJFMR_PDF = "https://www.ijfmr.com/papers/2026/5/88715.pdf";

// The two works, most recent first, for the bibliography at the head of the page.
const works = [
  {
    id: "rape-law-in-transition",
    kind: "Journal article",
    year: "2026",
    title: "Rape Law in Transition",
    citation:
      "International Journal for Multidisciplinary Research, Vol. 8, Issue 5 (September–October 2026)",
  },
  {
    id: "ai-code",
    kind: "Draft statute",
    year: "2026",
    title: "The Artificial Intelligence Code, 2026",
    citation: "Author\u2019s Edition · Naman Prakashan",
  },
] as const;

export default function PublicationsPage() {
  return (
    <div className="mx-auto max-w-[90rem] px-6 py-16 md:px-10 lg:px-14 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(publicationJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rapeLawArticleJsonLd()) }}
      />
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label-caps text-xs text-gold-text">
            Chamber of Praveen Kumar Gupta
          </p>
          <h1 className="display-tight mt-3 font-serif text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.95] text-ivory">
            Publications
          </h1>
        </div>
        <p className="max-w-[44ch] text-lg leading-relaxed text-charcoal lg:col-span-5 lg:pb-3">
          A journal article and a draft statute by Eshan Kumar Gupta,
          Advocate, Hon&rsquo;ble High Court of Judicature at Allahabad,
          Lucknow Bench.
        </p>
      </div>

      {/* Bibliography: each work as a citation, linking to its entry below. */}
      <ol className="mt-12 border-t border-line">
        {works.map((w) => (
          <li key={w.id} className="border-b border-line">
            <a
              href={`#${w.id}`}
              className="group grid gap-x-8 gap-y-1 py-6 transition-colors hover:bg-paper md:-mx-4 md:grid-cols-12 md:items-baseline md:px-4"
            >
              <span className="label-caps text-xs text-gold-text md:col-span-2">
                {w.kind} &middot; {w.year}
              </span>
              <span className="md:col-span-9">
                <span className="display-tight block font-serif text-xl font-semibold text-ivory transition-colors group-hover:text-gold-text md:text-2xl">
                  {w.title}
                </span>
                <span className="mt-1 block text-sm text-muted">{w.citation}</span>
              </span>
              <span
                aria-hidden="true"
                className="hidden text-gold-primary/60 transition-all group-hover:translate-x-1 group-hover:text-gold-primary md:col-span-1 md:block md:text-right"
              >
                &darr;
              </span>
            </a>
          </li>
        ))}
      </ol>

      {/* ---------- Rape Law in Transition ---------- */}
      <section id="rape-law-in-transition" className="mt-20 scroll-mt-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* The first page as published, laid on the ground like a sheet on
              a desk. IJFMR publishes under CC BY-SA 4.0, credited beneath. */}
          <figure className="lg:col-span-5">
            <a
              href={IJFMR_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="group block max-w-[30rem]"
            >
              <Image
                src="/images/publications/rape-law-in-transition-p1.jpg"
                alt="The first page of Rape Law in Transition as published in the International Journal for Multidisciplinary Research, showing the title, the author's name and the abstract."
                width={1241}
                height={1754}
                sizes="(max-width: 1024px) 90vw, 480px"
                className="w-full border border-line shadow-2xl shadow-black/60 transition-transform duration-500 group-hover:-translate-y-1"
                priority
              />
            </a>
            <figcaption className="mt-3 text-xs leading-relaxed text-muted">
              First page, as published. &copy; the author; published by IJFMR
              under{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gold-text"
              >
                CC BY-SA 4.0
              </a>
              .
            </figcaption>
          </figure>

          <div className="lg:col-span-7">
            <p className="label-caps text-xs text-gold-text">Journal article &middot; 2026</p>
            <h2 className="display-tight mt-4 font-serif text-[clamp(2.25rem,4.4vw,3.75rem)] font-semibold leading-[1.02] text-ivory">
              Rape Law in Transition
            </h2>
            <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-muted">
              Section 376 of the Indian Penal Code, sections 63, 64 and 69 of
              the Bharatiya Nyaya Sanhita, and the trial of sexual offences
              from complaint to appeal.
            </p>

            <p className="drop-cap mt-10 text-lg leading-[1.75] text-charcoal md:text-xl">
              On 1 July 2024 the Indian Penal Code, the Code of Criminal
              Procedure and the Indian Evidence Act gave way to the Bharatiya
              Nyaya Sanhita, the Bharatiya Nagarik Suraksha Sanhita and the
              Bharatiya Sakshya Adhiniyam. The definition of rape survived
              almost intact as section 63 of the new Sanhita, and its
              punishment as section 64. But the new law did one thing of real
              consequence. In section 69 it created a separate offence of
              sexual intercourse by deceitful means, including a promise to
              marry made with no intention of keeping it.
            </p>
            <p className="mt-6 text-lg leading-[1.75] text-charcoal md:text-xl">
              The essay follows a case from beginning to end. It starts with
              the question that must be answered before any other, namely which
              law governs. It then examines the elements of the offence, the
              concept of consent, and the false promise of marriage under both
              regimes. It turns next to investigation, to the recurring contests
              over delay, medical evidence and DNA, and to electronic evidence.
              It closes with bail, charge and quashing, the conduct of the
              trial, final arguments, and sentence and appeal.
            </p>

            <dl className="mt-10 grid gap-x-10 gap-y-4 border-t border-line pt-6 text-sm sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="label-caps text-xs text-gold-text">Journal</dt>
                <dd className="mt-1 text-charcoal">
                  International Journal for Multidisciplinary Research (IJFMR)
                </dd>
              </div>
              <div>
                <dt className="label-caps text-xs text-gold-text">Published in</dt>
                <dd className="mt-1 text-charcoal">
                  Vol. 8, Issue 5, September&ndash;October 2026
                </dd>
              </div>
              <div>
                <dt className="label-caps text-xs text-gold-text">Published on</dt>
                <dd className="mt-1 text-charcoal">29 September 2026</dd>
              </div>
              <div>
                <dt className="label-caps text-xs text-gold-text">E-ISSN</dt>
                <dd className="mt-1 text-charcoal tabular-nums">2582-2160</dd>
              </div>
              <div>
                <dt className="label-caps text-xs text-gold-text">Paper ID</dt>
                <dd className="mt-1 text-charcoal tabular-nums">IJFMR260588715</dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={IJFMR_PAGE}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps border border-line-strong px-5 py-3 text-sm text-ivory transition-colors hover:border-gold-primary hover:text-gold-text"
              >
                Read at IJFMR &rarr;
              </a>
              <a
                href={IJFMR_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="label-caps border border-line-strong px-5 py-3 text-sm text-ivory transition-colors hover:border-gold-primary hover:text-gold-text"
              >
                PDF &rarr;
              </a>
              <Link
                href="/blog/rape-law-in-transition-part-1"
                className="label-caps border border-line-strong px-5 py-3 text-sm text-ivory transition-colors hover:border-gold-primary hover:text-gold-text"
              >
                Serialised on this site, in nine parts &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="display-tight font-serif text-3xl font-semibold text-ivory md:text-4xl">
            Contents
          </h3>
          <ol className="mt-8 grid gap-x-10 gap-y-3 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {articleSections.map((heading, i) => (
              <li key={heading} className="flex items-baseline gap-3 text-base text-charcoal">
                <span className="w-9 shrink-0 font-serif text-sm text-gold-primary">
                  {roman[i]}.
                </span>
                {heading}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mt-24">
        <SealDivider className="max-w-[30rem]" />
      </div>

      {/* ---------- The Artificial Intelligence Code, 2026 ---------- */}
      <section id="ai-code" className="mt-20 scroll-mt-28">
      <p className="label-caps text-xs text-gold-text">Draft statute &middot; 2026</p>

      {/* The volume itself, before any description of it. */}
      <figure className="mt-6">
        <Image
          src="/images/publications/ai-code-cover.jpg"
          alt="The Artificial Intelligence Code, 2026, bound in black boards with gilt lettering, on a desk beside a volume of the Supreme Court Cases reports."
          width={1800}
          height={1349}
          sizes="(max-width: 1440px) 100vw, 1350px"
          className="w-full border border-line object-cover"
        />
        <figcaption className="label-caps mt-3 text-xs text-muted">
          Author&rsquo;s Edition, 2026 &middot; Naman Prakashan
        </figcaption>
      </figure>

      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 className="display-tight font-serif text-3xl font-semibold leading-[1.05] text-ivory md:text-4xl">
            The Artificial Intelligence Code, 2026
          </h2>
          <dl className="mt-8 space-y-4 border-t border-line pt-6 text-sm">
            <div>
              <dt className="label-caps text-xs text-gold-text">Author</dt>
              <dd className="mt-1 text-charcoal">Eshan Kumar Gupta, Advocate</dd>
            </div>
            <div>
              <dt className="label-caps text-xs text-gold-text">Extent</dt>
              <dd className="mt-1 text-charcoal">60 sections · 11 chapters · 3 Schedules</dd>
            </div>
            <div>
              <dt className="label-caps text-xs text-gold-text">Edition</dt>
              <dd className="mt-1 text-charcoal">Author&rsquo;s Edition, 2026 · Naman Prakashan</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <p className="drop-cap text-lg leading-[1.75] text-charcoal md:text-xl">
            India has no statute treating artificial intelligence as an
            independent subject of law. The Information Technology Act, 2000
            recognises electronic records; the Digital Personal Data Protection
            Act, 2023 governs personal data; the Bharatiya Nyaya Sanhita,
            Nagarik Suraksha Sanhita, and Sakshya Adhiniyam, 2023 modernised
            criminal law, procedure, and evidence. None of them allocates
            liability along the chain of persons who design, train, deploy, and
            profit from an AI system.
          </p>
          <p className="mt-6 text-lg leading-[1.75] text-charcoal md:text-xl">
            The Artificial Intelligence Code, 2026 is a draft statute addressed
            to that gap, authored by Eshan Kumar Gupta, Advocate, Hon&rsquo;ble
            High Court of Judicature at Allahabad, Lucknow Bench. It runs to 60
            sections across 11 chapters and 3 Schedules, and rests on the
            Concurrent List &mdash; criminal law and procedure, contract and
            actionable wrongs, and evidence &mdash; with the residuary power
            invoked narrowly for its regulatory tier alone.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        <figure>
          <Image
            src="/images/publications/ai-code-title-page.jpg"
            alt="The title page, naming the author as Eshan Kumar Gupta, Advocate, High Court of Judicature at Allahabad, Lucknow Bench."
            width={1100}
            height={825}
            sizes="(max-width: 640px) 100vw, 560px"
            className="w-full border border-line object-cover"
          />
          <figcaption className="label-caps mt-3 text-xs text-muted">
            Title page
          </figcaption>
        </figure>
        <figure>
          <Image
            src="/images/publications/ai-code-contents.jpg"
            alt="The table of contents, listing the preliminary note, executive summary, statement of objects and reasons, and the arrangement of chapters."
            width={1100}
            height={825}
            sizes="(max-width: 640px) 100vw, 560px"
            className="w-full border border-line object-cover"
          />
          <figcaption className="label-caps mt-3 text-xs text-muted">
            Table of contents
          </figcaption>
        </figure>
      </div>

      <div className="mt-20">
        <SealDivider className="max-w-[30rem]" />
      </div>

      <div className="mt-12">
        <h3 className="display-tight font-serif text-3xl font-semibold text-ivory md:text-4xl">
          Structure
        </h3>
        <dl className="mt-8 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter, i) => (
            <div key={chapter.name}>
              <dt className="flex items-baseline gap-3 font-serif text-lg font-semibold text-ivory">
                <span className="font-serif text-sm text-gold-primary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {chapter.name}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-charcoal">
                {chapter.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-20">
        <SealDivider className="max-w-[30rem]" />
      </div>

      <div className="mt-12 max-w-[72ch]">
        <h3 className="display-tight font-serif text-3xl font-semibold text-ivory md:text-4xl">
          Status
        </h3>
        <p className="mt-6 text-lg leading-[1.7] text-charcoal">
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
      </section>
    </div>
  );
}
