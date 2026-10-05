import styles from "./TrustStrips.module.css";

const TOP = ["Šaljemo po Hrvatskoj", "Apple Pay", "14 dana za povrat"];
const BOTTOM = ["Google Pay", "Kartice", "Pamučna vrećica"];

// Two strips in the label colours sliding in opposite directions: the only marquee on the page.
function Strip({ words, className }: { words: string[]; className: string }) {
  const run = (
    <div aria-hidden="true">
      {[...words, ...words].map((w, i) => (
        <span key={i}>{w}</span>
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
      <h2 id="dostava-naslov" className={styles.sr}>
        Šaljemo po cijeloj Hrvatskoj. Plaćanje karticom, Apple Payem ili Google Payem. 14 dana za povrat.
      </h2>
      <Strip words={TOP} className={styles.strip} />
      <Strip words={BOTTOM} className={`${styles.strip} ${styles.alt}`} />
    </section>
  );
}
