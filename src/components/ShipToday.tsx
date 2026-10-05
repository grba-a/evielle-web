import Ph from "./Ph";
import styles from "./ShipToday.module.css";

// The only urgency the shop may use is a true one (Petar, artifact 6: saljemo). Ships only if the client
// really sends same-day orders; the cut-off hour is theirs.
export default function ShipToday({ className }: { className?: string }) {
  return (
    <p className={`${styles.cut} ${className ?? ""}`}>
      <i aria-hidden="true" />
      <span>Naruči do <Ph>14 h</Ph>, šaljemo danas.</span>
    </p>
  );
}
