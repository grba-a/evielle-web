import styles from "./Ph.module.css";

// A value the client has not given yet. It is styled as a placeholder so nobody reads it as a real price or fact.
export default function Ph({ children = "X €" }: { children?: React.ReactNode }) {
  return (
    <span className={styles.ph} title="Podatak stiže od klijenta">
      {children}
    </span>
  );
}
