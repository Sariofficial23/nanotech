import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { useI18n } from '../../i18n/context';
import type { Lang } from '../../i18n/langs';
import { cn } from '../../lib/cn';
import Picture from '../ui/Picture';

type SlideKey = 'city' | 'highway' | 'mountains' | 'village' | 'company';
const ORDER: SlideKey[] = ['city', 'highway', 'mountains', 'village', 'company'];

/** How long each photo stays fully visible. */
const SHOW_MS = 4000;
/** Slide-in / slide-out duration. */
const TRANSITION_MS = 600;
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
/** A swipe counts when the finger travels this share of the width, or flicks faster than this (px/ms). */
const SWIPE_RATIO = 0.18;
const SWIPE_VELOCITY = 0.45;
const OFFSTAGE = 'translate3d(100%,0,0)';

/**
 * Uzbek and Russian slides have the caption baked into the photo. English uses the clean renders with an
 * HTML caption on top; there is no clean highway render yet, so English shows four slides.
 */
function slidesFor(lang: Lang) {
  if (lang === 'en') {
    return ORDER.filter((key) => key !== 'highway').map((key) => ({ key, image: `slide-${key}`, overlay: true }));
  }
  return ORDER.map((key) => ({ key, image: `slide-${key}-${lang}`, overlay: false }));
}

const wrap = (i: number, n: number) => ((i % n) + n) % n;
const px = (x: number) => `translate3d(${x}px,0,0)`;

function readX(node: HTMLDivElement | null) {
  if (!node) return 0;
  const tr = getComputedStyle(node).transform;
  return !tr || tr === 'none' ? 0 : new DOMMatrixReadOnly(tr).m41;
}
function hideEl(node: HTMLDivElement | null) {
  if (!node) return;
  node.style.transform = OFFSTAGE;
  node.style.visibility = 'hidden';
}
function placeEl(node: HTMLDivElement | null, x: number) {
  if (!node) return;
  node.style.visibility = 'visible';
  node.style.transform = px(x);
}

/** Full-width photo slider: the first thing visitors see. Re-mounts per language (slide set differs). */
export default function HeroSlider() {
  const { lang } = useI18n();
  return <Slider key={lang} lang={lang} />;
}

