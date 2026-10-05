"use client";

import { useEffect, useState } from "react";
import { useCart } from "./cart";
import { BagIcon, MenuIcon } from "./icons";
import styles from "./SiteHeader.module.css";

// The hero carries its own white nav; this light bar slides in once the hero has scrolled away.
export default function SiteHeader() {
  const { open, count, bump } = useCart();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), { rootMargin: "-72px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <header className={styles.bar} data-on={shown ? "" : undefined} inert={!shown}>
      <div className={styles.in}>
        <button type="button" className={styles.icon} onClick={() => open("menu")} aria-label="Izbornik">
          <MenuIcon />
        </button>
        <a href="#hero" className={styles.wordmark} aria-label="Evielle, na vrh">Evielle</a>
        <button type="button" className={styles.icon} onClick={() => open("cart")} aria-label={`Košarica, ${count} proizvoda`}>
          <BagIcon />
          {count > 0 && <span key={bump} className={styles.count}>{count}</span>}
        </button>
      </div>
    </header>
  );
}
