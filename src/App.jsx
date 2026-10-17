import { useEffect, useRef } from 'react';
import LogoAnimation from './components/LogoAnimation';

const params = new URLSearchParams(window.location.search);
// Replay / slow-motion / compare controls: always in dev, in production only with ?debug.
const showControls = import.meta.env.DEV || params.has('debug');
// ?force-motion plays the animation even when the OS asks for reduced motion (testing only).
const forceMotion = params.has('force-motion');

export default function App() {
  const logoRef = useRef(null);

  useEffect(() => {
    if (!showControls) return undefined;
    // Console access for QA: __nanotexLogo.replay(), __nanotexLogo.seek(2.5)
    window.__nanotexLogo = logoRef.current;
    return () => {
      delete window.__nanotexLogo;
    };
  }, []);

  return (
    <main>
      <section className="hero" aria-label="NANOTEX">
        <LogoAnimation ref={logoRef} showControls={showControls} forceMotion={forceMotion} />
      </section>
    </main>
  );
}
