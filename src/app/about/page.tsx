import Image from "next/image";
import { pageMetadata } from "@/lib/page-metadata";
import { attorneyJsonLd } from "@/lib/structured-data";
import { AboutContent } from "@/components/AboutContent";

export const metadata = pageMetadata(
  "About",
  "The history of the Chamber of Praveen Kumar Gupta, established 1991, and its continuation under Eshan Kumar Gupta, Proprietor.",
);

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attorneyJsonLd()) }}
      />
      <Image
        src="/images/logo-seal.png"
        alt=""
        width={600}
        height={600}
        className="pointer-events-none absolute -right-32 -top-32 h-[560px] w-[560px] opacity-[0.12] md:h-[720px] md:w-[720px]"
        aria-hidden="true"
      />
      <AboutContent />
    </div>
  );
}
