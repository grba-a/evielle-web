"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/products";
import styles from "./cart.module.css";

type CartLine = { id: Product["id"]; qty: number };
type Cart = { count: number; lines: CartLine[]; add: (id: Product["id"]) => void; bump: number };

const CartContext = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [bump, setBump] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const add = useCallback((id: Product["id"]) => {
    setLines((prev) => {
      const hit = prev.find((l) => l.id === id);
      return hit ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { id, qty: 1 }];
    });
    setBump((b) => b + 1);
    const name = PRODUCTS.find((p) => p.id === id)?.name ?? "Proizvod";
    setToast(`${name} je u košarici`);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const value = useMemo(
    () => ({ lines, add, bump, count: lines.reduce((n, l) => n + l.qty, 0) }),
    [lines, add, bump],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
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

export function AddToCart({ id, className, children }: { id: Product["id"]; className?: string; children: React.ReactNode }) {
  const { add } = useCart();
  return (
    <button type="button" className={className} onClick={() => add(id)}>
      {children}
    </button>
  );
}
