import Ph from "./Ph";
import styles from "./FooterFrame.module.css";

const LINKS = [
  { href: "#proizvodi", label: "Proizvodi" },
  { href: "#set", label: "Set" },
  { href: "#dostava", label: "Dostava" },
  { href: "#newsletter", label: "Newsletter" },
];

// The page ends on a golden-hour frame from the brand film. The legal minimum for a Croatian web shop
// (trader data incl. phone, terms, privacy, an online "raskid ugovora") has its place here; the client fills it in.
export default function FooterFrame() {
  return (
    <footer className={styles.footer}>
      <picture>
        <source media="(min-width: 900px), (orientation: landscape) and (min-width: 600px)" srcSet="/media/footer-wide.jpg" />
        <img src="/media/footer.jpg" alt="" loading="lazy" />
      </picture>
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.content}>
        <p className={styles.title}>Vidimo se na moru.</p>
        <nav aria-label="Podnožje">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className={styles.legal}>
          <p>EVIELLE, obrt za trgovinu, Zagreb · <Ph>adresa</Ph> · <Ph>telefon</Ph> · <Ph>e-mail</Ph> · OIB <Ph>od klijenta</Ph></p>
          <p className={styles.docs}><span>Uvjeti kupnje</span><span>Privatnost</span><span>Dostava i povrat</span><span>Raskid ugovora</span></p>
        </div>
      </div>
    </footer>
  );
}
