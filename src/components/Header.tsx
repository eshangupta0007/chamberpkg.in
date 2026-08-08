import Image from "next/image";
import Link from "next/link";
import { nav, siteName } from "@/lib/site-data";

export function Header() {
  return (
    <header className="border-b border-deep-line bg-deep">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-deep-text">
          <Image
            src="/images/logo-seal.png"
            alt="Chamber of Praveen Kumar Gupta seal"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0"
            priority
          />
          <span className="font-serif text-lg font-semibold leading-tight">
            {siteName}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label-caps text-deep-text/80 hover:text-gold-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="lg:hidden relative">
          <summary className="label-caps list-none cursor-pointer text-sm text-deep-text border border-deep-line rounded px-3 py-1.5">
            Menu
          </summary>
          <nav className="absolute right-0 z-20 mt-2 flex w-56 flex-col gap-1 rounded border border-deep-line bg-deep p-3 shadow-md">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label-caps rounded px-2 py-1.5 text-sm text-deep-text/80 hover:text-gold-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
