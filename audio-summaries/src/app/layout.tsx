import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { MiniPlayer } from "@/components/MiniPlayer";
import { PlayerProvider } from "@/components/PlayerProvider";

export const metadata: Metadata = {
  title: { default: "Précis — listen to book summaries", template: "%s | Précis" },
  description: "Search any book, then read or listen to a summary written by Claude.",
};

export const viewport: Viewport = { themeColor: "#12100e", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PlayerProvider>
          <Header />
          <main className="main">{children}</main>
          <MiniPlayer />
        </PlayerProvider>
      </body>
    </html>
  );
}
