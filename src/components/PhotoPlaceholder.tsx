export function PhotoPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-paper text-charcoal/30 ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-1/3 w-1/3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20c1.5-4 4.5-6 7.5-6s6 2 7.5 6" />
      </svg>
    </div>
  );
}
