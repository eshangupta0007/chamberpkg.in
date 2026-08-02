"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { disclaimerParagraphs } from "@/lib/disclaimer-text";

const STORAGE_KEY = "cpkg-disclaimer-agreed";

export function DisclaimerGate() {
  const [open, setOpen] = useState(false);
  const disagreeRef = useRef<HTMLButtonElement>(null);
  const agreeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const agreed = window.localStorage.getItem(STORAGE_KEY);
    if (agreed !== "true") {
      // Reading localStorage (an external system) requires an effect; SSR has no window.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    agreeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  function agree() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  function disagree() {
    window.location.href = "about:blank";
  }

  // Only two focusable elements, so a full trap is just wrapping Tab between them.
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === disagreeRef.current) {
      e.preventDefault();
      agreeRef.current?.focus();
    } else if (!e.shiftKey && document.activeElement === agreeRef.current) {
      e.preventDefault();
      disagreeRef.current?.focus();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-heading"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep/90 p-4"
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded border border-line bg-paper p-8">
        <Image
          src="/images/logo-seal.png"
          alt="Chamber of Praveen Kumar Gupta seal"
          width={64}
          height={64}
          className="mx-auto h-16 w-16"
        />
        <h2
          id="disclaimer-heading"
          className="mt-4 text-center font-serif text-xl font-semibold text-ivory"
        >
          Disclaimer
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-charcoal">
          {disclaimerParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            ref={disagreeRef}
            type="button"
            onClick={disagree}
            className="rounded border border-line px-5 py-2.5 text-sm text-charcoal hover:bg-ink focus:outline-none focus:ring-1 focus:ring-gold-deep"
          >
            Disagree — Exit
          </button>
          <button
            ref={agreeRef}
            type="button"
            onClick={agree}
            className="rounded bg-gold-primary px-5 py-2.5 text-sm font-medium text-ivory hover:bg-gold-deep focus:outline-none focus:ring-1 focus:ring-ivory"
          >
            I Agree — Enter Site
          </button>
        </div>
      </div>
    </div>
  );
}
