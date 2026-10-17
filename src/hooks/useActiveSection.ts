import { useEffect, useState } from 'react';

/** Returns the id of the section currently under the header (scroll-spy for navigation). */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return undefined;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        });
        // The first section (in page order) that is inside the detection band wins.
        const next = ids.find((id) => visible.has(id));
        if (next) setActive(next);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
