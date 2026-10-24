import { BRAND, NAV_IDS } from '../../config/site';
import { useI18n } from '../../i18n/context';
import Logo from '../brand/Logo';
import ContactChannels from '../contact/ContactChannels';

const LINK = 'text-white/60 transition-colors hover:text-brand';

export default function Footer() {
  const { t } = useI18n();
  const f = t.footer;
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0b] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <a href="#bosh-sahifa" aria-label={t.header.home} className="inline-block rounded-lg">
            <Logo tone="dark" />
          </a>
          <p className="mt-5 max-w-sm leading-relaxed text-white/60">{f.description}</p>
          <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-brand uppercase">{BRAND.slogan}</p>
        </div>

        <nav aria-label={f.nav}>
          <p className="text-sm font-semibold text-white">{f.sections}</p>
          <ul className="mt-5 space-y-3">
            {NAV_IDS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className={LINK}>
                  {t.nav[id]}
                </a>
              </li>
            ))}
            <li>
              <a href="#ishlarimiz" className={LINK}>
                {f.works}
              </a>
            </li>
            <li>
              <a href="#savol-javob" className={LINK}>
                {f.faq}
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold text-white">{f.contact}</p>
          <ContactChannels tone="dark" compact className="mt-5" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {BRAND.name}. {f.rights}
          </p>
          <p>{f.note}</p>
        </div>
      </div>
    </footer>
  );
}
