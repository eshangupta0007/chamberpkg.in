export const siteName = "Chamber of Praveen Kumar Gupta";

export const nav = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/where-we-practice", label: "Where We Practice" },
  { href: "/blog", label: "Blog" },
  { href: "/publications", label: "Publications" },
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

// Ascending order of hierarchy, styled per Indian legal drafting convention:
// "Hon'ble" for the Supreme Court and High Court, "Learned" for the district judiciary.
export const courts = [
  "Hon'ble Supreme Court of India",
  "Hon'ble Allahabad High Court, Principal Bench, Allahabad",
  "Hon'ble Allahabad High Court, Lucknow Bench",
  "Learned District & Sessions Court, Lucknow",
  "Learned District Courts, Noida, and other courts across Uttar Pradesh",
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

export const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/eshan.gupta.963434" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/eshan-gupta-3b3a90258/" },
  { name: "Instagram", href: "https://www.instagram.com/eshangupta0007/" },
] as const;

export const officeHours = "Monday – Saturday, 10:30 AM – 6:30 PM";
export const officeHoursNote =
  "Closed Sundays and court holidays. As litigation work involves regular court appearances, phone or WhatsApp is generally the fastest way to reach the Chamber during the day; the contact form is best for non-urgent inquiries.";

export function whatsappHref(number: string) {
  return `https://wa.me/91${number}`;
}
