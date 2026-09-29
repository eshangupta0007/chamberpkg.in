import Image from "next/image";
import Link from "next/link";
import { NavLinks } from "./NavLinks";
import { siteName } from "@/lib/site-data";

const navLink =
  "nav-link label-caps text-[0.8rem] text-deep-text/75 transition-colors hover:text-gold-on-dark aria-[current=page]:text-gold-on-dark";

export function Header() {
  return (
    // Once the page has scrolled (html.is-scrolled, set by MotionRoot) the bar
    // tightens, its glass deepens and its rule warms toward gold.
    <header className="sticky top-0 z-40 border-b border-deep-line bg-deep/80 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-500 [.is-scrolled_&]:border-gold-primary/25 [.is-scrolled_&]:bg-deep/95 [.is-scrolled_&]:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.95)]">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-6 px-6 py-4 transition-[padding] duration-500 md:px-10 lg:px-14 [.is-scrolled_&]:py-2.5">
        <Link href="/" className="group flex items-center gap-3 text-deep-text">
          <Image
            src="/images/logo-seal.png"
            alt="Chamber of Praveen Kumar Gupta seal"
            width={44}
            height={44}
            className="h-10 w-10 shrink-0 transition-[transform,height,width] duration-700 ease-[var(--ease-settle)] group-hover:rotate-[14deg] md:h-11 md:w-11 [.is-scrolled_&]:h-8 [.is-scrolled_&]:w-8"
            priority
          />
          <span className="display-tight font-serif text-[0.95rem] font-semibold leading-tight md:text-base">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <NavLinks linkClassName={navLink} />
        </nav>

        <details className="relative lg:hidden">
          <summary className="label-caps cursor-pointer list-none border border-deep-line px-3 py-1.5 text-sm text-deep-text">
            Menu
          </summary>
          <nav className="absolute right-0 z-20 mt-2 flex w-60 flex-col gap-1 border border-deep-line bg-deep p-3 shadow-2xl shadow-black/60">
            <NavLinks linkClassName="label-caps px-2 py-2 text-sm text-deep-text/80 hover:text-gold-on-dark aria-[current=page]:text-gold-on-dark" />
          </nav>
        </details>
      </div>
    </header>
  );
}
