import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SlamDB — The Pro Wrestling Move Database",
  description:
    "A searchable database of professional wrestling moves with descriptions, images, difficulty ratings, and the legends who made them famous. Powered by a live REST API.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
