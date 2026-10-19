import { useCallback, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import IntroOverlay from './components/layout/IntroOverlay';
import { shouldShowIntro } from './lib/intro';
import InstalledWorks from './sections/InstalledWorks';
import About from './sections/About';
import Contact from './sections/Contact';
import Faq from './sections/Faq';
import Hero from './sections/Hero';
import Partnership from './sections/Partnership';
import Process from './sections/Process';
import ScrollStory from './sections/ScrollStory';
import Solutions from './sections/Solutions';

export default function App() {
  const [introOpen, setIntroOpen] = useState(shouldShowIntro);
  const closeIntro = useCallback(() => setIntroOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#asosiy"
        className="sr-only z-[70] rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Asosiy mazmunga o‘tish
      </a>
      <Header />
      <main id="asosiy">
        <Hero ready={!introOpen} />
        <ScrollStory />
        <About />
        <Solutions />
        <InstalledWorks />
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
