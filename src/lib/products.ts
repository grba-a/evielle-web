// Product facts come only from the labels in the client's film. Prices are not confirmed yet,
// so the shop shows PRICE_PENDING until Petar sends them (never invent a price).
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
  video: string;
  poster: string;
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
    image: "/media/products/oil.jpg",
  },
];

export const productMeta = (p: Product) => [p.variant, p.size].filter(Boolean).join(" · ");
