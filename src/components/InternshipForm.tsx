"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function InternshipForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      lawCollege: formData.get("lawCollege"),
      company: formData.get("company"),
    };
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setErrorMessage("Please attach your resume/CV.");
      setStatus("error");
      return;
    }
    if (file.type !== "application/pdf") {
      setErrorMessage("Resume must be a PDF file.");
      setStatus("error");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage("Resume must be 5MB or smaller.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/internships/upload",
      });

      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, resumeUrl: blob.url }),
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
        Your application has been received. The Chamber will be in touch if
        there is a suitable opening.
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
          Full Name
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
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="mt-1.5 w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      <div>
        <label htmlFor="lawCollege" className="block text-sm font-medium text-ivory">
          Law College / University
        </label>
        <input
          id="lawCollege"
          name="lawCollege"
          type="text"
          required
          className="mt-1.5 w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-ivory">
          Resume / CV <span className="text-charcoal/90">(PDF, max 5MB)</span>
        </label>
        <input
          ref={fileInputRef}
          id="resume"
          name="resume"
          type="file"
          accept="application/pdf"
          required
          className="mt-1.5 w-full rounded border border-line bg-paper px-3 py-2 text-sm text-ivory file:mr-3 file:rounded file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-sm file:text-ivory focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-error-red">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded bg-cherry-red px-6 py-2.5 text-sm text-deep-text hover:bg-cherry-red-deep disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
