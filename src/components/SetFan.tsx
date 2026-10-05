"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PRODUCTS, SET } from "@/lib/products";
import { useCart } from "./cart";
import Ph from "./Ph";
import styles from "./SetFan.module.css";

// The real bag sits on top of the three polaroids (design review D9). The fan opens once by itself when it
// comes into view, so it is clear it can be touched (motion A11). "Ljeto, zapakirano." sells it as a gift (M6).
export default function SetFan() {
  const [open, setOpen] = useState(false);
  const fan = useRef<HTMLButtonElement>(null);
  const { add } = useCart();

  useEffect(() => {
    const el = fan.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.6) { t = setTimeout(() => setOpen(true), 250); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  return (
    <section id="set" className={styles.section} aria-labelledby="set-naslov">
      <div className={styles.text}>
        <h2 id="set-naslov" className={styles.title}>Sva tri, jedna vrećica.</h2>
        <p className={styles.sub}><span lang="en">Body Butter, Refreshing Mist</span> i <span lang="en">Dry Body Oil</span> u pamučnoj vrećici Evielle.</p>
      </div>
      <button
        ref={fan}
        type="button"
        className={styles.fan}
        data-open={open ? "" : undefined}
        onClick={() => setOpen((o) => !o)}
        aria-pressed={open}
        aria-label={open ? "Složi fotke seta" : "Raširi fotke seta"}
      >
        {PRODUCTS.map((p) => (
          <span key={p.id} className={styles.polaroid}>
            <Image src={p.image} alt="" width={460} height={575} sizes="(min-width: 900px) 320px, 50vw" />
            <span className={styles.cap} lang="en">{p.name}</span>
          </span>
        ))}
        <span className={styles.polaroid}>
          <Image src={SET.image} alt="Pamučna vrećica Evielle s tri proizvoda" width={460} height={575} sizes="(min-width: 900px) 320px, 50vw" />
          <span className={styles.cap}>Pamučna vrećica</span>
          <span className={styles.tag}>Ljeto, zapakirano.</span>
        </span>
      </button>
      <div className={styles.buy}>
        <span><Ph /></span>
        <div className={styles.btns}>
          <button type="button" className={styles.btn} onClick={(e) => add("set", e.currentTarget)}>Dodaj set</button>
          <button type="button" className={styles.gift} onClick={(e) => add("gift", e.currentTarget)}>Pošalji kao poklon</button>
        </div>
      </div>
    </section>
  );
}
