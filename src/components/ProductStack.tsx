"use client";

import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "./cart";
import Ph from "./Ph";
import styles from "./ProductStack.module.css";

// Each product is its still life from the Pašman shoot: the photo alone, rounded, with a soft shadow
// (Petar, artifact 7: no colour frame). On a phone the cards stack like a deck while you scroll (motion P2, CSS only).
export default function ProductStack() {
  const { add, openProduct } = useCart();

  return (
    <section id="proizvodi" className={styles.section} aria-labelledby="proizvodi-naslov">
      <h2 id="proizvodi-naslov" className={styles.title}>Ljeto u tri boje.</h2>
      <div className={styles.grid}>
        {PRODUCTS.map((p, i) => (
          <article key={p.id} className={styles.card} style={{ "--i": i } as React.CSSProperties}>
            <button type="button" className={styles.image} onClick={() => openProduct(p.id)} aria-label={`${p.name}, detalji`}>
              <Image src={p.image} alt="" fill sizes="(min-width: 900px) 30vw, 92vw" />
            </button>
            <div className={styles.info}>
              <div>
                <h3 className={styles.name} lang="en"><Link href={`/${p.slug}`}>{p.name}</Link></h3>
                <span>{[p.type, p.size].filter(Boolean).join(" · ")}</span>
                <span><Ph /></span>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.btn} onClick={(e) => add(p.id, e.currentTarget)}>U košaricu</button>
                <button type="button" className={styles.more} onClick={() => openProduct(p.id)}>Detalji</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
