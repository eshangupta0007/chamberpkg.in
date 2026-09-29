"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { SealDivider } from "@/components/SealDivider";
import { LanguageToggle, type Lang } from "@/components/LanguageToggle";
import { practiceAreas } from "@/lib/practice-areas";
import { team } from "@/lib/team";
import { attorneyJsonLd } from "@/lib/structured-data";
import { hiHome, hiPracticeAreas } from "@/lib/i18n-hi";

const wrap = "mx-auto max-w-[90rem] px-6 md:px-10 lg:px-14";
const stagger = (i: number): CSSProperties =>
  ({ "--reveal-delay": `${Math.min(i, 6) * 55}ms` }) as CSSProperties;

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const isHi = lang === "hi";

  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  // Two pieces of hero motion, one rAF: a pool of gold light that follows a
  // fine pointer across the hero, and a slight parallax lag on the seal as
  // the page starts to scroll. Neither runs under reduced motion; the glow
  // is also skipped for touch, where there is no pointer to follow.
  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;
    const seal = sealRef.current;
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let raf = 0;
    let px = 0, py = 0, sy = 0;
    const paint = () => {
      raf = 0;
      if (glow && fine) glow.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      if (seal) seal.style.transform = `translate3d(0, ${sy * -0.14}px, 0)`;
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      queue();
    };
    const onScroll = () => {
      sy = Math.min(window.scrollY, hero.offsetHeight);
      queue();
    };
    if (fine) hero.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div lang={isHi ? "hi" : undefined}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(attorneyJsonLd()) }}
      />

      {/* Hero. The name at the largest scale on the site, flush left; the seal
          held to the right under a drifting bloom; the standing line and the
          two actions ruled off beneath. */}
      <section
        ref={heroRef}
        className={`${wrap} group relative flex min-h-[calc(100svh-4.75rem)] flex-col overflow-hidden pb-14 pt-8`}
      >
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 hidden h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(closest-side,rgba(201,169,97,0.14),rgba(201,169,97,0.05)_45%,transparent_72%)] opacity-0 transition-opacity duration-700 will-change-transform group-hover:opacity-100 lg:block"
        />

        <div className="rise rise-1 relative flex items-center justify-between gap-4">
          <p className="label-caps text-xs text-gold-text">
            {isHi ? "स्थापना 1991" : "Established 1991"}
          </p>
          <LanguageToggle lang={lang} onChange={setLang} />
        </div>

        <div className="relative mt-auto grid items-end gap-10 pt-16 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <Image
              src="/images/logo-seal.png"
              alt="Chamber of Praveen Kumar Gupta seal"
              width={72}
              height={72}
              className="rise rise-2 gilt-glow mb-8 h-14 w-14 lg:hidden"
              priority
            />
            <h1 className="display-tight font-serif text-[clamp(2.6rem,7.2vw,6.25rem)] font-semibold leading-[0.94] text-ivory">
              <span className="rise rise-2 block">Chamber of</span>
              <span className="rise rise-3 block">Praveen Kumar</span>
              <span className="rise rise-4 block">Gupta</span>
            </h1>
          </div>

          <div className="rise rise-3 hidden justify-end lg:col-span-3 lg:flex">
            {/* Parallax on the wrapper, rotation on the image: two transforms
                on one element would fight, and the entrance animation's fill
                would pin the wrapper. */}
            <div ref={sealRef} className="relative will-change-transform">
              <span
                aria-hidden="true"
                className="ambient-drift pointer-events-none absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold-primary/[0.13] blur-3xl"
              />
              <Image
                src="/images/logo-seal.png"
                alt="Chamber of Praveen Kumar Gupta seal"
                width={240}
                height={240}
                className="seal-turn gilt-glow relative h-40 w-40 xl:h-52 xl:w-52"
                priority
              />
            </div>
          </div>
        </div>

        <div className="rise rise-5 relative mt-12 grid gap-8 border-t border-line pt-8 lg:grid-cols-12 lg:items-center">
          <p className="max-w-[44ch] text-base leading-relaxed text-charcoal md:text-lg lg:col-span-6">
            {isHi ? (
              hiHome.heroLine
            ) : (
              <>
                Advocates, Hon&rsquo;ble Supreme Court of India, Allahabad
                High Court, and District Courts, Uttar Pradesh. Established
                1991.
              </>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-4 lg:col-span-6 lg:justify-end">
            <Link
              href="/practice-areas"
              className="label-caps border border-line-strong px-6 py-3 text-sm text-ivory transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-gold-primary hover:text-gold-text"
            >
              {isHi ? hiHome.ctaPractice : "View Practice Areas"}
            </Link>
            <Link
              href="/contact"
              className="label-caps bg-cherry-red px-6 py-3 text-sm text-deep-text transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-cherry-red-deep hover:shadow-[0_12px_30px_-12px_rgba(138,47,53,0.8)]"
            >
              {isHi ? hiHome.ctaContact : "Contact the Chamber"}
            </Link>
          </div>
        </div>
      </section>

      {/* Legacy, set as a single statement beside a marginal label. */}
      <section className="border-t border-line bg-paper">
        <div className={`${wrap} grid gap-10 py-20 lg:grid-cols-12 lg:py-24`}>
          <div className="lg:col-span-3" data-reveal>
            <p className="label-caps text-xs text-gold-text">
              {isHi ? "स्थापना 1991" : "Since 1991"}
            </p>
            <SealDivider className="mt-6 max-w-[12rem]" />
          </div>
          <div className="lg:col-span-8 lg:col-start-5" data-reveal style={stagger(1)}>
            <p className="display-tight font-serif text-xl font-semibold leading-[1.3] text-ivory md:text-[1.6rem] md:leading-[1.28]">
              {isHi ? (
                hiHome.legacyLine
              ) : (
                <>
                  Established in 1991, the Chamber has practiced continuously
                  across the district judiciary of Lucknow and the Allahabad
                  High Court — today under the stewardship of Eshan Kumar
                  Gupta, Proprietor.
                </>
              )}
            </p>
            <Link
              href="/about"
              className="label-caps mt-8 inline-block text-sm text-gold-text transition-colors hover:text-gold-bright"
            >
              {isHi ? hiHome.historyLink : "Read the Chamber’s history →"}
            </Link>
          </div>
        </div>
      </section>

      {/* Areas of practice, as the contents leaf of a bound volume: numeral,
          title, summary, in ruled rows that arrive one after another. */}
      <section className={`${wrap} py-20 lg:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
          <h2 className="display-tight font-serif text-[clamp(1.65rem,2.8vw,2.4rem)] font-semibold leading-[1.05] text-ivory">
            {isHi ? hiHome.practiceHeading : "Areas of Practice"}
          </h2>
          <p className="label-caps text-xs text-muted">§01 – §09</p>
        </div>

        <ol className="mt-8 border-t border-line">
          {practiceAreas.map((area, i) => {
            const n = String(i + 1).padStart(2, "0");
            const hi = hiPracticeAreas[area.slug];
            return (
              <li key={area.slug} className="border-b border-line" data-reveal style={stagger(i)}>
                <Link
                  href={`/practice-areas#${area.slug}`}
                  className="group relative grid gap-x-8 gap-y-1.5 py-6 transition-colors before:absolute before:inset-y-0 before:left-0 before:w-px before:origin-top before:scale-y-0 before:bg-gold-primary before:transition-transform before:duration-500 before:ease-[var(--ease-settle)] hover:bg-paper hover:before:scale-y-100 md:-mx-4 md:grid-cols-12 md:items-baseline md:px-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-serif text-2xl font-semibold leading-none text-gold-primary/45 tabular-nums transition-colors group-hover:text-gold-primary md:col-span-2 md:text-4xl"
                  >
                    {n}
                  </span>
                  <h3 className="display-tight font-serif text-lg font-semibold leading-tight text-ivory transition-colors group-hover:text-gold-text md:col-span-5 md:text-[1.35rem]">
                    {isHi ? hi.title : area.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-charcoal md:col-span-4 md:text-[0.95rem]">
                    {isHi ? hi.summary : area.summary}
                  </p>
                  <span
                    aria-hidden="true"
                    className="hidden text-gold-primary/60 transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-gold-primary md:col-span-1 md:block md:text-right"
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* The Chamber. Portraits large, names beneath. */}
      <section className="border-t border-line bg-paper">
        <div className={`${wrap} py-20 lg:py-24`}>
          <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
            <h2 className="display-tight font-serif text-[clamp(1.65rem,2.8vw,2.4rem)] font-semibold leading-[1.05] text-ivory">
              {isHi ? hiHome.teamHeading : "The Chamber"}
            </h2>
            <Link
              href="/team"
              className="label-caps text-xs text-gold-text transition-colors hover:text-gold-bright"
            >
              {isHi ? "सभी सदस्य →" : "All members →"}
            </Link>
          </div>
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <Link
                key={member.slug}
                href={`/team#${member.slug}`}
                className="group block"
                data-reveal="img"
                style={stagger(i)}
              >
                <div className="overflow-hidden border border-line bg-ink transition-[border-color,box-shadow] duration-500 group-hover:border-gold-primary/70 group-hover:shadow-[0_24px_50px_-30px_rgba(201,169,97,0.35)]">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={600}
                      height={750}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="portrait-tone aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[var(--ease-settle)] group-hover:scale-[1.03]"
                    />
                  ) : (
                    <PhotoPlaceholder className="aspect-[4/5] w-full" />
                  )}
                </div>
                <p className="display-tight mt-4 font-serif text-lg font-semibold text-ivory transition-colors group-hover:text-gold-text">
                  {member.name}
                </p>
                <p className="label-caps mt-1 text-xs text-gold-text">
                  {member.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
