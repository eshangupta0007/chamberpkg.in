"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site-data";

/** The primary navigation, with aria-current set on the page being viewed. */
export function NavLinks({ linkClassName }: { linkClassName: string }) {
  const pathname = usePathname();
  return (
    <>
      {nav.map((item) => {
        const current =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={linkClassName}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
