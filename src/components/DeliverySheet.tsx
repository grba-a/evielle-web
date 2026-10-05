"use client";

import { useEffect } from "react";
import { useSheetDrag } from "@/lib/useSheetDrag";
import { useCart } from "./cart";
import { CloseIcon } from "./icons";
import Ph from "./Ph";
import base from "./CartDrawer.module.css";
import styles from "./DeliverySheet.module.css";

// The question asked most before a first order, answered in one sheet (Petar, artifact 6: dostava).
// It opens from the trust strips, the menu, the footer and the cart. Every number waits on the client.
export default function DeliverySheet() {
  const { panel, close } = useCart();
  const isOpen = panel === "delivery";
  const { sheet, handlers } = useSheetDrag(close);

  useEffect(() => {
    if (isOpen) sheet.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
  }, [isOpen, sheet]);

  return (
    <div ref={sheet} className={base.sheet} data-on={isOpen ? "" : undefined} role="dialog" aria-modal="true" aria-label="Dostava i povrat" inert={!isOpen}>
      <div className={base.grab} {...handlers}>
        <i className={base.handle} aria-hidden="true" />
        <div className={base.head}>
          <h2 className={base.title}>Dostava i povrat</h2>
          <button type="button" className={base.icon} onClick={close} aria-label="Zatvori"><CloseIcon /></button>
        </div>
      </div>
      <div className={`${base.body} ${styles.body}`}>
        <dl className={styles.rows}>
          <div><dt>Na adresu</dt><dd><Ph>X</Ph> radna dana · <Ph /></dd></div>
          <div><dt>BOX NOW paketomat</dt><dd><Ph /></dd></div>
          <div><dt>Besplatna dostava</dt><dd>od <Ph /></dd></div>
          <div><dt>Slanje</dt><dd>Narudžbe do <Ph>14 h</Ph> šaljemo isti dan</dd></div>
          <div><dt>Plaćanje</dt><dd>Kartice, Apple Pay, Google Pay, pouzeće</dd></div>
        </dl>
        <p className={styles.law}>
          Imaš pravo na raskid ugovora u 14 dana od primitka. <span className={styles.doc}>Obrazac za raskid ugovora</span>
        </p>
      </div>
    </div>
  );
}
