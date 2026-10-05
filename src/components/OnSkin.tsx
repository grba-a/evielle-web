import Image from "next/image";
import Ph from "./Ph";
import styles from "./OnSkin.module.css";

const SHOTS = [1, 2, 3, 4, 5, 6];

// Photos from creators and customers (Petar, artifact 6: nakozi). Until they arrive, frames from the brand
// film hold the places. Goes live only with at least six real photos and their permissions; gifted posts say #oglas.
export default function OnSkin() {
  return (
    <section id="na-kozi" className={styles.section} aria-labelledby="na-kozi-naslov">
      <h2 id="na-kozi-naslov" className={styles.title}>Na koži.</h2>
      <ul className={styles.rail}>
        {SHOTS.map((n) => (
          <li key={n}>
            <figure>
              <Image src={`/media/skin/${n}.jpg`} alt="" width={460} height={576} sizes="(min-width: 900px) 200px, 62vw" />
              <figcaption><Ph>@kreatorica</Ph> · #oglas</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
