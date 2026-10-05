"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { goTo } from "@/lib/goTo";
import { ITEMS, PRICE_PENDING, type ItemId } from "@/lib/products";
import { useCart } from "./cart";
import { CloseIcon } from "./icons";
import styles from "./CartDrawer.module.css";

// Bottom sheet on phones, side panel on wide screens. A downward flick closes it.
export default function CartDrawer() {
  const { lines, setQty, panel, close } = useCart();
  const isOpen = panel === "cart";
  const sheet = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; t: number; dy: number } | null>(null);
  const ids = (Object.keys(lines) as ItemId[]).filter((id) => (lines[id] ?? 0) > 0);

  useEffect(() => {
    if (isOpen) sheet.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
  }, [isOpen]);

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { y: e.clientY, t: performance.now(), dy: 0 };
    sheet.current?.setAttribute("data-drag", "");
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !sheet.current) return;
    d.dy = e.clientY - d.y;
    // Past the top it resists instead of hitting a wall.
    sheet.current.style.transform = `translateY(${d.dy > 0 ? d.dy : d.dy / 6}px)`;
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !sheet.current) return;
    sheet.current.removeAttribute("data-drag");
    sheet.current.style.transform = "";
    const velocity = Math.abs(d.dy) / (performance.now() - d.t);
    if (d.dy > 90 || (d.dy > 10 && velocity > 0.11)) close();
  };

  return (
    <div
      ref={sheet}
      className={styles.sheet}
      data-on={isOpen ? "" : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Košarica"
      inert={!isOpen}
    >
      <div className={styles.grab} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <i className={styles.handle} aria-hidden="true" />
        <div className={styles.head}>
          <h2 className={styles.title}>Košarica</h2>
          <button type="button" className={styles.icon} onClick={close} aria-label="Zatvori košaricu">
            <CloseIcon />
          </button>
        </div>
      </div>

      {ids.length === 0 ? (
        <div className={styles.empty}>
          <p>Košarica je prazna.</p>
          <a className={styles.btn} href="#proizvodi" onClick={(e) => goTo(e, close)}>Pogledaj proizvode</a>
        </div>
      ) : (
        <>
          <ul className={styles.lines}>
            {ids.map((id) => (
              <li key={id} className={styles.line}>
                <Image src={ITEMS[id].image} alt="" width={64} height={80} />
                <div>
                  <b>{ITEMS[id].name}</b>
                  <span>{ITEMS[id].meta}</span>
                  <span>{PRICE_PENDING}</span>
                </div>
                <div className={styles.qty}>
                  <button type="button" onClick={() => setQty(id, (lines[id] ?? 0) - 1)} aria-label={`Jedan ${ITEMS[id].name} manje`}>−</button>
                  <output aria-live="polite">{lines[id]}</output>
                  <button type="button" onClick={() => setQty(id, (lines[id] ?? 0) + 1)} aria-label={`Jedan ${ITEMS[id].name} više`}>+</button>
                </div>
              </li>
            ))}
          </ul>
          {/* Keyed by open state, so the checkout note resets each time the drawer opens. */}
          <CheckoutFoot key={String(isOpen)} />
        </>
      )}
    </div>
  );
}

function CheckoutFoot() {
  const [note, setNote] = useState(false);
  return (
    <div className={styles.foot}>
      <p className={styles.total}>
        Ukupno <span>{PRICE_PENDING}</span>
      </p>
      <button type="button" className={styles.btn} onClick={() => setNote(true)}>Na blagajnu</button>
      {note ? (
        <p className={styles.note} role="status">Naplata se otvara uskoro. Zasad ništa nije naručeno ni naplaćeno.</p>
      ) : (
        <p className={styles.pay}>Kartice, Apple Pay i Google Pay · Šaljemo po Hrvatskoj</p>
      )}
    </div>
  );
}
