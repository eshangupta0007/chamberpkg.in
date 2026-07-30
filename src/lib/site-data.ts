export const siteName = "Chamber of Praveen Kumar Gupta";

export const nav = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/where-we-practice", label: "Where We Practice" },
  { href: "/blog", label: "Blog" },
  { href: "/internships", label: "Internships" },
  { href: "/contact", label: "Contact" },
] as const;

export const addresses = [
  {
    label: "Main Chamber",
    lines: ["2/201, Vibhav Khand, Gomti Nagar", "Lucknow, Uttar Pradesh"],
    mapQuery: "2/201 Vibhav Khand, Gomti Nagar, Lucknow, Uttar Pradesh",
  },
  {
    label: "District Court Chamber",
    lines: [
      "Near Central Bar Association / Parag Booth",
      "District & Sessions Court, Lucknow",
    ],
    mapQuery: "District and Sessions Court, Lucknow, Uttar Pradesh",
  },
  {
    label: "High Court Chamber",
    lines: ["Advocates' Chamber", "Allahabad High Court, Lucknow Bench"],
    mapQuery: "Allahabad High Court Lucknow Bench, Uttar Pradesh",
  },
] as const;

export const courts = [
  "Supreme Court of India",
  "Allahabad High Court (Principal Seat, Allahabad)",
  "Allahabad High Court, Lucknow Bench",
  "District & Sessions Court, Lucknow",
  "District Courts, Noida, and other courts across Uttar Pradesh",
  "Tribunals situated in Lucknow",
] as const;

export function mapEmbedSrc(query: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export const phones = [
  { number: "8299221241", display: "+91 82992 21241", whatsapp: true, primary: true },
  { number: "9450447219", display: "+91 94504 47219", whatsapp: true, primary: false },
] as const;

export const email = "eshangupta0007@gmail.com";

export const officeHours = "Monday – Saturday, 10:30 AM – 6:30 PM";
export const officeHoursNote =
  "Closed Sundays and court holidays. As litigation work involves regular court appearances, phone or WhatsApp is generally the fastest way to reach the Chamber during the day; the contact form is best for non-urgent inquiries.";

export function whatsappHref(number: string) {
  return `https://wa.me/91${number}`;
}
