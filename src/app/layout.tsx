import type { Metadata, Viewport } from "next";
import { Tenor_Sans, Hanken_Grotesk } from "next/font/google";
import { CartProvider } from "@/components/cart";
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

const TITLE = "Evielle Skin Care · ulje, maslac i sprej za tijelo";
const DESCRIPTION = "Body Butter, Refreshing Mist i Dry Body Oil: maslac, osvježavajući sprej i suho ulje za tijelo.";

// This site is the design prototype; the shop itself is built in WordPress + WooCommerce, so it stays out of search.
export const metadata: Metadata = {
  metadataBase: new URL("https://evielle-web.vercel.app"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: "Evielle Skin Care",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0B3433",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hr" className={`${display.variable} ${body.variable} antialiased`}>
      <body>
        {/* the cart lives above the pages, so it survives moving between the homepage and a product page */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
