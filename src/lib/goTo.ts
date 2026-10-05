import type { MouseEvent } from "react";

// Scroll to a section after a sheet has closed and released the page scroll lock.
// On a page without that section (a product page), the link navigates home client-side, so the cart stays.
export function goTo(e: MouseEvent<HTMLAnchorElement>, close: () => void) {
  const id = e.currentTarget.getAttribute("href")?.split("#")[1];
  if (!id || !document.getElementById(id)) { close(); return; }
  e.preventDefault();
  close();
  requestAnimationFrame(() => {
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    history.replaceState(null, "", `#${id}`);
  });
}
