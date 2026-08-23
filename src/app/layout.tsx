import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DisclaimerGate } from "@/components/DisclaimerGate";
import { siteUrl } from "@/lib/site-url";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  // Blog prose italicises case names, which legal citation requires; without
  // this the browser synthesises a slant instead of using a drawn italic.
  style: ["normal", "italic"],
});

const defaultDescription =
  "Chamber of Praveen Kumar Gupta — Advocates, Hon'ble Supreme Court of India, Allahabad High Court, and District Courts, Uttar Pradesh. Established 1991.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: {
    default: "Chamber of Praveen Kumar Gupta",
    template: "%s | Chamber of Praveen Kumar Gupta",
  },
  description: defaultDescription,
  openGraph: {
    siteName: "Chamber of Praveen Kumar Gupta",
    title: "Chamber of Praveen Kumar Gupta",
    description: defaultDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chamber of Praveen Kumar Gupta",
    description: defaultDescription,
  },
};

// Paints the mobile browser chrome to match the site's own chrome bar.
export const viewport: Viewport = {
  themeColor: "#222A2F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-charcoal">
        <DisclaimerGate />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
