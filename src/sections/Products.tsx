import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, PackageSearch, Search, X } from 'lucide-react';
import { Section, SectionHeading } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { useI18n } from '../i18n/context';
import { requestProductContact } from '../lib/contactIntent';
import { catalogCopy, categoryIds, categoryPhotos } from '../data/catalogCopy';
import catalog from '../data/catalog.json';
import { cn } from '../lib/cn';

type Product = (typeof catalog)[number];
type Copy = (typeof catalogCopy)['uz'];
const PAGE_SIZE = 9;
const normalize = (s: string) => s.toLocaleLowerCase().replace(/[‘’ʻʼ']/g, '').replace(/[^\p{L}\p{N}]/gu, '');
const catIndex = (id: string) => categoryIds.findIndex((value) => value === id);
const groupLabel = (group: string, copy: Copy) => copy.groupNames[group] ?? group.replace(/^s/, 'Shelf ').replace(/_/g, ' ').toUpperCase();

function ProductDialog({ product, copy, onClose }: { product: Product; copy: Copy; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const old = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { dialog?.close(); document.documentElement.style.overflow = old; };
  }, []);
  return (
    <dialog ref={ref} aria-labelledby="product-dialog-title" onCancel={onClose} onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-3xl border border-white/15 bg-ink p-0 text-white shadow-2xl backdrop:bg-black/80">
      <div className="relative grid md:grid-cols-2">
        <button type="button" onClick={onClose} aria-label={copy.close} autoFocus className="absolute top-3 right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink text-white ring-1 ring-white/25"><X size={20} /></button>
        <div className="flex min-h-64 items-center justify-center bg-white p-5 md:min-h-[32rem]">
          <img src={product.image} alt={product.name} className="max-h-[60dvh] w-full object-contain" />
        </div>
        <div className="flex flex-col p-6 pt-16 sm:p-9 sm:pt-16">
          <p className="text-xs font-semibold tracking-wider text-brand uppercase">{copy.categories[catIndex(product.category)]}</p>
          <h3 id="product-dialog-title" className="mt-4 font-display text-2xl leading-tight font-bold sm:text-3xl">{product.name}</h3>
          <p className="mt-4 text-white/55">{groupLabel(product.group, copy)}</p>
          <p className="mt-7 font-display text-2xl font-semibold text-brand">{copy.price}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/65">{copy.note}</p>
          <Button className="mt-8" icon={<ArrowRight size={17} />} onClick={() => { onClose(); requestProductContact(product.name); }}>{copy.enquiry}</Button>
        </div>
      </div>
    </dialog>
  );
}

export default function Products() {
  const { lang } = useI18n();
  const copy = catalogCopy[lang];
  const [category, setCategory] = useState('azs');
  const [group, setGroup] = useState('');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Product | null>(null);
  const search = useDeferredValue(normalize(query));
  const resultsRef = useRef<HTMLDivElement>(null);
  const filtered = catalog.filter((p) => (!category || p.category === category) && (!group || p.group === group) && (!search || normalize(p.name + p.group).includes(search)));
  const groups = [...new Set(catalog.filter((p) => !category || p.category === category).map((p) => p.group))];
  function chooseCategory(id: string, scroll = false) {
    setCategory(id); setGroup(''); setQuery(''); setLimit(PAGE_SIZE);
    if (scroll) requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  }
  return (
    <Section id="mahsulotlar" tone="dark" labelledBy="products-title">
      <SectionHeading id="products-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryIds.map((id, i) => (
          <button key={id} type="button" onClick={() => chooseCategory(id, true)} aria-pressed={category === id}
            className={cn('group overflow-hidden rounded-3xl border text-left transition-colors', category === id ? 'border-brand/65 bg-brand/[0.06]' : 'border-white/10 bg-white/[0.025] hover:border-brand/40')}>
            <div className="relative h-44 overflow-hidden bg-[#f5f5f3] p-4 sm:h-48">
              <img src={categoryPhotos[i]} alt={copy.categories[i]} loading="lazy" decoding="async" width={560} height={400} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute top-3 left-3 rounded-full bg-ink px-3 py-1 text-[11px] font-semibold tracking-wider text-brand">0{i + 1}</span>
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3"><h3 className="font-display text-xl font-semibold">{copy.categories[i]}</h3><ArrowRight className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" /></div>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-white/55">{copy.descriptions[i]}</p>
              <p className="mt-4 text-xs text-brand">{catalog.filter((p) => p.category === id).length} {copy.count}</p>
            </div>
          </button>
        ))}
      </div>

      <div ref={resultsRef} className="mt-14 scroll-mt-24 rounded-3xl border border-white/10 bg-white/[0.025] p-4 sm:p-7">
        <div className="flex flex-wrap gap-2" aria-label={copy.category}>
          {[{ id: '', label: copy.all }, ...categoryIds.map((id, i) => ({ id, label: copy.categories[i] }))].map(({ id, label }) => (
            <button key={id} type="button" aria-pressed={category === id} onClick={() => chooseCategory(id)} className={cn('min-h-11 rounded-full border px-4 py-2 text-sm transition-colors', category === id ? 'border-brand bg-brand font-semibold text-ink' : 'border-white/15 text-white/65 hover:border-brand/50 hover:text-white')}>{label}</button>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_260px]">
          <label className="relative"><span className="sr-only">{copy.search}</span><Search size={19} aria-hidden="true" className="pointer-events-none absolute top-3.5 left-4 text-white/40" />
            <input type="search" value={query} onChange={(e) => { setQuery(e.target.value); setLimit(PAGE_SIZE); }} placeholder={copy.search} className="h-12 w-full rounded-xl border border-white/15 bg-ink pr-4 pl-12 text-sm placeholder:text-white/35" />
          </label>
          <label><span className="sr-only">{copy.groups}</span><select value={group} onChange={(e) => { setGroup(e.target.value); setLimit(PAGE_SIZE); }} className="h-12 w-full min-w-0 rounded-xl border border-white/15 bg-ink px-4 text-sm"><option value="">{copy.allGroups}</option>{groups.map((g) => <option key={g} value={g}>{groupLabel(g, copy)}</option>)}</select></label>
        </div>
        <p className="mt-5 text-sm text-white/50" role="status">{copy.results}: <strong className="text-white">{filtered.length}</strong></p>
        {filtered.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, limit).map((p) => (
              <article key={p.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink">
                <button type="button" aria-label={`${copy.details}: ${p.name}`} onClick={() => setSelected(p)} className="flex h-60 items-center justify-center bg-white p-5 transition-colors hover:bg-[#f6f6f4]">
                  <img src={p.thumbnail} alt={p.name} loading="lazy" decoding="async" width={560} height={640} className="h-full w-full object-contain" />
                </button>
                <div className="flex grow flex-col p-5">
                  <p className="text-[11px] font-semibold tracking-wide text-brand">{groupLabel(p.group, copy)}</p>
                  <h4 className="mt-2 font-display text-lg leading-snug font-semibold">{p.name}</h4>
                  <p className="mt-3 text-sm text-white/45">{copy.price}</p>
                  <button type="button" onClick={() => setSelected(p)} className="mt-auto flex min-h-11 items-center justify-between gap-2 pt-5 text-sm font-semibold text-brand">{copy.details}<ArrowRight size={17} aria-hidden="true" /></button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-14 text-center"><PackageSearch size={40} className="mx-auto text-brand" /><h3 className="mt-4 text-xl font-semibold">{copy.empty}</h3><p className="mt-2 text-sm text-white/55">{copy.emptyHint}</p><Button className="mt-5" variant="outline-light" onClick={() => chooseCategory('')}>{copy.reset}</Button></div>
        )}
        {limit < filtered.length && <div className="mt-7 text-center"><Button variant="outline-light" icon={<ArrowDown size={17} />} onClick={() => setLimit((n) => n + PAGE_SIZE)}>{copy.more} ({Math.min(limit, filtered.length)} / {filtered.length})</Button></div>}
      </div>
      {selected && <ProductDialog product={selected} copy={copy} onClose={() => setSelected(null)} />}
    </Section>
  );
}
