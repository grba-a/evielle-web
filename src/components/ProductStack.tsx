"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "./cart";
import Ph from "./Ph";
import styles from "./ProductStack.module.css";

// Each product is a card in its label colour (design review D10). On a phone the cards stack like a deck of
// postcards while you scroll (motion P2, CSS only); Dry Body Oil catches one golden glint (motion P3).
export default function ProductStack() {
  const { add, openProduct } = useCart();
  const glint = useRef<HTMLDivElement>(null);

  // Browsers without scroll-driven animations play the glint once when the bottle is 60% in view.
  useEffect(() => {
    const el = glint.current;
    if (!el || CSS.supports("animation-timeline: view()") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.setAttribute("data-play", ""); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="proizvodi" className={styles.section} aria-labelledby="proizvodi-naslov">
      <h2 id="proizvodi-naslov" className={styles.title}>Ljeto u tri boje.</h2>
      <div className={styles.grid}>
        {PRODUCTS.map((p, i) => (
          <article key={p.id} className={styles.card} style={{ "--pc": p.color, "--pi": p.ink, "--i": i } as React.CSSProperties}>
            <button type="button" className={styles.image} onClick={() => openProduct(p.id)} aria-label={`${p.name}, detalji`}>
              <Image src={p.image} alt="" fill sizes="(min-width: 900px) 30vw, 92vw" />
              {p.id === "oil" && <div ref={glint} className={styles.glint} aria-hidden="true" />}
            </button>
            <div className={styles.info}>
              <div>
                <h3 className={styles.name} lang="en">{p.name}</h3>
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
