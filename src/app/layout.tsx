import type { Metadata } from "next";
import "./globals.css";
import { VersionBadge } from "@/components/shared/VersionBadge";

export const metadata: Metadata = {
  title: "Eran's 50th Birthday Meme Game",
  description: "A fun party game for Eran's 50th birthday bash!",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎂</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <VersionBadge />
      </body>
    </html>
  );
}
