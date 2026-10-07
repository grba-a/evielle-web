import Image from "next/image";
import Link from "next/link";
import { productById, type Product } from "@/lib/products";
import styles from "./OnSkin.module.css";

const SHOTS: { src: string; product: Product["id"] }[] = [
  { src: "/media/pasman/g-3748.jpg", product: "butter" },
  { src: "/media/pasman/g-3227_1.jpg", product: "mist" },
  { src: "/media/pasman/g-4663.jpg", product: "oil" },
  { src: "/media/pasman/g-4045.jpg", product: "mist" },
  { src: "/media/pasman/g-3836.jpg", product: "butter" },
  { src: "/media/pasman/g-4118.jpg", product: "oil" },
];

// Campaign photos from the Pašman shoot, captioned with the product only, never a name or a handle, so nobody
// reads the model as a customer (Petar, artifact 7: nakozi). Creator photos get their own rail later, tagged #oglas.
export default function OnSkin() {
  return (
    <section id="na-kozi" className={styles.section} aria-labelledby="na-kozi-naslov">
      <h2 id="na-kozi-naslov" className={styles.title}>Na koži.</h2>
      <ul className={styles.rail}>
        {SHOTS.map((s) => {
          const p = productById(s.product)!;
          return (
            <li key={s.src}>
              <Link href={`/${p.slug}`} className={styles.shot}>
                <Image src={s.src} alt={`${p.name} na koži`} width={1200} height={1500} sizes="(min-width: 900px) 200px, 62vw" />
                <span lang="en">{p.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
