// Product facts come only from the labels in the client's film. Prices are not confirmed yet,
// so the shop shows PRICE_PENDING until the client sends them (never invent a price).
export const PRICE_PENDING = "Cijena uskoro";

export type Product = {
  id: "butter" | "mist" | "oil";
  name: string;
  variant: string;
  size?: string;
  /** Label colour, used for the product's accents. */
  color: string;
  /** Text colour that stays readable on `color`. */
  ink: string;
  /** Deep tone of the label colour: the story shade behind white text. */
  shade: string;
  /** Portrait story clip for phones, landscape for wide screens. */
  video: string;
  poster: string;
  videoWide: string;
  posterWide: string;
  image: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "butter",
    name: "Body Butter",
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
  },
  {
    id: "mist",
    name: "Refreshing Mist",
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
    variant: "Shimmering",
    color: "#B4502F",
    ink: "#FBEDE4",
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
  variant: "Sva tri proizvoda",
  image: "/media/set.jpg",
};

export type ItemId = Product["id"] | typeof SET.id;

export const ITEMS: Record<ItemId, { name: string; meta: string; image: string }> = {
  ...(Object.fromEntries(PRODUCTS.map((p) => [p.id, { name: p.name, meta: productMeta(p), image: p.image }])) as Record<
    Product["id"],
    { name: string; meta: string; image: string }
  >),
  set: { name: SET.name, meta: SET.variant, image: SET.image },
};

export function productMeta(p: Pick<Product, "variant" | "size">) {
  return [p.variant, p.size].filter(Boolean).join(" · ");
}

/** Wide screens get landscape clips; the same query decides the hero layout in CSS. */
export const WIDE_QUERY = "(min-width: 900px), (orientation: landscape) and (min-width: 600px)";
