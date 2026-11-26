"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const path = usePathname();
  const link = (href: string, label: string) => (
    <Link href={href} className={path === href ? "nav-link is-active" : "nav-link"}>
      {label}
    </Link>
  );
  return (
    <header className="header">
      <Link href="/" className="brand" aria-label="Précis home">
        <span className="brand-mark">P</span>
        Précis
      </Link>
      <nav className="nav" aria-label="Main">
        {link("/", "Discover")}
        {link("/library", "Library")}
      </nav>
    </header>
  );
}
