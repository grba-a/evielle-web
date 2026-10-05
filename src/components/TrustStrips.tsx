import { OpenDelivery } from "./cart";
import EMark from "./EMark";
import styles from "./TrustStrips.module.css";

// Only true perks go here; the statutory 14-day return is information, not a selling point (ZZP čl. 37).
const TOP = ["Šaljemo po Hrvatskoj", "Apple Pay", "Pouzeće"];
const BOTTOM = ["Google Pay", "Kartice", "BOX NOW paketomat"];

// Two strips in the label colours sliding in opposite directions: the only marquee on the page.
function Strip({ words, className }: { words: string[]; className: string }) {
  const run = (
    <div aria-hidden="true">
      {[...words, ...words].map((w, i) => (
        <span key={i}>
          {w}
          <EMark className={styles.e} />
        </span>
      ))}
    </div>
  );
  return (
    <div className={className}>
      {run}
      {run}
    </div>
  );
}

export default function TrustStrips() {
  return (
    <section id="dostava" className={styles.section} aria-labelledby="dostava-naslov">
      <h2 id="dostava-naslov" className={styles.sr}>Dostava i plaćanje</h2>
      <ul className={styles.sr}>
        <li>Šaljemo po cijeloj Hrvatskoj, na adresu ili u BOX NOW paketomat.</li>
        <li>Plaćanje karticom, Apple Payem, Google Payem ili pouzećem.</li>
      </ul>
      <Strip words={TOP} className={styles.strip} />
      <Strip words={BOTTOM} className={`${styles.strip} ${styles.alt}`} />
      <div className={styles.more}>
        <OpenDelivery className={styles.btn}>Dostava i povrat</OpenDelivery>
      </div>
    </section>
  );
}
