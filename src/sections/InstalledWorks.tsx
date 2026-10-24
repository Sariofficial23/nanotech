import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Hand, MapPin, ShieldCheck } from 'lucide-react';
import { Section, SectionHeading } from '../components/ui/Section';
import Picture from '../components/ui/Picture';
import { Button } from '../components/ui/Button';
import { requestContact } from '../lib/contactIntent';
import { useI18n } from '../i18n/context';
import { cn } from '../lib/cn';

// Photo order matches i18n `works.photos` (captions).
const PHOTO_META = [
  { name: 'work-01', equipment: true },
  { name: 'work-02', equipment: true },
  { name: 'work-03', equipment: true },
  { name: 'work-04', equipment: true },
  { name: 'work-05', equipment: false },
  { name: 'work-06', equipment: false },
] as const;

export default function InstalledWorks() {
  const { t } = useI18n();
  const w = t.works;
  const PHOTOS = PHOTO_META.map((p, i) => ({ ...p, label: w.photos[i] }));
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [current, setCurrent] = useState(0);
  const photo = PHOTOS[current];

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.intersectionRatio >= 0.6);
      if (visible.length) setCurrent(Number((visible[0].target as HTMLElement).dataset.index));
    }, { root: el, threshold: 0.6 });
    for (const slide of el.children) observer.observe(slide);
    return () => observer.disconnect();
  }, []);

  function go(index: number) {
    const el = track.current;
    const slide = el?.children[index] as HTMLElement | undefined;
    if (!el || !slide) return;
    el.scrollTo({
      left: slide.offsetLeft - (el.children[0] as HTMLElement).offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  return (
    <Section id="ishlarimiz" tone="soft" labelledBy="works-title">
      <SectionHeading
        id="works-title"
        eyebrow={w.eyebrow}
        title={w.title}
        lead={w.lead}
      />
      <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="works-regions-title">
        <h3 id="works-regions-title" className="flex items-center gap-2.5 text-base font-semibold sm:text-lg">
          <MapPin className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
          {w.regionsTitle}
        </h3>
        <ul className="mt-4 flex flex-wrap gap-2">
          {w.regions.map((region) => (
            <li key={region} className="rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-white/85">
              {region}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink lg:grid lg:grid-cols-[1.35fr_1fr]">
        <div className="min-w-0 border-b border-white/10 lg:border-r lg:border-b-0">
          <div className="relative bg-[#090909]">
            <div
              ref={track}
              role="region"
              aria-roledescription={w.carouselRole}
              aria-label={w.carousel}
              tabIndex={0}
              className="relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') { event.preventDefault(); go(Math.min(current + 1, PHOTOS.length - 1)); }
                if (event.key === 'ArrowLeft') { event.preventDefault(); go(Math.max(current - 1, 0)); }
                if (event.key === 'Home') { event.preventDefault(); go(0); }
                if (event.key === 'End') { event.preventDefault(); go(PHOTOS.length - 1); }
              }}
              onPointerDown={(event) => {
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
                go(Math.max(0, Math.min(PHOTOS.length - 1, Math.round(el.scrollLeft / el.clientWidth))));
              }}
              onPointerCancel={(event) => {
                drag.current = null;
                event.currentTarget.style.scrollSnapType = '';
              }}
            >
              {PHOTOS.map((item, i) => (
                <div key={item.name} data-index={i} role="group" aria-roledescription={w.slideRole} aria-label={`${i + 1} / ${PHOTOS.length}: ${item.label}`}
                  className="w-full shrink-0 snap-center snap-always select-none" onDragStart={(event) => event.preventDefault()}>
                  <Picture name={item.name} alt={item.label} width={1280} height={960}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="pointer-events-none block aspect-[4/3] w-full object-contain" />
                </div>
              ))}
            </div>
            <span className="pointer-events-none absolute top-4 left-4 rounded-full border border-white/20 bg-ink/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {w.realPhoto}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
            <span className="flex items-center gap-2 text-xs text-white/55 sm:text-sm">
              <Hand className="h-4 w-4 text-brand" aria-hidden="true" /> {w.swipe}
            </span>
            <div className="flex items-center gap-3">
              <button type="button" aria-label={w.prev} disabled={current === 0} onClick={() => go(current - 1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:bg-brand hover:text-ink disabled:cursor-default disabled:opacity-25">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span aria-live="polite" className="text-sm tabular-nums text-white/65">{current + 1} / {PHOTOS.length}</span>
              <button type="button" aria-label={w.next} disabled={current === PHOTOS.length - 1} onClick={() => go(current + 1)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:bg-brand hover:text-ink disabled:cursor-default disabled:opacity-25">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 px-4 pb-5 sm:px-5">
            {PHOTOS.map((item, i) => (
              <button key={item.name} type="button" aria-label={w.openPhoto(i + 1, item.label)}
                aria-current={current === i ? 'true' : undefined} onClick={() => go(i)}
                className={cn('min-h-11 overflow-hidden rounded-lg border-2 transition-colors', current === i ? 'border-brand' : 'border-transparent opacity-50 hover:opacity-100')}>
                <img src={`/images/${item.name}-800.webp`} alt="" width={1280} height={960} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col p-6 sm:p-8 lg:p-9">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand uppercase">{w.badge}</p>
          <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{w.productTitle}</h3>
          <div className="mt-6" aria-live="polite" aria-atomic="true">
            <p className="font-display text-4xl font-bold tracking-tight text-brand sm:text-5xl">{photo.equipment ? '$25 000' : '$16 000'}</p>
            <p className="mt-2 text-sm font-medium">{photo.equipment ? w.withEquipment : w.withoutEquipment}</p>
            <p className="mt-1 text-sm text-white/50">{w.negotiable}</p>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-white/10 py-5 text-sm">
            <div><dt className="text-white/45">{w.capacityLabel}</dt><dd className="mt-1 font-semibold">{w.capacity}</dd></div>
            <div><dt className="text-white/45">{w.productTypesLabel}</dt><dd className="mt-1 font-semibold">{w.productTypes}</dd></div>
            <div className="col-span-2"><dt className="text-white/45">{w.operatorRoomLabel}</dt><dd className="mt-1 font-semibold">{w.operatorRoom}</dd></div>
          </dl>
          <p className="mt-5 flex gap-2 text-sm text-white/70"><Check className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" /> {w.quality}</p>
          <div className="mt-5 flex gap-3 rounded-2xl border border-brand/15 bg-brand/5 p-4">
            <ShieldCheck className="h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
            <div className="text-sm leading-relaxed">
              <p><strong>{w.warrantyStrong}</strong>{w.warrantyTanks}</p>
              <p className="mt-1 text-white/60">{photo.equipment ? w.warrantyEquipment : w.equipmentNotIncluded}</p>
            </div>
          </div>
          <Button className="mt-6 w-full" onClick={() => requestContact()} icon={<ArrowRight className="h-4 w-4" />}>{w.cta}</Button>
          <p className="mt-3 text-xs leading-relaxed text-white/45">{w.footnote}</p>
        </div>
      </div>
    </Section>
  );
}
