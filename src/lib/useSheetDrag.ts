"use client";

import { useRef } from "react";

// Drag a bottom sheet down to close it. Speed comes from the last 80 ms, so a quick flick is enough
// even after a slow start (motion review A7); past the top it resists instead of hitting a wall.
export function useSheetDrag(close: () => void) {
  const sheet = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; dy: number; samples: { t: number; y: number }[] } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, a, input")) return;
    if (matchMedia("(min-width: 900px)").matches) return; // a side panel on wide screens
    drag.current = { y: e.clientY, dy: 0, samples: [{ t: performance.now(), y: e.clientY }] };
    sheet.current?.setAttribute("data-drag", "");
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !sheet.current) return;
    d.dy = e.clientY - d.y;
    const now = performance.now();
    d.samples.push({ t: now, y: e.clientY });
    d.samples = d.samples.filter((s) => now - s.t < 80);
    sheet.current.style.transform = `translateY(${d.dy > 0 ? d.dy : d.dy / 6}px)`;
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !sheet.current) return;
    sheet.current.removeAttribute("data-drag");
    sheet.current.style.transform = "";
    const first = d.samples[0], last = d.samples[d.samples.length - 1];
    const v = first && last && last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0;
    if (d.dy > 90 || (d.dy > 10 && v > 0.11)) close();
  };

  return { sheet, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp } };
}
