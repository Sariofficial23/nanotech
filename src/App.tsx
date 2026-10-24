import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import IntroOverlay from './components/layout/IntroOverlay';
import { useI18n } from './i18n/context';
import { shouldShowIntro } from './lib/intro';
import Products from './sections/Products';
import InstalledWorks from './sections/InstalledWorks';
import About from './sections/About';
import Contact from './sections/Contact';
import Faq from './sections/Faq';
import Directions from './sections/Directions';
import Hero from './sections/Hero';
import Partnership from './sections/Partnership';
import Process from './sections/Process';
import ScrollStory from './sections/ScrollStory';

export default function App() {
  const { t } = useI18n();
  const [introOpen, setIntroOpen] = useState(shouldShowIntro);
  const closeIntro = useCallback(() => setIntroOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#asosiy"
        className="sr-only z-[70] rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        {t.header.skipToContent}
      </a>
      <Header />
      <main id="asosiy">
        <Hero ready={!introOpen} />
        <Directions />
        <ScrollStory />
        <About />
        <InstalledWorks />
        <Products />
        <Process />
        <Partnership />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <IntroOverlay open={introOpen} onClose={closeIntro} />
    </MotionConfig>
  );
}
