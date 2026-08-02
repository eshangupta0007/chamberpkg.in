import Link from "next/link";
import { Seal } from "./Seal";
import { nav, siteName } from "@/lib/site-data";

export function Header() {
  return (
    <header className="border-b border-line bg-ink">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-ivory">
          <Seal className="h-12 w-12 text-gold-primary shrink-0" />
          <span className="font-serif text-lg font-semibold leading-tight">
            {siteName}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-charcoal hover:text-gold-text transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="lg:hidden relative">
          <summary className="list-none cursor-pointer text-sm text-ivory border border-line rounded px-3 py-1.5">
            Menu
          </summary>
          <nav className="absolute right-0 z-20 mt-2 flex w-56 flex-col gap-1 rounded border border-line bg-paper p-3 shadow-md">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-2 py-1.5 text-sm text-charcoal hover:bg-ink"
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
