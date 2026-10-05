"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PRICE_PENDING, PRODUCTS, WIDE_QUERY, type Product } from "@/lib/products";
import { useCart } from "./cart";
import { BagIcon, MenuIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon } from "./icons";
import styles from "./HeroStories.module.css";

type Media = { video: string; poster: string; videoWide: string; posterWide: string; shade: string; label: string };
type Story = (Media & { kind: "intro" }) | (Media & { kind: "product"; product: Product });

const STORIES: Story[] = [
  {
    kind: "intro",
    video: "/media/hero/sea.mp4",
    poster: "/media/hero/sea.jpg",
    videoWide: "/media/hero/sea-wide.mp4",
    posterWide: "/media/hero/sea-wide.jpg",
    shade: "#0B3433",
    label: "Evielle",
  },
  ...PRODUCTS.map((p) => ({
    kind: "product" as const,
    video: p.video,
    poster: p.poster,
    videoWide: p.videoWide,
    posterWide: p.posterWide,
    shade: p.shade,
    label: p.name,
    product: p,
  })),
];

const DURATION = 5200;
const HOLD_MS = 220;
const SWIPE_PX = 40;

const HEADLINE = "Ljeto koje ostaje na koži.";
const CTA = "Upoznaj sva tri";

export default function HeroStories() {
  const { add, open, count, bump } = useCart();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [reduce, setReduce] = useState(false);
  // null until mounted: the right clip (portrait or landscape) is chosen on the client, the poster covers the wait.
  const [wide, setWide] = useState<boolean | null>(null);

  const root = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const anim = useRef<Animation | null>(null);
  const press = useRef<{ x: number; y: number; t: ReturnType<typeof setTimeout> | undefined; held: boolean } | null>(null);

  const running = onScreen && !held && !userPaused && !reduce;
  // Functional updates, so two fast taps move two stories instead of reading a stale index.
  const step = useCallback((d: number) => setIndex((i) => (i + d + STORIES.length) % STORIES.length), []);

  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const wq = matchMedia(WIDE_QUERY);
    const sync = () => { setReduce(rm.matches); setWide(wq.matches); };
    sync();
    rm.addEventListener("change", sync);
    wq.addEventListener("change", sync);
    return () => { rm.removeEventListener("change", sync); wq.removeEventListener("change", sync); };
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

  // New story: restart its clip and its progress bar.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) v.currentTime = 0;
      else v.pause();
      if (i === index + 1) v.preload = "auto";
    });
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
    const v = videos.current[index];
    if (running) {
      anim.current?.play();
      v?.play().catch(() => {});
    } else {
      anim.current?.pause();
      v?.pause();
    }
  }, [running, index, wide]);

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

  const story = STORIES[index];

  return (
    <section
      ref={root}
      id="hero"
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Evielle u četiri priče"
      onKeyDown={onKeyDown}
      style={{ "--shade": story.shade } as React.CSSProperties}
    >
      <div
        className={styles.stage}
        data-held={held || userPaused ? "" : undefined}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerCancel}
        onContextMenu={(e) => e.preventDefault()}
      >
        {STORIES.map((s, i) => (
          <div key={s.label} className={styles.media} data-on={i === index ? "" : undefined} aria-hidden="true">
            <picture>
              <source media={WIDE_QUERY} srcSet={s.posterWide} />
                    <img src={s.poster} alt="" fetchPriority={i === 0 ? "high" : "auto"} loading={i === 0 ? "eager" : "lazy"} />
            </picture>
            <video
              ref={(el) => { videos.current[i] = el; }}
              src={wide === null ? undefined : wide ? s.videoWide : s.video}
              muted
              loop
              playsInline
              preload={i < 2 ? "auto" : "metadata"}
              onPlaying={(e) => e.currentTarget.setAttribute("data-playing", "")}
              onEmptied={(e) => e.currentTarget.removeAttribute("data-playing")}
            />
          </div>
        ))}
        <div className={styles.shade} aria-hidden="true" />

        <div className={styles.bars} aria-hidden="true">
          {STORIES.map((s, i) => (
            <span key={s.label} className={styles.bar}>
              <span ref={(el) => { fills.current[i] = el; }} className={styles.fill} />
            </span>
          ))}
        </div>

        <header className={styles.nav}>
          <button type="button" className={styles.icon} onClick={() => open("menu")} aria-label="Izbornik">
            <MenuIcon />
          </button>
          <span className={styles.wordmark}>Evielle</span>
          <button type="button" className={styles.icon} onClick={() => open("cart")} aria-label={`Košarica, ${count} proizvoda`}>
            <BagIcon />
            {count > 0 && <span key={bump} className={styles.count}>{count}</span>}
          </button>
        </header>

        {STORIES.map((s, i) => (
          <div
            key={s.label}
            className={styles.story}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} od ${STORIES.length}: ${s.label}`}
            data-on={i === index ? "" : undefined}
            inert={i !== index}
          >
            {s.kind === "intro" ? (
              <>
                <h1 className={styles.headline}>{HEADLINE}</h1>
                <button type="button" className={styles.btn} onClick={() => step(1)}>{CTA}</button>
              </>
            ) : (
              <>
                <span className={styles.kind}>
                  <i style={{ background: s.product.color }} />
                  {s.product.variant}
                </span>
                <h2 className={styles.name}>{s.product.name}</h2>
                <p className={styles.meta}>{[s.product.size, PRICE_PENDING].filter(Boolean).join(" · ")}</p>
                <button type="button" className={styles.btn} onClick={() => add(s.product.id)}>U košaricu</button>
              </>
            )}
          </div>
        ))}

        <div className={styles.controls}>
          <button type="button" className={styles.ctl} onClick={() => step(-1)} aria-label="Prethodna priča">
            <PrevIcon />
          </button>
          <button
            type="button"
            className={styles.ctl}
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? "Pokreni priče" : "Zaustavi priče"}
            aria-pressed={userPaused}
          >
            {userPaused ? <PlayIcon /> : <PauseIcon />}
          </button>
          <button type="button" className={styles.ctl} onClick={() => step(1)} aria-label="Sljedeća priča">
            <NextIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
