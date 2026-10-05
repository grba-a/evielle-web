import type { Metadata, Viewport } from "next";
import { Tenor_Sans, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const display = Tenor_Sans({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Evielle Skin Care",
  description: "Evielle, njega tijela za ljeto. Web trgovina uskoro.",
};

export const viewport: Viewport = {
  themeColor: "#0B3433",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hr" className={`${display.variable} ${body.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