function Slider({ lang }: { lang: Lang }) {
  const { t } = useI18n();
  const s = t.heroSlider;
  const slides = useMemo(() => slidesFor(lang), [lang]);
  const count = slides.length;
  const reduce = useReducedMotion() ?? false;

  const root = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const slideEls = useRef<(HTMLDivElement | null)[]>([]);
  const running = useRef(new Map<number, Animation>());
  const indexRef = useRef(0);
  const drag = useRef<{
    id: number; x: number; y: number; base: number; dx: number; axis: 'x' | 'y' | null;
    lastX: number; lastT: number; v: number;
  } | null>(null);

  const [index, setIndex] = useState(0);
  const [eager, setEager] = useState(() => new Set([0, wrap(1, count), wrap(-1, count)]));
  const [ready, setReady] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(() => document.hidden);
  const [inView, setInView] = useState(true);
  const [dragging, setDragging] = useState(false);

  // Transforms are written straight to the DOM, never through React state.
  const width = () => frame.current?.clientWidth ?? 0;

  /** Stop in-flight animations exactly where they are, so a new move starts from the visible position. */
  const freeze = useCallback(() => {
    for (const [i, anim] of running.current) {
      const x = readX(slideEls.current[i] ?? null);
      anim.cancel();
      placeEl(slideEls.current[i] ?? null, x);
    }
    running.current.clear();
  }, []);

  const tween = useCallback((i: number, from: number, to: number, ms: number, after?: () => void) => {
    const node = slideEls.current[i] ?? null;
    if (!node) return;
    placeEl(node, to); // final state is committed up front; the animation only plays on top of it
    if (ms <= 0 || from === to) { after?.(); return; }
    const anim = node.animate([{ transform: px(from) }, { transform: px(to) }], { duration: ms, easing: EASE });
    running.current.set(i, anim);
    anim.onfinish = () => { running.current.delete(i); after?.(); };
  }, []);

  /** Slide to `target`. dir = +1 → new photo enters from the right, current leaves to the left. */
  const go = useCallback((target: number, dir: 1 | -1) => {
    if (count < 2) return;
    freeze();
    const from = indexRef.current;
    const to = wrap(target, count);
    const w = width();
    if (to === from) return;

    const fromX = readX(slideEls.current[from] ?? null);
    const toX = slideEls.current[to]?.style.visibility === 'visible' ? readX(slideEls.current[to] ?? null) : fromX + dir * w;
    for (let i = 0; i < count; i++) if (i !== from && i !== to) hideEl(slideEls.current[i] ?? null);

    indexRef.current = to;
    setIndex(to);
    setCycle((c) => c + 1);
    setEager((prev) => {
      const next = new Set(prev);
      [to, wrap(to + 1, count), wrap(to - 1, count)].forEach((i) => next.add(i));
      return next.size === prev.size ? prev : next;
    });

    // Shorter tween when a swipe already covered part of the distance.
    const ms = reduce ? 0 : Math.max(240, TRANSITION_MS * Math.min(1, Math.abs(toX) / (w || 1)));
    placeEl(slideEls.current[to] ?? null, toX);
    tween(to, toX, 0, ms);
    tween(from, fromX, -dir * w, ms, () => { if (indexRef.current !== from) hideEl(slideEls.current[from] ?? null); });
  }, [count, freeze, reduce, tween]);

  const next = useCallback(() => go(indexRef.current + 1, 1), [go]);
  const prev = useCallback(() => go(indexRef.current - 1, -1), [go]);
  const goTo = (i: number) => go(i, i > indexRef.current ? 1 : -1);

  // ── Autoplay: one timeout at a time, restarted on every slide change ──
  const playing = !reduce && !userPaused && !hover && !focused && !pageHidden && inView && !dragging && ready && count > 1;

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setTimeout(next, SHOW_MS + (cycle === 0 ? 0 : TRANSITION_MS));
    return () => window.clearTimeout(id);
  }, [playing, cycle, next]);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Safety net in case the first photo's load event was missed (e.g. served from memory cache).
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 3000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const anims = running.current;
    return () => { for (const anim of anims.values()) anim.cancel(); anims.clear(); };
  }, []);

  // ── Swipe / drag ──
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (count < 2 || (event.pointerType === 'mouse' && event.button !== 0)) return;
    freeze();
    const now = performance.now();
    drag.current = {
      id: event.pointerId, x: event.clientX, y: event.clientY, base: readX(slideEls.current[indexRef.current] ?? null), dx: 0,
      axis: null, lastX: event.clientX, lastT: now, v: 0,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    if (!d.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (d.axis === 'y') { drag.current = null; return; }
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.v = 0.8 * ((event.clientX - d.lastX) / dt) + 0.2 * d.v;
    d.lastX = event.clientX;
    d.lastT = now;
    d.dx = dx;

    const w = width();
    const cur = indexRef.current;
    const x = d.base + dx;
    const nextI = wrap(cur + 1, count);
    const prevI = wrap(cur - 1, count);
    placeEl(slideEls.current[cur] ?? null, x);
    if (x < 0) { placeEl(slideEls.current[nextI] ?? null, x + w); if (prevI !== nextI) hideEl(slideEls.current[prevI] ?? null); }
    else if (x > 0) { placeEl(slideEls.current[prevI] ?? null, x - w); if (prevI !== nextI) hideEl(slideEls.current[nextI] ?? null); }
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!d.axis) return;
    setDragging(false);

    const w = width();
    const x = d.base + d.dx;
    const flick = Math.abs(d.v) > SWIPE_VELOCITY && Math.sign(d.v) === Math.sign(x);
    if (!cancelled && x !== 0 && (Math.abs(x) > w * SWIPE_RATIO || flick)) {
      if (x < 0) next(); else prev();
      return;
    }
    // Not far enough: settle back.
    const cur = indexRef.current;
    const side = x < 0 ? wrap(cur + 1, count) : wrap(cur - 1, count);
    const ms = Math.max(200, TRANSITION_MS * Math.min(1, Math.abs(x) / (w || 1)));
    tween(cur, x, 0, reduce ? 0 : ms);
    if (x !== 0 && side !== cur) {
      tween(side, x < 0 ? x + w : x - w, x < 0 ? w : -w, reduce ? 0 : ms, () => { if (indexRef.current !== side) hideEl(slideEls.current[side] ?? null); });
    }
    setCycle((c) => c + 1);
  };

  return (
    <div
      ref={root}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090909] shadow-[0_30px_80px_-30px_rgb(255_196_0/0.3)] sm:rounded-[1.75rem]"
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHover(true); }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setHover(false); }}
      onFocus={(event) => { if (event.target.matches(':focus-visible')) setFocused(true); }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
    >
      <div
        ref={frame}
        role="region"
        aria-roledescription={s.carouselRole}
        aria-label={s.label}
        aria-live={playing ? 'off' : 'polite'}
        tabIndex={0}
        className="relative aspect-[16/10] w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing sm:aspect-[1704/923]"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); next(); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); prev(); }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(event) => endDrag(event, false)}
        onPointerCancel={(event) => endDrag(event, true)}
        onDragStart={(event) => event.preventDefault()}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            ref={(node) => { slideEls.current[i] = node; }}
            role="group"
            aria-roledescription={s.slideRole}
            aria-label={`${i + 1} / ${count}: ${s.slides[slide.key].caption}`}
            aria-hidden={index !== i}
            // Constant initial style: React never rewrites it, so the imperative transforms stay in charge.
            style={i === 0 ? { visibility: 'visible' } : { visibility: 'hidden', transform: OFFSTAGE }}
            className="absolute inset-0 [backface-visibility:hidden] will-change-transform"
          >
            {/* Phones: a slightly taller frame cropped from the right, so the baked-in caption on the left stays whole. */}
            <Picture
              name={slide.image}
              alt={s.slides[slide.key].alt}
              width={1704}
              height={923}
              sizes="(min-width: 1024px) 62vw, 100vw"
              priority={i === 0}
              eager={eager.has(i)}
              onLoad={(event) => {
                if (i === 0) setReady(true);
                else event.currentTarget.decode?.().catch(() => undefined); // decode ahead → no blank frame on entry
              }}
              className="pointer-events-none block h-full w-full object-cover object-left sm:object-center"
            />
            {slide.overlay && (
              <div className="pointer-events-none absolute top-[8%] left-[3.5%] max-w-[60%]" aria-hidden="true">
                <p className="font-display text-[clamp(0.5rem,0.8vw,0.75rem)] font-black tracking-[0.2em] text-brand italic [text-shadow:0_2px_12px_rgb(0_0_0/0.6)]">NANOTEX</p>
                <p className="font-display text-[clamp(1.1rem,3vw,2.9rem)] leading-[0.95] font-black text-white uppercase [text-shadow:0_4px_24px_rgb(0_0_0/0.45)]">
                  {s.slides[slide.key].caption}
                </p>
                <span className="mt-[0.6vw] block h-[0.45vw] min-h-1 w-[9%] min-w-8 bg-brand" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
      <button
        type="button"
        aria-label={s.prev}
        onClick={prev}
        className="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/60 text-white backdrop-blur transition-colors hover:border-brand hover:bg-brand hover:text-ink sm:left-6 sm:h-12 sm:w-12"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={s.next}
        onClick={next}
        className="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/60 text-white backdrop-blur transition-colors hover:border-brand hover:bg-brand hover:text-ink sm:right-6 sm:h-12 sm:w-12"
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 sm:bottom-5">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            aria-label={s.goTo(i + 1)}
            aria-current={index === i ? 'true' : undefined}
            onClick={() => goTo(i)}
            className="grid h-6 place-items-center px-0.5"
          >
            <span className={cn('block h-1.5 rounded-full transition-all duration-300', index === i ? 'w-8 bg-brand' : 'w-3 bg-white/55 hover:bg-white')} />
          </button>
        ))}
      </div>

      {!reduce && count > 1 && (
        <button
          type="button"
          aria-label={userPaused ? s.play : s.pause}
          aria-pressed={userPaused}
          onClick={() => setUserPaused((p) => !p)}
          className="absolute bottom-3 left-3 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-ink/60 text-white backdrop-blur transition-colors hover:border-brand hover:bg-brand hover:text-ink sm:bottom-5 sm:left-6"
        >
          {userPaused ? <Play className="h-3.5 w-3.5 translate-x-px fill-current" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5 fill-current" aria-hidden="true" />}
        </button>
      )}

      <span className="pointer-events-none absolute right-3 bottom-3 hidden rounded-full bg-ink/60 px-2.5 py-1 text-[11px] text-white/70 backdrop-blur sm:right-6 sm:bottom-5 sm:block">
        {t.hero.visualization}
      </span>
    </div>
  );
}
