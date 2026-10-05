"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ITEMS, PRODUCTS, type ItemId } from "@/lib/products";
import { useSheetDrag } from "@/lib/useSheetDrag";
import { useCart } from "./cart";
import { CloseIcon } from "./icons";
import Ph from "./Ph";
import styles from "./CartDrawer.module.css";

const PROTO = "Prototip dizajna: ništa se ne sprema ni ne naplaćuje.";

// Bottom sheet on phones, side panel on wide screens. Shows every cost before the button (sales review S5),
// one set offer that depends on what is inside (S6), Apple Pay early (S7) and the "Prva serija" reservation (M1).
export default function CartDrawer() {
  const { lines, setQty, add, swapToSet, panel, close } = useCart();
  const isOpen = panel === "cart";
  const { sheet, handlers } = useSheetDrag(close);
  const ids = (Object.keys(lines) as ItemId[]).filter((id) => (lines[id] ?? 0) > 0);

  useEffect(() => {
    if (isOpen) sheet.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
  }, [isOpen, sheet]);

  const hasSet = (lines.set ?? 0) + (lines.gift ?? 0) > 0;
  const singles = PRODUCTS.filter((p) => (lines[p.id] ?? 0) > 0);
  // Threshold proposal: just under the set price, so the set always ships free (market review R2).
  const progress = hasSet ? 1 : Math.min(0.92, singles.reduce((n, p) => n + (lines[p.id] ?? 0), 0) / 3);

  let offer: React.ReactNode = null;
  if (!hasSet && singles.length === 1) {
    const next = PRODUCTS.find((p) => !lines[p.id])!;
    offer = (
      <div className={styles.offer}>
        <Image src={next.image} alt="" width={40} height={40} />
        <span>Uz ovo ide <span lang="en">{next.name}</span></span>
        <button type="button" onClick={(e) => add(next.id, e.currentTarget)}>Dodaj</button>
      </div>
    );
  } else if (!hasSet && singles.length > 1) {
    const missing = PRODUCTS.find((p) => !lines[p.id]);
    offer = (
      <div className={styles.offer}>
        <Image src={ITEMS.set.image} alt="" width={40} height={40} />
        <span>{missing ? <>Fali ti <span lang="en">{missing.name}</span> za set u vrećici</> : "Isto, ali u pamučnoj vrećici"}</span>
        <button type="button" onClick={swapToSet}>Uzmi set</button>
      </div>
    );
  }

  return (
    <div ref={sheet} className={styles.sheet} data-on={isOpen ? "" : undefined} role="dialog" aria-modal="true" aria-label="Košarica" inert={!isOpen}>
      <div className={styles.grab} {...handlers}>
        <i className={styles.handle} aria-hidden="true" />
        <div className={styles.head}>
          <h2 className={styles.title}>Košarica</h2>
          <button type="button" className={styles.icon} onClick={close} aria-label="Zatvori košaricu"><CloseIcon /></button>
        </div>
      </div>

      {ids.length === 0 ? (
        <div className={styles.body}>
          <p className={styles.emptyT}>Košarica je prazna. Ljeto nije.</p>
          <ul className={styles.lines}>
            {PRODUCTS.map((p) => (
              <li key={p.id} className={styles.line}>
                <Image src={p.image} alt="" width={56} height={70} />
                <div><b lang="en">{p.name}</b><span>{p.type}</span></div>
                <button type="button" className={styles.plus} onClick={(e) => add(p.id, e.currentTarget)} aria-label={`Dodaj ${p.name}`}>+</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className={styles.body}>
            <div className={styles.ship}>
              <p>{hasSet ? "Dostava je besplatna ✓" : <>Još <Ph /> do besplatne dostave</>}</p>
              <span className={styles.track}><i style={{ transform: `scaleX(${Math.max(0.06, progress)})` }} /></span>
            </div>
            <ul className={styles.lines}>
              {ids.map((id) => (
                <li key={id} className={styles.line}>
                  <Image src={ITEMS[id].image} alt="" width={56} height={70} />
                  <div>
                    <b lang={id === "set" || id === "gift" ? undefined : "en"}>{ITEMS[id].name}</b>
                    <span>{ITEMS[id].meta}</span>
                    <span><Ph /></span>
                  </div>
                  <div className={styles.qty}>
                    <button type="button" onClick={() => setQty(id, (lines[id] ?? 0) - 1)} aria-label={`Jedan ${ITEMS[id].name} manje`}>−</button>
                    <output aria-live="polite">{lines[id]}</output>
                    <button type="button" onClick={() => setQty(id, (lines[id] ?? 0) + 1)} aria-label={`Jedan ${ITEMS[id].name} više`}>+</button>
                  </div>
                </li>
              ))}
            </ul>
            {offer}
          </div>
          <Checkout key={String(isOpen)} hasSet={hasSet} />
        </>
      )}
    </div>
  );
}

function Checkout({ hasSet }: { hasSet: boolean }) {
  const { open } = useCart();
  const [step, setStep] = useState<"cart" | "mail" | "done">("cart");
  const [note, setNote] = useState(false);
  const [err, setErr] = useState("");

  if (step === "done") {
    return (
      <div className={styles.foot}>
        <p className={styles.doneT}>Rezervirano.</p>
        <p className={styles.doneS}>Prva ćeš znati kad krene prva serija.</p>
        <p className={styles.proto}>{PROTO}</p>
      </div>
    );
  }

  if (step === "mail") {
    return (
      <form
        className={styles.foot}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const v = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value.trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setErr("Upiši e-mail u obliku ime@primjer.hr"); return; }
          setStep("done");
        }}
      >
        <label className={styles.label} htmlFor="reserve-email">E-mail za rezervaciju</label>
        <input id="reserve-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="ime@primjer.hr" className={styles.input} aria-invalid={err ? true : undefined} aria-describedby="reserve-err" />
        <p id="reserve-err" className={styles.err} aria-live="polite">{err}</p>
        <button type="submit" className={styles.btn}>Pošalji rezervaciju</button>
        <p className={styles.pay}>Ništa ne naplaćujemo. Javit ćemo ti se prvoj.</p>
      </form>
    );
  }

  return (
    <div className={styles.foot}>
      <dl className={styles.totals}>
        <dt>Međuzbroj</dt><dd><Ph /></dd>
        <dt>Dostava</dt><dd>{hasSet ? "Besplatno" : <Ph />}</dd>
        <dt className={styles.big}>Ukupno</dt><dd className={styles.big}><Ph /></dd>
      </dl>
      <button type="button" className={styles.apay} onClick={() => setNote(true)}>Apple Pay</button>
      <button type="button" className={styles.btn} onClick={() => setStep("mail")}>Rezerviraj iz prve serije</button>
      {note ? <p className={styles.proto} role="status">{PROTO}</p> : <p className={styles.pay}>Kartice · Apple Pay · Google Pay · Pouzeće<br />Na adresu ili u BOX NOW paketomat</p>}
      <button type="button" className={styles.link} onClick={() => open("delivery")}>Dostava i povrat</button>
    </div>
  );
}
