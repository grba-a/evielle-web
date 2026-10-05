"use client";

import { useId, useState } from "react";
import styles from "./NewsletterPostcard.module.css";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// No list provider is connected yet, so the form says plainly that nothing is saved instead of faking a sign-up.
export default function NewsletterPostcard() {
  const id = useId();
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
    if (!EMAIL.test(input.value.trim())) {
      setError("Upiši e-mail u obliku ime@primjer.hr");
      input.focus();
      return;
    }
    setError("");
    setDone(true);
  };

  return (
    <section id="newsletter" className={styles.section} aria-labelledby="newsletter-naslov">
      <div className={styles.card}>
        <div className={styles.stamp} aria-hidden="true" />
        <h2 id="newsletter-naslov" className={styles.title}>Pošalji nam adresu, šaljemo ljeto.</h2>
        <hr className={styles.line} />
        {done ? (
          <p className={styles.ok} role="status">Hvala. Newsletter otvaramo uskoro, pa tvoju adresu zasad ne spremamo.</p>
        ) : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <label htmlFor={`${id}-email`}>E-mail</label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="ime@primjer.hr"
              aria-invalid={error ? true : undefined}
              aria-describedby={`${id}-err`}
            />
            <p id={`${id}-err`} className={styles.err} aria-live="polite">{error}</p>
            <button type="submit" className={styles.btn}>Pošalji</button>
          </form>
        )}
        <p className={styles.fine}>Bez spama. Odjava jednim klikom.</p>
      </div>
    </section>
  );
}
