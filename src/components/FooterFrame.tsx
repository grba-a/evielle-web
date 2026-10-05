import styles from "./FooterFrame.module.css";

const LINKS = [
  { href: "#proizvodi", label: "Proizvodi" },
  { href: "#set", label: "Set" },
  { href: "#dostava", label: "Dostava" },
  { href: "#dostava", label: "Povrat" },
  { href: "#newsletter", label: "Newsletter" },
];

// The page ends on a golden-hour frame from the brand film, like closing credits.
export default function FooterFrame() {
  return (
    <footer className={styles.footer}>
      <picture>
        <source media="(min-width: 900px), (orientation: landscape) and (min-width: 600px)" srcSet="/media/footer-wide.jpg" />
        <img src="/media/footer.jpg" alt="" loading="lazy" />
      </picture>
      <div className={styles.content}>
        <p className={styles.title}>Vidimo se na moru.</p>
        <nav aria-label="Podnožje">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <p className={styles.legal}>
          EVIELLE, obrt za trgovinu, Zagreb
          <br />
          Podaci o obrtu, uvjeti kupnje i privatnost uskoro.
        </p>
      </div>
    </footer>
  );
}
