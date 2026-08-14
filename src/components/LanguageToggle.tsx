"use client";

export type Lang = "en" | "hi";

export function LanguageToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex border border-line text-xs"
    >
      <button
        type="button"
        onClick={() => onChange("en")}
        aria-pressed={lang === "en"}
        className={`px-3 py-1.5 ${
          lang === "en"
            ? "bg-gold-deep text-paper"
            : "text-charcoal hover:text-gold-text"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("hi")}
        aria-pressed={lang === "hi"}
        className={`px-3 py-1.5 border-l border-line ${
          lang === "hi"
            ? "bg-gold-deep text-paper"
            : "text-charcoal hover:text-gold-text"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
