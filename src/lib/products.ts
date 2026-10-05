// Product facts come only from the labels in the client's film. Prices, sizes we could not read,
// ingredients and descriptions are not confirmed, so the design shows placeholders (never invent them).
// This Next.js site is the design prototype; the real shop is built in WordPress (Breakdance) + WooCommerce.
export const PRICE_PENDING = "Cijena uskoro";
export const FROM_CLIENT = "od klijenta";

export type Product = {
  id: "butter" | "mist" | "oil";
  name: string;
  /** Croatian product type shown under the English label name. */
  type: string;
  variant: string;
  size?: string;
  /** Label colour, used for the product's accents. */
  color: string;
  /** Text colour that stays readable on `color` (AA). */
  ink: string;
  /** Deep tone of the label colour: the story shade behind white text. */
  shade: string;
  video: string;
  poster: string;
  videoWide: string;
  posterWide: string;
  image: string;
  /** The label shows no SPF on the tanning butter; the client confirms the warning before launch. */
  spfNote?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "butter",
    name: "Body Butter",
    type: "Maslac za tijelo",
    variant: "Fast Tanning",
    size: "200 ml",
    color: "#E8826A",
    ink: "#10292A",
    shade: "#5A2418",
    video: "/media/hero/butter.mp4",
    poster: "/media/hero/butter.jpg",
    videoWide: "/media/hero/butter-wide.mp4",
    posterWide: "/media/hero/butter-wide.jpg",
    image: "/media/products/butter.jpg",
    spfNote: true,
  },
  {
    id: "mist",
    name: "Refreshing Mist",
    type: "Osvježavajući sprej za tijelo",
    variant: "Summer Fruit",
    color: "#CFE6DA",
    ink: "#10292A",
    shade: "#1F4A3F",
    video: "/media/hero/mist.mp4",
    poster: "/media/hero/mist.jpg",
    videoWide: "/media/hero/mist-wide.mp4",
    posterWide: "/media/hero/mist-wide.jpg",
    image: "/media/products/mist.jpg",
  },
  {
    id: "oil",
    name: "Dry Body Oil",
    type: "Suho ulje za tijelo, sa sjajem",
    variant: "Shimmering",
    color: "#B4502F",
    ink: "#FFFFFF",
    shade: "#4A1A0C",
    video: "/media/hero/oil.mp4",
    poster: "/media/hero/oil.jpg",
    videoWide: "/media/hero/oil-wide.mp4",
    posterWide: "/media/hero/oil-wide.jpg",
    image: "/media/products/oil.jpg",
  },
];

/** The three products in the cotton drawstring bag; it has its own price (client, 2026-10-05). */
export const SET = {
  id: "set" as const,
  name: "Set u pamučnoj vrećici",
  type: "Sva tri proizvoda",
  image: "/media/set.jpg",
  color: "#EDE3D0",
};

export type ItemId = Product["id"] | "set" | "gift";

export const ITEMS: Record<ItemId, { name: string; meta: string; image: string; color: string }> = {
  ...(Object.fromEntries(
    PRODUCTS.map((p) => [p.id, { name: p.name, meta: [p.type, p.size].filter(Boolean).join(" · "), image: p.image, color: p.color }]),
  ) as Record<Product["id"], { name: string; meta: string; image: string; color: string }>),
  set: { name: SET.name, meta: SET.type, image: SET.image, color: SET.color },
  gift: { name: SET.name, meta: "Poklon · Ljeto, zapakirano.", image: SET.image, color: SET.color },
};

export function productLine(p: Pick<Product, "type" | "size">) {
  return [p.type, p.size].filter(Boolean).join(" · ");
}

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

/** Wide screens get landscape clips; the same query decides the hero layout in CSS. */
export const WIDE_QUERY = "(min-width: 900px), (orientation: landscape) and (min-width: 600px)";
