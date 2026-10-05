import type { Metadata, Viewport } from "next";
import { Tenor_Sans, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const display = Tenor_Sans({
  variable: "--ff-display",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const body = Hanken_Grotesk({
  variable: "--ff-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Evielle Skin Care",
  description: "Body Butter, Refreshing Mist i Dry Body Oil. Evielle, njega tijela za ljeto.",
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
