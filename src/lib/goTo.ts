import type { MouseEvent } from "react";

// Scroll to a section after a sheet has closed and released the page scroll lock.
export function goTo(e: MouseEvent<HTMLAnchorElement>, close: () => void) {
  const id = e.currentTarget.getAttribute("href")?.slice(1);
  if (!id) return;
  e.preventDefault();
  close();
  requestAnimationFrame(() => {
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    history.replaceState(null, "", `#${id}`);
  });
}
