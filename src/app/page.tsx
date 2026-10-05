import { CartProvider } from "@/components/cart";
import HeroStories from "@/components/HeroStories";
import ProductRow from "@/components/ProductRow";

export default function Home() {
  return (
    <CartProvider>
      <main>
        <HeroStories />
        <ProductRow />
      </main>
    </CartProvider>
  );
}
