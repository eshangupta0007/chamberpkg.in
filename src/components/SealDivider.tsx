import Image from "next/image";

/**
 * The chamber seal, rendered as a pressed/embossed relief mark between
 * page sections. Desaturated (grayscale) and given a light-above /
 * dark-below drop-shadow pair to read as stamped into the page rather
 * than as a colour logo.
 */
export function SealDivider({ className = "" }: { className?: string }) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`flex items-center gap-5 ${className}`}
    >
      <span className="h-px flex-1 bg-line/70" />
      <Image
        src="/images/logo-seal.png"
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 shrink-0 opacity-[0.65] [filter:grayscale(1)_contrast(1.25)_drop-shadow(0_1px_0_rgba(255,255,255,0.55))_drop-shadow(0_-1px_0.5px_rgba(0,0,0,0.4))]"
      />
      <span className="h-px flex-1 bg-line/70" />
    </div>
  );
}
