// Product facts come only from the labels in the client's photos. Prices, sizes we could not read,
// ingredients and descriptions are not confirmed, so the design shows placeholders (never invent them).
// This Next.js site is the design prototype; the real shop is built in WordPress (Breakdance) + WooCommerce.
export const PRICE_PENDING = "Cijena uskoro";
export const FROM_CLIENT = "od klijenta";

export type Product = {
  id: "butter" | "mist" | "oil";
  /** Address of the product page, evielle.hr/<slug>. */
  slug: string;
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
  /** Still life, 4:5. It also feeds the cart and the shop grid. The props wait on the client's INCI (Reg. 1223/2009 art. 20). */
  image: string;
  /** Product page gallery, 4:5: still life, in use, in the hand, mood, set (Petar, artifact 7: galerija). */
  gallery: string[];
  /** The label shows no SPF on the tanning butter; the client confirms the warning before launch. */
  spfNote?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "butter",
    slug: "body-butter",
    name: "Body Butter",
    type: "Maslac za tijelo",
    variant: "Fast Tanning",
    size: "200 ml",
    color: "#E8826A",
    ink: "#10292A",
    shade: "#5A2418",
    image: "/media/pasman/butter.jpg",
    gallery: ["/media/pasman/butter.jpg", "/media/pasman/g-3748.jpg", "/media/pasman/g-3125.jpg", "/media/pasman/g-3836.jpg", "/media/pasman/set.jpg"],
    spfNote: true,
  },
  {
    id: "mist",
    slug: "refreshing-mist",
    name: "Refreshing Mist",
    type: "Osvježavajući sprej za tijelo",
    variant: "Summer Fruit",
    color: "#CFE6DA",
    ink: "#10292A",
    shade: "#1F4A3F",
    image: "/media/pasman/mist.jpg",
    gallery: ["/media/pasman/mist.jpg", "/media/pasman/g-3227_1.jpg", "/media/pasman/g-3951.jpg", "/media/pasman/g-4045.jpg", "/media/pasman/set.jpg"],
  },
  {
    id: "oil",
    slug: "dry-body-oil",
    name: "Dry Body Oil",
    type: "Suho ulje za tijelo, sa sjajem",
    variant: "Shimmering",
    color: "#B4502F",
    ink: "#FFFFFF",
    shade: "#4A1A0C",
    image: "/media/pasman/oil.jpg",
    gallery: ["/media/pasman/oil.jpg", "/media/pasman/g-4121.jpg", "/media/pasman/g-4663.jpg", "/media/pasman/g-4118.jpg", "/media/pasman/set.jpg"],
  },
];

/** The three products in the cotton drawstring bag; it has its own price (client, 2026-10-05). */
export const SET = {
  id: "set" as const,
  name: "Set u pamučnoj vrećici",
  type: "Sva tri proizvoda",
  image: "/media/pasman/set.jpg",
  /** The same still life at its native 3:2, for wide screens. */
  imageWide: "/media/pasman/set-wide.jpg",
  color: "#EDE3D0",
};

/** From November the set leads as a gift; in December its headline turns to the tree (Petar, artifact 7: bozic). */
export function setHeadline(month: number) {
  return month === 11 ? "Ljeto pod borom." : "Ljeto, zapakirano.";
}

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
export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

/** Wide screens get landscape clips; the same query decides the hero layout in CSS. */
export const WIDE_QUERY = "(min-width: 900px), (orientation: landscape) and (min-width: 600px)";
