import type { Metadata } from "next";
import './globals.css';

export const metadata: Metadata = {
  title: "Silsila Digital — Creative developer portfolio",
  description: "Immersive digital experiences, thoughtful interfaces, and intelligent products.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
