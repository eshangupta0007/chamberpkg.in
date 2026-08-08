import type { ReactNode } from "react";
import { socialLinks } from "@/lib/site-data";

const icons: Record<(typeof socialLinks)[number]["name"], ReactNode> = {
  Facebook: (
    <path d="M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.87.24-1.46 1.49-1.46H16.5V4.36C16.24 4.32 15.35 4.25 14.31 4.25c-2.17 0-3.66 1.32-3.66 3.75V10.5H8.13v3h2.52V21h2.85Z" />
  ),
  LinkedIn: (
    <path d="M6.94 8.5H4.06V19h2.88V8.5ZM5.5 4.25a1.67 1.67 0 1 0 0 3.34 1.67 1.67 0 0 0 0-3.34ZM19.94 19h-2.88v-5.4c0-1.29-.46-2.17-1.6-2.17-.87 0-1.39.59-1.62 1.15-.08.2-.1.49-.1.77V19H10.9s.04-9.6 0-10.5h2.88v1.49c.38-.59 1.07-1.43 2.6-1.43 1.9 0 3.32 1.24 3.32 3.9V19Z" />
  ),
  Instagram: (
    <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm0 5.94A2.34 2.34 0 1 1 12 9.66a2.34 2.34 0 0 1 0 4.68ZM16.9 8.26a.84.84 0 1 1-1.68 0 .84.84 0 0 1 1.68 0Z" />
  ),
};

export function SocialIcons({ className }: { className?: string }) {
  return (
    <div className={className}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${social.name} (opens in a new tab)`}
          className="text-deep-text/80 hover:text-gold-primary"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
          >
            {social.name === "Instagram" && (
              <rect
                x="3.5"
                y="3.5"
                width="17"
                height="17"
                rx="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            )}
            {icons[social.name]}
          </svg>
        </a>
      ))}
    </div>
  );
}
