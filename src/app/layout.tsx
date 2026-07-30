import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DisclaimerGate } from "@/components/DisclaimerGate";
import { siteUrl } from "@/lib/site-url";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const defaultDescription =
  "Chamber of Praveen Kumar Gupta — Advocates, Allahabad High Court and District Courts, Uttar Pradesh. Established 1991.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">
        <DisclaimerGate />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
