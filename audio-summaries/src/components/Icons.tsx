import type { ReactNode } from "react";

function Icon({ children, size = 20 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const PlayIcon = ({ size }: { size?: number }) => (
  <Icon size={size}><path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.8-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14z" /></Icon>
);
export const PauseIcon = ({ size }: { size?: number }) => (
  <Icon size={size}><rect x="6" y="5" width="4.5" height="14" rx="1" /><rect x="13.5" y="5" width="4.5" height="14" rx="1" /></Icon>
);
export const PrevIcon = ({ size }: { size?: number }) => (
  <Icon size={size}><rect x="5" y="5" width="2.5" height="14" rx="1" /><path d="M19 6.1v11.8a.8.8 0 0 1-1.25.66l-8.2-5.9a.8.8 0 0 1 0-1.32l8.2-5.9A.8.8 0 0 1 19 6.1z" /></Icon>
);
export const NextIcon = ({ size }: { size?: number }) => (
  <Icon size={size}><rect x="16.5" y="5" width="2.5" height="14" rx="1" /><path d="M5 6.1v11.8a.8.8 0 0 0 1.25.66l8.2-5.9a.8.8 0 0 0 0-1.32l-8.2-5.9A.8.8 0 0 0 5 6.1z" /></Icon>
);
export const MoonIcon = ({ size }: { size?: number }) => (
  <Icon size={size}><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15a.6.6 0 0 0-.7-.8z" /></Icon>
);
export const CloseIcon = ({ size }: { size?: number }) => (
  <Icon size={size}><path d="M6.7 5.3 12 10.6l5.3-5.3 1.4 1.4-5.3 5.3 5.3 5.3-1.4 1.4-5.3-5.3-5.3 5.3-1.4-1.4 5.3-5.3-5.3-5.3z" /></Icon>
);
export const SearchIcon = ({ size }: { size?: number }) => (
  <Icon size={size}><path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.3 4.3-1.4 1.4-4.3-4.3A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z" /></Icon>
);
