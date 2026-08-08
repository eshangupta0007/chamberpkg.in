import Image from "next/image";
import Link from "next/link";
import { SocialIcons } from "./SocialIcons";
import { addresses, email, phones, siteName } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-deep-line bg-deep text-deep-text">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Image
              src="/images/logo-seal.png"
              alt="Chamber of Praveen Kumar Gupta seal"
              width={56}
              height={56}
              className="h-14 w-14"
            />
            <p className="mt-3 font-serif text-base">{siteName}</p>
            <p className="mt-1 text-xs text-deep-text/60">Advocates &middot; Since 1991</p>
            <SocialIcons className="mt-4 flex items-center gap-4" />
          </div>

          <div className="md:col-span-2 grid gap-6 sm:grid-cols-3">
            {addresses.map((addr) => (
              <div key={addr.label}>
                <p className="text-xs uppercase tracking-wide text-gold-primary">
                  {addr.label}
                </p>
                <p className="mt-1.5 text-sm text-deep-text/80">
                  {addr.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          <div className="md:col-span-1">
            <p className="text-xs uppercase tracking-wide text-gold-primary">Reach the Chamber</p>
            <ul className="mt-1.5 space-y-1 text-sm text-deep-text/80">
              {phones.map((p) => (
                <li key={p.number}>{p.display}</li>
              ))}
              <li>{email}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-deep-text/15 pt-6 text-xs text-deep-text/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/disclaimer" className="hover:text-gold-primary">
              Disclaimer
            </Link>
            <Link href="/privacy-policy" className="hover:text-gold-primary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
