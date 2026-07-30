import type { SVGProps } from "react";

type SealProps = SVGProps<SVGSVGElement>;

/**
 * Placeholder seal — Eshan to supply the real gold seal artwork (Ionic column,
 * scales, Greek-key ring, "SINCE 1991") described in the spec; swap the <svg>
 * body below for the final asset without changing call sites.
 */
export function Seal({ className, "aria-hidden": ariaHidden, ...rest }: SealProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role={ariaHidden ? undefined : "img"}
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : "Chamber of Praveen Kumar Gupta seal"}
      {...rest}
    >
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />

      <text
        x="100"
        y="42"
        textAnchor="middle"
        fontSize="9"
        letterSpacing="2"
        fill="currentColor"
        fontFamily="var(--font-sans, sans-serif)"
      >
        CHAMBER OF
      </text>
      <text
        x="100"
        y="53"
        textAnchor="middle"
        fontSize="9"
        letterSpacing="1.5"
        fill="currentColor"
        fontFamily="var(--font-sans, sans-serif)"
      >
        PRAVEEN KUMAR GUPTA
      </text>

      {/* Ionic column, simplified */}
      <g stroke="currentColor" strokeWidth="2" fill="none">
        <line x1="80" y1="145" x2="120" y2="145" />
        <line x1="83" y1="140" x2="117" y2="140" />
        <line x1="88" y1="90" x2="88" y2="140" />
        <line x1="112" y1="90" x2="112" y2="140" />
        <line x1="83" y1="90" x2="117" y2="90" />
        <line x1="80" y1="85" x2="120" y2="85" />
        <path d="M85 85 q0 -6 5 -6 M95 85 q0 -6 5 -6 M105 85 q0 -6 5 -6 M115 85 q0 -6 -5 -6" />
      </g>

      {/* Scales of justice, simplified */}
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <line x1="100" y1="150" x2="100" y2="168" />
        <line x1="80" y1="152" x2="120" y2="152" />
        <line x1="80" y1="152" x2="74" y2="163" />
        <line x1="80" y1="152" x2="86" y2="163" />
        <path d="M74 163 a6 6 0 0 0 12 0" />
        <line x1="120" y1="152" x2="114" y2="163" />
        <line x1="120" y1="152" x2="126" y2="163" />
        <path d="M114 163 a6 6 0 0 0 12 0" />
      </g>

      <text
        x="100"
        y="182"
        textAnchor="middle"
        fontSize="8"
        letterSpacing="2"
        fill="currentColor"
        fontFamily="var(--font-sans, sans-serif)"
      >
        SINCE 1991
      </text>
    </svg>
  );
}
