import Image from "next/image";
import Link from "next/link";
import { nav, siteName } from "@/lib/site-data";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-deep-line bg-deep/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-6 py-4 md:px-10 lg:px-14">
        <Link href="/" className="flex items-center gap-3 text-deep-text">
          <Image
            src="/images/logo-seal.png"
            alt="Chamber of Praveen Kumar Gupta seal"
            width={44}
            height={44}
            className="h-10 w-10 shrink-0 md:h-11 md:w-11"
            priority
          />
          <span className="display-tight font-serif text-base font-semibold leading-tight md:text-lg">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label-caps text-[0.82rem] text-deep-text/75 transition-colors hover:text-gold-on-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="relative lg:hidden">
          <summary className="label-caps cursor-pointer list-none border border-deep-line px-3 py-1.5 text-sm text-deep-text">
            Menu
          </summary>
          <nav className="absolute right-0 z-20 mt-2 flex w-60 flex-col gap-1 border border-deep-line bg-deep p-3 shadow-2xl shadow-black/60">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="label-caps px-2 py-2 text-sm text-deep-text/80 hover:text-gold-on-dark"
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
