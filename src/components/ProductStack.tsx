import Image from "next/image";
import { PRICE_PENDING, PRODUCTS, productMeta } from "@/lib/products";
import { AddToCart } from "./cart";
import styles from "./ProductStack.module.css";

// Each product is a card in its label colour; on a phone the cards stack over each other as you scroll.
export default function ProductStack() {
  return (
    <section id="proizvodi" className={styles.section} aria-labelledby="proizvodi-naslov">
      <h2 id="proizvodi-naslov" className={styles.title}>Tri za ljeto</h2>
      <div className={styles.grid}>
        {PRODUCTS.map((p) => (
          <article key={p.id} className={styles.card} style={{ "--pc": p.color, "--pi": p.ink } as React.CSSProperties}>
            <div className={styles.image}>
              <Image src={p.image} alt={p.name} fill sizes="(min-width: 900px) 30vw, 92vw" />
            </div>
            <div className={styles.info}>
              <div>
                <h3 className={styles.name}>{p.name}</h3>
                <span>{productMeta(p)}</span>
                <span>{PRICE_PENDING}</span>
              </div>
              <AddToCart id={p.id} className={styles.btn}>U košaricu</AddToCart>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
