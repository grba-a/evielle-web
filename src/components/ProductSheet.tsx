"use client";

import Image from "next/image";
import { useEffect } from "react";
import { FROM_CLIENT, productById } from "@/lib/products";
import { useSheetDrag } from "@/lib/useSheetDrag";
import { useCart } from "./cart";
import { CloseIcon } from "./icons";
import Ph from "./Ph";
import base from "./CartDrawer.module.css";
import styles from "./ProductSheet.module.css";

// The decision step the page was missing (sales review S1): what it is, the price as the law wants it,
// what it does, scent, texture, how to use, ingredients. Everything the client has not given is a placeholder.
export default function ProductSheet() {
  const { panel, product, close, add } = useCart();
  const isOpen = panel === "product";
  const p = product ? productById(product) : undefined;
  const { sheet, handlers } = useSheetDrag(close);

  useEffect(() => {
    if (isOpen) sheet.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
  }, [isOpen, sheet]);

  return (
    <div ref={sheet} className={base.sheet} data-on={isOpen ? "" : undefined} role="dialog" aria-modal="true" aria-label={p?.name ?? "Proizvod"} inert={!isOpen}>
      <div className={base.grab} {...handlers}>
        <i className={base.handle} aria-hidden="true" />
        <div className={base.head}>
          <h2 className={base.title} lang="en">{p?.name}</h2>
          <button type="button" className={base.icon} onClick={close} aria-label="Zatvori"><CloseIcon /></button>
        </div>
      </div>
      {p && (
        <>
          <div className={base.body}>
            <div className={styles.hero} style={{ background: p.color }}>
              <Image src={p.image} alt={`${p.name}, ${p.type}`} fill sizes="(min-width: 900px) 380px, 92vw" />
            </div>
            <p className={styles.type}>{[p.type, p.size].filter(Boolean).join(" · ")}<span lang="en"> · {p.variant}</span></p>
            <div className={styles.price}>
              <b><Ph /> · <Ph>Y €/L</Ph></b>
              <span>Cijena na <Ph>datum lansiranja</Ph></span>
            </div>
            <dl className={styles.facts}>
              <dt>Što radi</dt><dd><Ph>{FROM_CLIENT}</Ph></dd>
              <dt>Miris</dt><dd><Ph>{FROM_CLIENT}</Ph></dd>
              <dt>Tekstura</dt><dd><Ph>{FROM_CLIENT}</Ph></dd>
            </dl>
            {p.spfNote && <p className={styles.spf}>Nema zaštitni faktor (SPF). Na suncu uz njega koristi kremu za sunčanje.</p>}
            <details className={styles.more}><summary>Kako koristiti</summary><p><Ph>{FROM_CLIENT}</Ph></p></details>
            <details className={styles.more}><summary>Sastojci (INCI)</summary><p><Ph>{FROM_CLIENT}</Ph></p></details>
          </div>
          <div className={base.foot}>
            <button type="button" className={base.btn} onClick={(e) => add(p.id, e.currentTarget)}>U košaricu</button>
            <p className={base.pay}>Kartice · Apple Pay · Google Pay · Pouzeće · Šaljemo po Hrvatskoj</p>
          </div>
        </>
      )}
    </div>
  );
}
