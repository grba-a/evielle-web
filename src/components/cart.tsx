"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { flyToBag } from "@/lib/flyToBag";
import { ITEMS, type ItemId, type Product } from "@/lib/products";
import CartDrawer from "./CartDrawer";
import DeliverySheet from "./DeliverySheet";
import ProductSheet from "./ProductSheet";
import SiteMenu from "./SiteMenu";
import styles from "./cart.module.css";

type Panel = "cart" | "menu" | "product" | "delivery" | null;
type Cart = {
  lines: Partial<Record<ItemId, number>>;
  count: number;
  bump: number;
  add: (id: ItemId, from?: HTMLElement | null) => void;
  setQty: (id: ItemId, qty: number) => void;
  swapToSet: () => void;
  panel: Panel;
  product: Product["id"] | null;
  open: (p: Exclude<Panel, null>) => void;
  openProduct: (id: Product["id"]) => void;
  close: () => void;
};

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Partial<Record<ItemId, number>>>({});
  const [bump, setBump] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [product, setProduct] = useState<Product["id"] | null>(null);
  const [said, setSaid] = useState("");

  // The drop flies to the bag first; the count changes when it lands.
  const add = useCallback((id: ItemId, from?: HTMLElement | null) => {
    const land = () => {
      setLines((l) => ({ ...l, [id]: (l[id] ?? 0) + 1 }));
      setBump((b) => b + 1);
      setSaid(`${ITEMS[id].name} je u košarici`);
    };
    if (from) flyToBag(from, ITEMS[id].color).then(land);
    else land();
  }, []);

  const setQty = useCallback((id: ItemId, qty: number) => setLines((l) => ({ ...l, [id]: Math.max(0, qty) })), []);
  const swapToSet = useCallback(() => setLines((l) => ({ set: (l.set ?? 0) + 1, gift: l.gift })), []);

  const open = useCallback((p: Exclude<Panel, null>) => setPanel(p), []);
  const openProduct = useCallback((id: Product["id"]) => { setProduct(id); setPanel("product"); }, []);
  const close = useCallback(() => setPanel(null), []);

  // The page behind an open sheet must not scroll, and Escape closes it.
  useEffect(() => {
    if (!panel) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPanel(null); };
    window.addEventListener("keydown", onKey);
    return () => { html.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [panel]);

  // ?p=butter opens that product (ad landing).
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("p");
    if (p === "butter" || p === "mist" || p === "oil") requestAnimationFrame(() => openProduct(p));
  }, [openProduct]);

  const value = useMemo(
    () => ({
      lines, add, setQty, swapToSet, bump, panel, product, open, openProduct, close,
      count: Object.values(lines).reduce((n, q) => n + (q ?? 0), 0),
    }),
    [lines, add, setQty, swapToSet, bump, panel, product, open, openProduct, close],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className={styles.scrim} data-on={panel && panel !== "menu" ? "" : undefined} onClick={close} aria-hidden="true" />
      <ProductSheet />
      <DeliverySheet />
      <CartDrawer />
      <SiteMenu />
      <p className={styles.sr} role="status" aria-live="polite">{said}</p>
    </CartContext.Provider>
  );
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}

export function AddToCart({ id, className, children }: { id: ItemId; className?: string; children: React.ReactNode }) {
  const { add } = useCart();
  return (
    <button type="button" className={className} onClick={(e) => add(id, e.currentTarget)}>
      {children}
    </button>
  );
}

export function OpenDelivery({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = useCart();
  return (
    <button type="button" className={className} onClick={() => open("delivery")}>
      {children}
    </button>
  );
}
