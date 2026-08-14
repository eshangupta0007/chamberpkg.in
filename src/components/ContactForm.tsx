"use client";

import { useState, type FormEvent } from "react";
import type { Lang } from "./LanguageToggle";
import { hiContactForm } from "@/lib/i18n-hi";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ lang = "en" }: { lang?: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isHi = lang === "hi";
  const t = hiContactForm;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setErrorMessage(
          json.error ?? (isHi ? t.genericError : "Something went wrong. Please try again."),
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage(isHi ? t.genericError : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line bg-paper p-6 text-sm text-charcoal">
        {isHi
          ? t.success
          : "Your message has been sent. The Chamber will respond in due course."}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ivory">
          {isHi ? t.name : "Name"}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1.5 w-full border border-line-strong bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ivory">
          {isHi ? t.email : "Email"}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full border border-line-strong bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ivory">
          {isHi ? t.phone : "Phone"}{" "}
          <span className="text-charcoal/90">
            {isHi ? t.optional : "(optional)"}
          </span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-1.5 w-full border border-line-strong bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ivory">
          {isHi ? t.message : "Message"}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full border border-line-strong bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-error-red">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-cherry-red px-6 py-2.5 text-sm text-deep-text hover:bg-cherry-red-deep disabled:opacity-50"
      >
        {status === "submitting"
          ? isHi
            ? t.sending
            : "Sending…"
          : isHi
            ? t.send
            : "Send Message"}
      </button>
    </form>
  );
}
