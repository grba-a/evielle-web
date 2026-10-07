// The hero stories in one place, so Petar or the client can swap a photo or a line without touching the
// component (Petar, artifact 7: both edit the hero; in WordPress these become fields of the stories block).
// Photos: portrait 2:3 for phones, landscape 3:2 for wide screens; `focus` keeps the subject in the crop.
import type { Product } from "./products";

export type Story = {
  id: string;
  /** Portrait photo, 1200×1800. */
  image: string;
  /** Second frame of the same burst; the story cuts to it halfway (motion: a hard cut, never a crossfade). */
  beat?: string;
  /** Landscape photo, 2400×1600. */
  wide: string;
  focus: string;
  wideFocus: string;
  /** Deep tone behind the text at the bottom of the photo. */
  shade: string;
  label: string;
} & ({ kind: "intro"; product: Product["id"] } | { kind: "product"; product: Product["id"] } | { kind: "set" });

export const STORIES: Story[] = [
  {
    id: "mist",
    kind: "intro",
    product: "mist",
    image: "/media/pasman/s1.jpg",
    beat: "/media/pasman/s1b.jpg",
    wide: "/media/pasman/s1w.jpg",
    focus: "50% 35%",
    wideFocus: "30% 40%",
    shade: "#1F4A3F",
    label: "Refreshing Mist",
  },
  {
    id: "butter",
    kind: "product",
    product: "butter",
    image: "/media/pasman/s2.jpg",
    wide: "/media/pasman/s2w.jpg",
    focus: "55% 40%",
    wideFocus: "45% 50%",
    shade: "#5A2418",
    label: "Body Butter",
  },
  {
    id: "oil",
    kind: "product",
    product: "oil",
    image: "/media/pasman/s3.jpg",
    wide: "/media/pasman/s3w.jpg",
    focus: "40% 40%",
    wideFocus: "50% 50%",
    shade: "#4A1A0C",
    label: "Dry Body Oil",
  },
  {
    id: "set",
    kind: "set",
    image: "/media/pasman/s4.jpg",
    wide: "/media/pasman/s4w.jpg",
    focus: "30% 50%",
    wideFocus: "50% 60%",
    shade: "#3B2A1E",
    label: "Set u pamučnoj vrećici",
  },
];
