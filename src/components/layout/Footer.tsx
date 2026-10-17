import { BRAND, NAV_ITEMS } from '../../config/site';
import Logo from '../brand/Logo';
import ContactChannels from '../contact/ContactChannels';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0b] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <a href="#bosh-sahifa" aria-label="NanoTech — bosh sahifa" className="inline-block rounded-lg">
            <Logo tone="dark" />
          </a>
          <p className="mt-5 max-w-sm leading-relaxed text-white/60">{BRAND.description}</p>
          <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-brand uppercase">{BRAND.slogan}</p>
        </div>

        <nav aria-label="Pastki menyu">
          <p className="text-sm font-semibold text-white">Sahifa bo‘limlari</p>
          <ul className="mt-5 space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-white/60 transition-colors hover:text-brand">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#savol-javob" className="text-white/60 transition-colors hover:text-brand">
                Savol-javob
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold text-white">Aloqa</p>
          <ContactChannels tone="dark" compact className="mt-5" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {BRAND.name}. Barcha huquqlar himoyalangan.
          </p>
          <p>Saytdagi tasvirlar konsept xarakteriga ega.</p>
        </div>
      </div>
    </footer>
  );
}
