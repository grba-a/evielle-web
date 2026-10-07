"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FROM_CLIENT, PRODUCTS, SET, productById, productLine, type Product } from "@/lib/products";
import { AddToCart, OpenDelivery, useCart } from "./cart";
import Ph from "./Ph";
import ShipToday from "./ShipToday";
import styles from "./ProductPage.module.css";

// The quick sheet from the homepage, grown into a page: a five-photo gallery (still life, in use, in the hand,
// mood, set; Petar, artifact 7), the price the way the law wants it, the facts the client still owes, and the
// other two products plus the set underneath. Photos are plain, rounded, with a shadow: no colour frame.
export default function ProductPage({ id }: { id: Product["id"] }) {
  const { add } = useCart();
  const p = productById(id)!;
  const others = PRODUCTS.filter((o) => o.id !== id);
  const [shown, setShown] = useState(1);

  return (
    <article className={styles.page}>
      {/* the photo stays put on wide screens only while the details scroll past it */}
      <div className={styles.top}>
        <div className={styles.media}>
          {/* phones: swipe, the next photo peeks in; wide screens: the photos stack and the details stay put */}
          <ul
            className={styles.gallery}
            aria-label={`Fotke: ${p.name}`}
            onScroll={(e) => {
              const el = e.currentTarget;
              const item = el.firstElementChild as HTMLElement | null;
              if (item) setShown(Math.min(p.gallery.length, Math.round(el.scrollLeft / (item.offsetWidth + 12)) + 1));
            }}
          >
            {p.gallery.map((src, k) => (
              <li key={src}>
                <Image
                  src={src}
                  alt={k === 0 ? `${p.name}, ${p.type}` : `${p.name}, fotka ${k + 1} od ${p.gallery.length}`}
                  width={1200}
                  height={1500}
                  sizes="(min-width: 900px) 46vw, 80vw"
                  loading={k === 0 ? "eager" : undefined}
                  fetchPriority={k === 0 ? "high" : undefined}
                />
              </li>
            ))}
          </ul>
          <p className={styles.counter} aria-hidden="true">{shown} / {p.gallery.length}</p>
        </div>

        <div className={styles.info}>
          <Link href="/#proizvodi" className={styles.back}>Svi proizvodi</Link>
          <h1 className={styles.name} lang="en">{p.name}</h1>
          <p className={styles.type}>{productLine(p)}<span lang="en"> · {p.variant}</span></p>
          <div className={styles.price}>
            <b><Ph /> · <Ph>Y €/L</Ph></b>
            <span>Cijena na <Ph>datum lansiranja</Ph></span>
          </div>
          <div className={styles.buy}>
            <button type="button" className={styles.btn} onClick={(e) => add(p.id, e.currentTarget)}>U košaricu</button>
            <ShipToday />
            <p className={styles.pay}>Kartice · Apple Pay · Google Pay · Pouzeće</p>
          </div>
          <dl className={styles.facts}>
            <dt>Što radi</dt><dd><Ph>{FROM_CLIENT}</Ph></dd>
            <dt>Miris</dt><dd><Ph>{FROM_CLIENT}</Ph></dd>
            <dt>Tekstura</dt><dd><Ph>{FROM_CLIENT}</Ph></dd>
          </dl>
          {p.spfNote && <p className={styles.spf}>Nema zaštitni faktor (SPF). Na suncu uz njega koristi kremu za sunčanje.</p>}
          <details className={styles.more}><summary>Kako koristiti</summary><p><Ph>{FROM_CLIENT}</Ph></p></details>
          <details className={styles.more}><summary>Sastojci (INCI)</summary><p><Ph>{FROM_CLIENT}</Ph></p></details>
          <OpenDelivery className={styles.link}>Dostava i povrat</OpenDelivery>
        </div>
      </div>

      <section className={styles.with} aria-labelledby="uz-ovo">
        <h2 id="uz-ovo" className={styles.withT}>Uz ovo ide</h2>
        <div className={styles.withGrid}>
          {others.map((o) => (
            <Link key={o.id} href={`/${o.slug}`} className={styles.other}>
              <span className={styles.otherImg}><Image src={o.image} alt="" fill sizes="(min-width: 900px) 280px, 45vw" /></span>
              <b lang="en">{o.name}</b>
              <span>{o.type}</span>
            </Link>
          ))}
          <div className={styles.set}>
            <span className={styles.setImg}><Image src={SET.image} alt="Pamučna vrećica Evielle s tri proizvoda" fill sizes="(min-width: 900px) 280px, 120px" /></span>
            <div>
              <b>Sva tri u pamučnoj vrećici</b>
              <span><Ph /></span>
              <AddToCart id="set" className={styles.setBtn}>Dodaj set</AddToCart>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
