"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * The site's motion controller. Renders nothing; mounted once in the root
 * layout. Two jobs: mark the document once the page has scrolled, so the
 * header can condense; and reveal any element marked data-reveal as it
 * enters the viewport. Both respect prefers-reduced-motion, and the reveal
 * is fail-safe by construction: its hidden state is gated on html.js, which
 * this component sets only once it is running — see the effect below.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const update = () => {
      root.classList.toggle("is-scrolled", window.scrollY > 24);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Re-run on every route change: a new page brings new elements to observe.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const all = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"),
    );
    // Whatever is already on screen is shown at once, in the same tick that
    // the hidden state is switched on (html.js), so the two cancel before the
    // next paint: a first load never blinks, and a page whose script never
    // runs is never hidden. Only what is off-screen is held for the scroll.
    const vh = window.innerHeight;
    const pending: HTMLElement[] = [];
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add("is-in");
      else pending.push(el);
    }
    document.documentElement.classList.add("js");
    if (pending.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
