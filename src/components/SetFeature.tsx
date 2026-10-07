"use client";

import { getImageProps } from "next/image";
import { SET, WIDE_QUERY, setHeadline } from "@/lib/products";
import { useMonth } from "@/lib/useMonth";
import { useCart } from "./cart";
import Ph from "./Ph";
import styles from "./SetFeature.module.css";

// One photo of the real set replaces the polaroid fan (Petar, artifact 7: set). Phones get the 4:5 crop
// without the glass, wide screens the native 3:2 next to the text. In December the headline turns to the tree.
export default function SetFeature() {
  const { add } = useCart();
  const month = useMonth();
  const alt = "Pamučna vrećica Evielle s Body Butterom, Refreshing Mistom i Dry Body Oilom";
  const { props: { srcSet: wide } } = getImageProps({ alt, src: SET.imageWide, width: 2400, height: 1600, sizes: "60vw" });
  const { props: { srcSet: tall, ...rest } } = getImageProps({ alt, src: SET.image, width: 1200, height: 1500, sizes: "100vw" });

  return (
    <section id="set" className={styles.section} aria-labelledby="set-naslov">
      <picture className={styles.photo}>
        <source media={WIDE_QUERY} srcSet={wide} sizes="60vw" />
        <source srcSet={tall} sizes="100vw" />
        <img {...rest} alt={alt} />
      </picture>
      <div className={styles.text}>
        <h2 id="set-naslov" className={styles.title}>{setHeadline(month)}</h2>
        <p className={styles.sub}>Sva tri u pamučnoj vrećici.</p>
        <p className={styles.price}><Ph /></p>
        <div className={styles.btns}>
          <button type="button" className={styles.btn} onClick={(e) => add("set", e.currentTarget)}>Dodaj set</button>
          <button type="button" className={styles.gift} onClick={(e) => add("gift", e.currentTarget)}>Pošalji kao poklon</button>
        </div>
      </div>
    </section>
  );
}
