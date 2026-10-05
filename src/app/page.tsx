import { CartProvider } from "@/components/cart";
import FooterFrame from "@/components/FooterFrame";
import HeroStories from "@/components/HeroStories";
import NewsletterPostcard from "@/components/NewsletterPostcard";
import ProductStack from "@/components/ProductStack";
import SetFan from "@/components/SetFan";
import SiteHeader from "@/components/SiteHeader";
import TrustStrips from "@/components/TrustStrips";

export default function Home() {
  return (
    <CartProvider>
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
