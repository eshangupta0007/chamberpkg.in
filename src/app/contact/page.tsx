import { ContactForm } from "@/components/ContactForm";
import { pageMetadata } from "@/lib/page-metadata";
import {
  addresses,
  email,
  mapEmbedSrc,
  officeHours,
  officeHoursNote,
  phones,
  whatsappHref,
} from "@/lib/site-data";

export const metadata = pageMetadata(
  "Contact",
  "For inquiries, the Chamber of Praveen Kumar Gupta may be reached by phone, WhatsApp, email, or the form below.",
);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <p className="text-xs uppercase tracking-wide text-gold-text">
        Chamber of Praveen Kumar Gupta
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-ink md:text-4xl">
        Contact
      </h1>
      <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-charcoal">
        For inquiries, the Chamber may be reached at the phone numbers or
        email below, or via the form for non-urgent matters.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink">
            Send a Message
          </h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">
              Phone &amp; WhatsApp
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {phones.map((p) => (
                <a
                  key={p.number}
                  href={whatsappHref(p.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    p.primary
                      ? "rounded bg-whatsapp-green px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                      : "rounded border border-line px-4 py-2.5 text-sm text-charcoal hover:border-gold-primary"
                  }
                >
                  WhatsApp {p.display}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">
              Email
            </h2>
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-block text-sm text-gold-text hover:underline"
            >
              {email}
            </a>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">
              Office Hours
            </h2>
            <p className="mt-2 text-sm text-charcoal">{officeHours}</p>
            <p className="mt-2 max-w-[55ch] text-sm text-charcoal/80">
              {officeHoursNote}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-xl font-semibold text-ink">
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
