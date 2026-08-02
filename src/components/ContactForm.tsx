"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded border border-line bg-paper p-6 text-sm text-charcoal">
        Your message has been sent. The Chamber will respond in due course.
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
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1.5 w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ivory">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ivory">
          Phone <span className="text-charcoal/80">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-1.5 w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ivory">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1.5 w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-error-red">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded bg-cherry-red px-6 py-2.5 text-sm text-ivory hover:bg-cherry-red-deep disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
