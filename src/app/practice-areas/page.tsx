import { pageMetadata } from "@/lib/page-metadata";
import { attorneyJsonLd } from "@/lib/structured-data";
import { PracticeAreasContent } from "@/components/PracticeAreasContent";

export const metadata = pageMetadata(
  "Practice Areas",
  "The areas of law practised by the Chamber of Praveen Kumar Gupta, before the Supreme Court, the Allahabad High Court, and the district judiciary of Uttar Pradesh.",
  "/practice-areas",
);

export default function PracticeAreasPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attorneyJsonLd()) }}
      />
      <PracticeAreasContent />
    </div>
  );
}
