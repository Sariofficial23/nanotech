import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n/context';
import type { Lang } from '../../i18n/langs';
import { cn } from '../../lib/cn';
import Picture from '../ui/Picture';

type SlideKey = 'city' | 'highway' | 'mountains' | 'village' | 'company';
const ORDER: SlideKey[] = ['city', 'highway', 'mountains', 'village', 'company'];
const AUTOPLAY_MS = 6000;

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

/** Full-width, swipeable photo slider: the first thing visitors see. Auto-advances until they interact. */
export default function HeroSlider() {
  const { t, lang } = useI18n();
  const s = t.heroSlider;
  const slides = slidesFor(lang);
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hover, setHover] = useState(false);

  const go = useCallback(
    (index: number) => {
      const el = track.current;
      if (!el) return;
      const target = (index + slides.length) % slides.length;
      el.scrollTo({ left: target * el.clientWidth, behavior: reduce ? 'instant' : 'smooth' });
    },
    [reduce, slides.length],
  );

  // Track the visible slide.
  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.intersectionRatio >= 0.6);
        if (visible) setCurrent(Number((visible.target as HTMLElement).dataset.index));
      },
      { root: el, threshold: 0.6 },
    );
    for (const slide of el.children) observer.observe(slide);
    return () => observer.disconnect();
  }, [lang]);

  // Gentle autoplay; stops for good once the visitor swipes or clicks, pauses on hover.
  useEffect(() => {
    if (!autoplay || hover || reduce) return undefined;
    const id = window.setInterval(() => {
      if (!document.hidden) go(current + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, hover, reduce, current, go]);

  const stopAutoplay = () => setAutoplay(false);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-5 sm:px-6 sm:pt-8 lg:px-8">
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090909] shadow-[0_30px_80px_-30px_rgb(255_196_0/0.3)] sm:rounded-[1.75rem]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
    >
      <div
        ref={track}
        key={lang}
        role="region"
        aria-roledescription={s.carouselRole}
        aria-label={s.label}
        tabIndex={0}
        className="flex cursor-grab snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); stopAutoplay(); go(current + 1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); stopAutoplay(); go(current - 1); }
        }}
        onTouchStart={stopAutoplay}
        onPointerDown={(event) => {
          stopAutoplay();
          if (event.pointerType !== 'mouse' || event.button !== 0) return;
          drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const start = drag.current;
          if (!start) return;
          const delta = event.clientX - start.x;
          if (Math.abs(delta) > 5) start.moved = true;
          if (start.moved) {
            event.currentTarget.style.scrollSnapType = 'none';
            event.currentTarget.scrollLeft = start.left - delta;
          }
        }}
        onPointerUp={(event) => {
          const el = event.currentTarget;
          if (!drag.current) return;
          drag.current = null;
          el.style.scrollSnapType = '';
          if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
          go(Math.max(0, Math.min(slides.length - 1, Math.round(el.scrollLeft / el.clientWidth))));
        }}
        onPointerCancel={(event) => {
          drag.current = null;
          event.currentTarget.style.scrollSnapType = '';
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.image}
            data-index={i}
            role="group"
            aria-roledescription={s.slideRole}
            aria-label={`${i + 1} / ${slides.length}: ${s.slides[slide.key].caption}`}
            className="relative w-full shrink-0 snap-center snap-always select-none"
            onDragStart={(event) => event.preventDefault()}
          >
            {/* Phones: a slightly taller frame cropped from the right, so the baked-in caption on the left stays whole. */}
            <Picture
              name={slide.image}
              alt={s.slides[slide.key].alt}
              width={1704}
              height={923}
              sizes="(min-width: 1024px) 960px, 100vw"
              priority={i === 0}
              className="pointer-events-none block aspect-[16/10] w-full object-cover object-left sm:aspect-[1704/923] sm:object-center"
            />
            {slide.overlay && (
              <div className="pointer-events-none absolute top-[8%] left-[3.5%] max-w-[60%]" aria-hidden="true">
                <p className="font-display text-[clamp(0.55rem,1.1vw,0.9rem)] font-black tracking-[0.2em] text-brand italic [text-shadow:0_2px_12px_rgb(0_0_0/0.6)]">NANOTEX</p>
                <p className="font-display text-[clamp(1.3rem,4.4vw,3.6rem)] leading-[0.95] font-black text-white uppercase [text-shadow:0_4px_24px_rgb(0_0_0/0.45)]">
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
        onClick={() => { stopAutoplay(); go(current - 1); }}
        className="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/60 text-white backdrop-blur transition-colors hover:border-brand hover:bg-brand hover:text-ink sm:left-6 sm:h-12 sm:w-12"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={s.next}
        onClick={() => { stopAutoplay(); go(current + 1); }}
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
            aria-current={current === i ? 'true' : undefined}
            onClick={() => { stopAutoplay(); go(i); }}
            className="grid h-6 place-items-center px-0.5"
          >
            <span className={cn('block h-1.5 rounded-full transition-all duration-300', current === i ? 'w-8 bg-brand' : 'w-3 bg-white/55 hover:bg-white')} />
          </button>
        ))}
      </div>

      <span className="pointer-events-none absolute right-3 bottom-3 hidden rounded-full bg-ink/60 px-2.5 py-1 text-[11px] text-white/70 backdrop-blur sm:right-6 sm:bottom-5 sm:block">
        {t.hero.visualization}
      </span>
    </div>
    </div>
  );
}
