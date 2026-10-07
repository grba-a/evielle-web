import FooterFrame from "@/components/FooterFrame";
import HeroStories from "@/components/HeroStories";
import NewsletterPostcard from "@/components/NewsletterPostcard";
import OnSkin from "@/components/OnSkin";
import ProductStack from "@/components/ProductStack";
import SetFeature from "@/components/SetFeature";
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <main>
        <HeroStories />
        <ProductStack />
        <SetFeature />
        <OnSkin />
        <TrustStrips />
        <NewsletterPostcard />
      </main>
      <FooterFrame />
    </>
  );
}
