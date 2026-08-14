"use client";

import { useState } from "react";
import { ContactForm } from "./ContactForm";
import { LanguageToggle, type Lang } from "./LanguageToggle";
import { hiContact } from "@/lib/i18n-hi";
import {
  addresses,
  email,
  mapEmbedSrc,
  officeHours,
  officeHoursNote,
  phones,
  whatsappHref,
} from "@/lib/site-data";

export function ContactContent() {
  const [lang, setLang] = useState<Lang>("en");
  const isHi = lang === "hi";
  const t = hiContact;

  return (
    <div lang={isHi ? "hi" : undefined}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-caps text-xs text-gold-text">
            Chamber of Praveen Kumar Gupta
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ivory md:text-4xl">
            {isHi ? t.heading : "Contact"}
          </h1>
        </div>
        <LanguageToggle lang={lang} onChange={setLang} />
      </div>
      <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-charcoal">
        {isHi
          ? t.intro
          : "For inquiries, the Chamber may be reached at the phone numbers or email below, or via the form for non-urgent matters."}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ivory">
            {isHi ? t.sendMessage : "Send a Message"}
          </h2>
          <div className="mt-5">
            <ContactForm lang={lang} />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ivory">
              {isHi ? t.phoneWhatsapp : "Phone & WhatsApp"}
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
                      ? "bg-whatsapp-green px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                      : "border border-line px-4 py-2.5 text-sm text-charcoal hover:border-gold-primary"
                  }
                >
                  {isHi ? t.whatsappPrefix : "WhatsApp"} {p.display}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-ivory">
              {isHi ? t.email : "Email"}
            </h2>
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-block text-sm text-gold-text underline hover:text-gold-primary"
            >
              {email}
            </a>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-ivory">
              {isHi ? t.officeHours : "Office Hours"}
            </h2>
            <p className="mt-2 text-sm text-charcoal">
              {isHi ? t.officeHoursValue : officeHours}
            </p>
            <p className="mt-2 max-w-[55ch] text-sm text-charcoal/90">
              {isHi ? t.officeHoursNote : officeHoursNote}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-xl font-semibold text-ivory">
          {isHi ? t.addresses : "Chamber Addresses"}
        </h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {addresses.map((addr) => (
            <div
              key={addr.label}
              className="overflow-hidden border border-line bg-paper"
            >
              <iframe
                title={addr.label}
                src={mapEmbedSrc(addr.mapQuery)}
                className="h-48 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5">
                <p className="label-caps text-xs text-gold-text">
                  {isHi ? t.addressLabels[addr.label] : addr.label}
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
