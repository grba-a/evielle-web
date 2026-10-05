import { CartProvider } from "@/components/cart";
import FooterFrame from "@/components/FooterFrame";
import HeroStories from "@/components/HeroStories";
import NewsletterPostcard from "@/components/NewsletterPostcard";
import ProductStack from "@/components/ProductStack";
import SetFan from "@/components/SetFan";
import SiteHeader from "@/components/SiteHeader";
import TrustStrips from "@/components/TrustStrips";

// Tells search engines that Evielle Skin Care is a brand of its own, not a misspelt Eveline (SEO review).
const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Evielle Skin Care",
  alternateName: "Evielle",
  url: "https://evielle-web.vercel.app",
};

export default function Home() {
  return (
    <CartProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <main>
        <HeroStories />
        <ProductStack />
        <SetFan />
        <TrustStrips />
        <NewsletterPostcard />
      </main>
      <FooterFrame />
    </CartProvider>
  );
}
