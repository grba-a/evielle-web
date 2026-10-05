"use client";

import { goTo } from "@/lib/goTo";
import { useCart } from "./cart";
import { BagIcon, CloseIcon } from "./icons";
import styles from "./SiteMenu.module.css";

const LINKS = [
  { href: "#proizvodi", label: "Proizvodi", color: "#E8826A" },
  { href: "#set", label: "Set u vrećici", color: "#CFE6DA" },
  { href: "#dostava", label: "Dostava i povrat", color: "#B4502F" },
  { href: "#newsletter", label: "Newsletter", color: "#0F4F4B" },
];

export default function SiteMenu() {
  const { panel, close, open, count } = useCart();
  const isOpen = panel === "menu";

  return (
    <nav className={styles.menu} data-on={isOpen ? "" : undefined} aria-label="Izbornik" inert={!isOpen}>
      <div className={styles.bar}>
        <button type="button" className={styles.icon} onClick={close} aria-label="Zatvori izbornik">
          <CloseIcon />
        </button>
        <span className={styles.wordmark}>Evielle</span>
        <button type="button" className={styles.icon} onClick={() => open("cart")} aria-label={`Košarica, ${count} proizvoda`}>
          <BagIcon />
          {count > 0 && <span className={styles.count}>{count}</span>}
        </button>
      </div>
      <ul className={styles.list}>
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={(e) => goTo(e, close)}>
              <i style={{ background: l.color }} aria-hidden="true" />
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.sub}>Instagram i kontakt dolaze uskoro.</p>
    </nav>
  );
}
