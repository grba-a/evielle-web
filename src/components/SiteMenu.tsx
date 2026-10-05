"use client";

import { goTo } from "@/lib/goTo";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "./cart";
import { BagIcon, CloseIcon } from "./icons";
import styles from "./SiteMenu.module.css";

const LINKS = [
  { href: "#set", label: "Set u vrećici" },
  { href: "#dostava", label: "Dostava i plaćanje" },
  { href: "#newsletter", label: "Newsletter" },
];

// Three bands in the label colours lead straight to a product; three text links below (design review D13).
export default function SiteMenu() {
  const { panel, close, open, openProduct, count } = useCart();
  const isOpen = panel === "menu";

  return (
    <nav className={styles.menu} data-on={isOpen ? "" : undefined} aria-label="Izbornik" inert={!isOpen}>
      <div className={styles.bar}>
        <button type="button" className={styles.icon} onClick={close} aria-label="Zatvori izbornik"><CloseIcon /></button>
        <span className={styles.wordmark}>Evielle</span>
        <button type="button" className={styles.icon} onClick={() => open("cart")} aria-label={`Košarica, ${count} proizvoda`}>
          <BagIcon />
          {count > 0 && <span className={styles.count}>{count}</span>}
        </button>
      </div>
      <div className={styles.bands}>
        {PRODUCTS.map((p) => (
          <button key={p.id} type="button" className={styles.band} style={{ "--pc": p.color, "--pi": p.ink } as React.CSSProperties} onClick={() => openProduct(p.id)}>
            <span className={styles.name} lang="en">{p.name}</span>
            <span className={styles.type}>{p.type}</span>
          </button>
        ))}
      </div>
      <ul className={styles.list}>
        {LINKS.map((l) => (
          <li key={l.href}><a href={l.href} onClick={(e) => goTo(e, close)}>{l.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}
