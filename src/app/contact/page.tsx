import { pageMetadata } from "@/lib/page-metadata";
import { ContactContent } from "@/components/ContactContent";
import { contactPageJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata(
  "Contact",
  "For inquiries, the Chamber of Praveen Kumar Gupta may be reached by phone, WhatsApp, email, or the form below.",
  "/contact",
);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd()) }}
      />
      <ContactContent />
    </div>
  );
}
