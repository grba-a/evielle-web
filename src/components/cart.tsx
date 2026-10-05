"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ITEMS, type ItemId } from "@/lib/products";
import CartDrawer from "./CartDrawer";
import SiteMenu from "./SiteMenu";
import styles from "./cart.module.css";

type Panel = "cart" | "menu" | null;
type Cart = {
  lines: Partial<Record<ItemId, number>>;
  count: number;
  bump: number;
  add: (id: ItemId) => void;
  setQty: (id: ItemId, qty: number) => void;
  panel: Panel;
  open: (p: Exclude<Panel, null>) => void;
  close: () => void;
};

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Partial<Record<ItemId, number>>>({});
  const [bump, setBump] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const add = useCallback((id: ItemId) => {
    setLines((l) => ({ ...l, [id]: (l[id] ?? 0) + 1 }));
    setBump((b) => b + 1);
    setToast(`${ITEMS[id].name} je u košarici`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const setQty = useCallback((id: ItemId, qty: number) => {
    setLines((l) => ({ ...l, [id]: Math.max(0, qty) }));
  }, []);

  const open = useCallback((p: Exclude<Panel, null>) => {
    setToast(null);
    setPanel(p);
  }, []);
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

  const value = useMemo(
    () => ({ lines, add, setQty, bump, panel, open, close, count: Object.values(lines).reduce((n, q) => n + (q ?? 0), 0) }),
    [lines, add, setQty, bump, panel, open, close],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className={styles.scrim} data-on={panel === "cart" ? "" : undefined} onClick={close} aria-hidden="true" />
      <CartDrawer />
      <SiteMenu />
      <div className={styles.toast} data-on={toast ? "" : undefined} role="status" aria-live="polite">
        {toast}
      </div>
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
    <button type="button" className={className} onClick={() => add(id)}>
      {children}
    </button>
  );
}
