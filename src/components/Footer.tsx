import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "./SocialIcons";
import { addresses, email, phones, siteName } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-deep-line bg-deep text-deep-text">
      <div className="mx-auto max-w-[90rem] px-6 py-16 md:px-10 lg:px-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image
              src="/images/logo-seal.png"
              alt="Chamber of Praveen Kumar Gupta seal"
              width={64}
              height={64}
              className="h-16 w-16"
            />
            <p className="display-tight mt-5 max-w-[14ch] font-serif text-2xl font-semibold leading-tight">
              {siteName}
            </p>
            <p className="label-caps mt-3 text-xs text-gold-on-dark">
              Advocates &middot; Since 1991
            </p>
            <SocialIcons className="mt-6 flex items-center gap-5" />
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-5">
            {addresses.map((addr) => (
              <div key={addr.label}>
                <p className="label-caps text-xs text-gold-on-dark">
                  {addr.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-deep-text/75">
                  {addr.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <p className="label-caps text-xs text-gold-on-dark">Reach the Chamber</p>
            <ul className="mt-2 space-y-1.5 text-sm text-deep-text/75">
              {phones.map((p) => (
                <li key={p.number}>{p.display}</li>
              ))}
              <li>{email}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-deep-line pt-6 text-xs text-deep-text/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/disclaimer" className="hover:text-gold-on-dark">
              Disclaimer
            </Link>
            <Link href="/privacy-policy" className="hover:text-gold-on-dark">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
