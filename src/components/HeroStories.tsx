"use client";

import { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { WIDE_QUERY, productById, setHeadline } from "@/lib/products";
import { STORIES, type Story } from "@/lib/stories";
import { useMonth } from "@/lib/useMonth";
import { useCart } from "./cart";
import { BagIcon, MenuIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon } from "./icons";
import styles from "./HeroStories.module.css";

const DURATION = 6000;
const HOLD_MS = 220;
const SWIPE_PX = 40;

const HEADLINE = "Ljeto koje ostaje na koži.";
const CTA = "Upoznaj sva tri";

// Portrait on phones, landscape on wide screens, both through the image optimizer (AVIF/WebP, srcset).
function photo(s: Story, first: boolean) {
  const common = { alt: "", sizes: "100vw" };
  const { props: { srcSet: wide } } = getImageProps({ ...common, src: s.wide, width: 2400, height: 1600 });
  const { props: { srcSet: tall, ...rest } } = getImageProps({ ...common, src: s.image, width: 1200, height: 1800, fetchPriority: first ? "high" : undefined, loading: first ? "eager" : undefined });
  return { wide, tall, rest };
}

export default function HeroStories() {
  const { add, open, openProduct, count, bump, panel } = useCart();
  // prev keeps the outgoing layer painted under the incoming one until the fade ends (motion A2).
  // seen: media is fetched for the current and the next story only (review T1); once fetched it stays.
  const [{ index, prev, seen }, setPos] = useState({ index: 0, prev: -1, seen: [0, 1] });
  const [held, setHeld] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [reduce, setReduce] = useState(false);
  // Stories start moving only after the page has loaded and gone idle (Lighthouse SI, review T2).
  const [ready, setReady] = useState(false);
  const month = useMonth();

  const root = useRef<HTMLElement>(null);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const anim = useRef<Animation | null>(null);
  const press = useRef<{ x: number; y: number; t: ReturnType<typeof setTimeout> | undefined; held: boolean } | null>(null);

  // Stories wait behind an open cart, menu or product sheet (motion A14).
  const running = ready && onScreen && !held && !userPaused && !reduce && panel === null;
  // Functional updates, so two fast taps move two stories instead of reading a stale index.
  const step = useCallback(
    (d: number) =>
      setPos((p) => {
        const n = STORIES.length;
        const i = (p.index + d + n) % n;
        const seen = [...new Set([...p.seen, i, (i + 1) % n])];
        return { prev: p.index, index: i, seen };
      }),
    [],
  );

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(rm.matches);
    sync();
    rm.addEventListener("change", sync);
    const go = () => {
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (idle) idle(() => setReady(true), { timeout: 1500 });
      else setTimeout(() => setReady(true), 600);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => { rm.removeEventListener("change", sync); window.removeEventListener("load", go); };
  }, []);

  // Stop everything when the hero leaves the screen or the tab is hidden.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let inView = true;
    const update = () => setOnScreen(inView && document.visibilityState === "visible");
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; update(); }, { threshold: 0.35 });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  // New story: restart its progress bar.
  useEffect(() => {
    fills.current.forEach((f, i) => {
      if (!f) return;
      f.getAnimations().forEach((a) => a.cancel());
      f.style.transform = i < index ? "scaleX(1)" : "scaleX(0)";
    });
    anim.current?.cancel();
    const fill = fills.current[index];
    if (!fill) return;
    if (reduce) { fill.style.transform = "scaleX(1)"; anim.current = null; return; }
    const a = fill.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: DURATION, easing: "linear", fill: "forwards" });
    a.onfinish = () => step(1);
    a.pause();
    anim.current = a;
  }, [index, reduce, step]);

  // Play or hold the current story.
  useEffect(() => {
    if (running) anim.current?.play();
    else anim.current?.pause();
  }, [running, index]);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    const t = setTimeout(() => { if (press.current) { press.current.held = true; setHeld(true); } }, HOLD_MS);
    press.current = { x: e.clientX, y: e.clientY, t, held: false };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    clearTimeout(p.t);
    if (p.held) { setHeld(false); return; }
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) { step(dx < 0 ? 1 : -1); return; }
    if (Math.abs(dy) > SWIPE_PX) return; // a vertical drag is a page scroll, not a tap
    const r = e.currentTarget.getBoundingClientRect();
    step(e.clientX - r.left < r.width * 0.3 ? -1 : 1);
  };
  const onPointerCancel = () => {
    if (press.current) clearTimeout(press.current.t);
    press.current = null;
    setHeld(false);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  };

  return (
    <section ref={root} id="hero" className={styles.hero} aria-roledescription="carousel" aria-label="Evielle u četiri priče" onKeyDown={onKeyDown}>
      <div
        className={styles.stage}
        data-held={held || userPaused ? "" : undefined}
        data-still={running ? undefined : ""}
        data-moved={prev === -1 ? undefined : ""}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerCancel}
        onContextMenu={(e) => e.preventDefault()}
      >
        {STORIES.map((s, i) => {
          const load = seen.includes(i);
          const p = load ? photo(s, i === 0) : null;
          return (
            // each layer carries its own shade, so the colour fades with the picture instead of jumping (motion A1)
            <div
              key={s.id}
              className={styles.media}
              data-on={i === index ? "" : undefined}
              data-prev={i === prev && i !== index ? "" : undefined}
              style={{ "--shade": s.shade, "--focus": s.focus, "--wfocus": s.wideFocus } as React.CSSProperties}
              aria-hidden="true"
            >
              {p && (
                <div className={styles.frame}>
                  <picture>
                    <source media={WIDE_QUERY} srcSet={p.wide} sizes="100vw" />
                    <source srcSet={p.tall} sizes="100vw" />
                    <img {...p.rest} alt="" />
                  </picture>
                  {/* the second frame of the burst: lazy, hidden on wide screens, and it cuts in only once decoded */}
                  {s.beat && !reduce && (
                    <picture>
                      <img
                        className={styles.beat}
                        {...getImageProps({ alt: "", sizes: "100vw", src: s.beat, width: 1200, height: 1800 }).props}
                        alt=""
                        onLoad={(e) => { const el = e.currentTarget; el.decode().then(() => el.setAttribute("data-ready", ""), () => {}); }}
                      />
                    </picture>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className={styles.top}>
          <div className={styles.bars} aria-hidden="true">
            {STORIES.map((s, i) => (
              <span key={s.id} className={styles.bar}>
                <span ref={(el) => { fills.current[i] = el; }} className={styles.fill} />
              </span>
            ))}
          </div>
          <button
            type="button"
            className={styles.pause}
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Pokreni priče" : "Zaustavi priče"}
            aria-pressed={userPaused}
          >
            {userPaused ? <PlayIcon /> : <PauseIcon />}
          </button>
        </div>

        <header className={styles.nav}>
          <button type="button" className={styles.icon} onClick={() => open("menu")} aria-label="Izbornik"><MenuIcon /></button>
          <span className={styles.wordmark}>Evielle</span>
          <button type="button" className={styles.icon} data-bag onClick={() => open("cart")} aria-label={`Košarica, ${count} proizvoda`}>
            <BagIcon />
            {count > 0 && <span key={bump} className={styles.count}>{count}</span>}
          </button>
        </header>

        {STORIES.map((s, i) => {
          const p = s.kind === "set" ? null : productById(s.product);
          return (
            <div
              key={s.id}
              className={styles.story}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} od ${STORIES.length}: ${s.label}`}
              data-on={i === index ? "" : undefined}
              inert={i !== index}
            >
              {s.kind === "intro" && p ? (
                <>
                  <p className={styles.kicker} lang="en">{p.name}</p>
                  <h1 className={styles.headline}>{HEADLINE}</h1>
                  <button type="button" className={styles.btn} onClick={() => step(1)}>{CTA}</button>
                </>
              ) : s.kind === "product" && p ? (
                <>
                  <h2 className={styles.name} lang="en">{p.name}</h2>
                  <p className={styles.meta}>{[p.type, p.size].filter(Boolean).join(" · ")}</p>
                  <span className={styles.actions}>
                    <button type="button" className={styles.btn} onClick={(e) => add(p.id, e.currentTarget)}>U košaricu</button>
                    <button type="button" className={styles.link} onClick={() => openProduct(p.id)}>Detalji</button>
                  </span>
                </>
              ) : (
                <>
                  <h2 className={styles.name}>{setHeadline(month)}</h2>
                  <p className={styles.meta}>Sva tri u pamučnoj vrećici</p>
                  <span className={styles.actions}>
                    <button type="button" className={styles.btn} onClick={(e) => add("set", e.currentTarget)}>Dodaj set</button>
                    <button type="button" className={styles.link} onClick={(e) => add("gift", e.currentTarget)}>Pošalji kao poklon</button>
                  </span>
                </>
              )}
            </div>
          );
        })}

        {/* keyboard and screen readers only: taps and swipes steer the stories on screen */}
        <div className={styles.controls}>
          <button type="button" className={styles.ctl} onClick={() => step(-1)} aria-label="Prethodna priča"><PrevIcon /></button>
          <button type="button" className={styles.ctl} onClick={() => step(1)} aria-label="Sljedeća priča"><NextIcon /></button>
        </div>
      </div>
    </section>
  );
}
