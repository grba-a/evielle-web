"use client";

import Image from "next/image";
import { useState } from "react";
import { PRICE_PENDING, PRODUCTS, SET } from "@/lib/products";
import { AddToCart } from "./cart";
import styles from "./SetFan.module.css";

// Three polaroids stacked; a tap fans them out like cards.
export default function SetFan() {
  const [open, setOpen] = useState(false);

  return (
    <section id="set" className={styles.section} aria-labelledby="set-naslov">
      <div className={styles.text}>
        <h2 id="set-naslov" className={styles.title}>Sva tri, jedna vrećica.</h2>
        <p className={styles.sub}>Body Butter, Refreshing Mist i Dry Body Oil u pamučnoj vrećici Evielle.</p>
      </div>
      <button
        type="button"
        className={styles.fan}
        data-open={open ? "" : undefined}
        onClick={() => setOpen((o) => !o)}
        aria-pressed={open}
        aria-label={open ? "Složi fotke seta" : "Raširi fotke seta"}
      >
        {PRODUCTS.map((p) => (
          <Image key={p.id} src={p.image} alt="" width={460} height={575} sizes="(min-width: 900px) 260px, 48vw" />
        ))}
      </button>
      <div className={styles.buy}>
        <span>{PRICE_PENDING}</span>
        <AddToCart id={SET.id} className={styles.btn}>Dodaj set</AddToCart>
      </div>
    </section>
  );
}
