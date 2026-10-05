// A drop in the product's label colour flies in an arc from the button to the visible bag (motion review, P1).
// X travels linearly on the outer element, Y rises then falls on the inner one, so the path is a real arc.
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

function visibleBag(): HTMLElement | null {
  const bags = [...document.querySelectorAll<HTMLElement>("[data-bag]")];
  return (
    bags.find((b) => {
      if (b.closest("[inert]")) return false;
      const r = b.getBoundingClientRect();
      return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
    }) ?? null
  );
}

export function flyToBag(from: HTMLElement, color: string): Promise<void> {
  const bag = visibleBag();
  if (!bag || matchMedia("(prefers-reduced-motion: reduce)").matches) return Promise.resolve();
  const a = from.getBoundingClientRect(), b = bag.getBoundingClientRect();
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
  const dx = b.left + b.width / 2 - x0, dy = b.top + b.height / 2 + 3 - y0;
  const apex = Math.max(b.top + b.height / 2 - 56, 8) - y0;

  const x = document.createElement("div");
  const y = document.createElement("i");
  x.style.cssText = "position:fixed;left:0;top:0;z-index:90;pointer-events:none";
  y.style.cssText =
    `display:block;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;` +
    `background:radial-gradient(circle at 34% 30%,rgb(255 255 255/.8) 0 15%,transparent 32%),${color};` +
    `box-shadow:0 0 0 1.5px rgb(255 255 255/.9),0 4px 10px -2px rgb(0 0 0/.35)`;
  x.append(y);
  document.body.append(x);

  x.animate([{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${x0 + dx}px,${y0}px)` }], {
    duration: 640, easing: "linear", fill: "forwards",
  });
  const flight = y.animate(
    [
      { transform: "translateY(0) scale(.7)", easing: "cubic-bezier(0.2, 0.8, 0.4, 1)" },
      { transform: `translateY(${apex}px) scale(1)`, offset: 0.6, easing: "cubic-bezier(0.55, 0, 0.85, 0.4)" },
      { transform: `translateY(${dy}px) scale(.45)` },
    ],
    { duration: 640, fill: "forwards" },
  );
  // The product must land even if the flight never finishes (tab hidden mid-flight, animation cancelled).
  const landed = new Promise<void>((done) => {
    flight.finished.then(() => done(), () => done());
    setTimeout(done, 900);
  });
  return landed.then(() => {
    x.remove();
    // the catch: the bag squashes, overshoots, settles
    bag.querySelector("svg")?.animate(
      [
        { transform: "none", easing: "cubic-bezier(0.3, 0, 0.5, 1)" },
        { transform: "translateY(1.5px) scale(.84)", offset: 0.28, easing: EASE },
        { transform: "scale(1.06)", offset: 0.64 },
        { transform: "none" },
      ],
      { duration: 420 },
    );
  });
}
