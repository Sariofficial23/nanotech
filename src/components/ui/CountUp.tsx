import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

interface CountUpProps {
  to: number;
  /** Starts counting when true (e.g. once the intro overlay has closed). */
  start?: boolean;
  duration?: number;
  className?: string;
}

const format = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Number that counts up from 0. Width is reserved by the final value, so nothing shifts while it runs. */
export default function CountUp({ to, start = true, duration = 1.8, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduce) {
      el.textContent = format(to);
      return undefined;
    }
    if (!start) return undefined;
    const controls = animate(0, to, {
      duration,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [to, start, duration, reduce]);

  return (
    <span className={`inline-grid tabular-nums ${className ?? ''}`}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {format(to)}
      </span>
      <span ref={ref} className="col-start-1 row-start-1 text-right">
        {reduce ? format(to) : '0'}
      </span>
    </span>
  );
}
