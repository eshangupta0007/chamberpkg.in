import Image from "next/image";

/**
 * The chamber seal as a gilt mark between sections. On the earlier light
 * ground it was desaturated and embossed; on ink the honest material is gold
 * leaf, so it keeps its colour, sits at near-full strength, and carries a
 * faint bloom. The rules either side fade out toward the margins.
 */
export function SealDivider({ className = "" }: { className?: string }) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`flex items-center gap-6 ${className}`}
    >
      <span className="h-px flex-1 [background:linear-gradient(to_right,transparent,rgba(201,169,97,0.55))]" />
      <Image
        src="/images/logo-seal.png"
        alt=""
        width={44}
        height={44}
        className="gilt-glow h-10 w-10 shrink-0 opacity-90"
      />
      <span className="h-px flex-1 [background:linear-gradient(to_left,transparent,rgba(201,169,97,0.55))]" />
    </div>
  );
}
