import Image from "next/image";
import { PRICE_PENDING, PRODUCTS, productMeta } from "@/lib/products";
import { AddToCart } from "./cart";
import styles from "./ProductRow.module.css";

// Placeholder for the products section until artifact 3 decides its design.
export default function ProductRow() {
  return (
    <section className={styles.section} aria-labelledby="proizvodi">
      <h2 id="proizvodi" className={styles.title}>Tri za ljeto</h2>
      <div className={styles.row}>
        {PRODUCTS.map((p) => (
          <article key={p.id} className={styles.card}>
            <div className={styles.image}>
              <Image src={p.image} alt={p.name} fill sizes="(min-width: 900px) 30vw, 62vw" />
              <AddToCart id={p.id} className={styles.add}>
                <span aria-hidden="true">+</span>
                <span className={styles.sr}>Dodaj {p.name} u košaricu</span>
              </AddToCart>
            </div>
            <h3 className={styles.name}>
              <i style={{ background: p.color }} aria-hidden="true" />
              {p.name}
            </h3>
            <p className={styles.meta}>{productMeta(p)}</p>
            <p className={styles.meta}>{PRICE_PENDING}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
