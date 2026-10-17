import { forwardRef, useCallback, useEffect, useImperativeHandle, useId, useRef, useState } from 'react';
import {
  animate,
  cancelFrame,
  frame,
  motionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'framer-motion';
import { COLORS, DROPLET, GEAR, NOZZLE, STATION, VESSEL, VIEWBOX, WORDMARK, dropPath } from './geometry';
import { FINAL, INITIAL, KEYS, LOGO_ANIMATION_DURATION, TIMELINE, type Key, type State } from './timeline';
import './LogoAnimation.css';

const ORIGINAL_SRC = `${import.meta.env.BASE_URL}brand/nanotex-logo-original.jpg`;

const FONTS = ['italic 900 64px "Saira"', '600 16px "Barlow"', 'italic 800 16px "Montserrat"'];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

// Where the drop hangs: bottom of the spout tip, rotated by the full tilt.
const DROP_X = (() => {
  const { x: px, y: py } = NOZZLE.pivot;
  const a = (NOZZLE.tilt * Math.PI) / 180;
  const dx = 336.2 - px;
  const dy = 322.1 - py;
  return px + dx * Math.cos(a) - dy * Math.sin(a);
})();

type El = SVGElement | null | undefined;

function setDraw(el: El, progress: number) {
  if (!el) return;
  el.style.strokeDashoffset = String(1 - progress);
  el.style.visibility = progress > 0 ? 'visible' : 'hidden';
}

function setOpacity(el: El, value: number) {
  if (el) el.style.opacity = String(value);
}

function setTransform(el: El, value: string) {
  if (el) el.setAttribute('transform', value);
}

/** Droplet shape for the current state; null when it should not be drawn. */
function dropletState({ dropForm: f, dropFall: p, impact: i }: State) {
  if (f <= 0 || i >= 1) return null;
  const R = DROPLET.r;
  const restLen = R * 1.05 + DROPLET.neck;
  const x = DROP_X;
  let r: number;
  let len: number;
  let cy: number;
  if (p <= 0) {
    // Volume grows linearly with time, so the radius grows with its cube root.
    r = R * Math.cbrt(f);
    len = r * 1.05 + DROPLET.neck * f * f;
    cy = DROPLET.attachY + len;
  } else {
    r = R;
    const cy0 = DROPLET.attachY + restLen;
    cy = lerp(cy0, DROPLET.landY - R, p);
    // Surface tension pulls the neck back into a rounder drop right after release.
    len = lerp(restLen, R * 1.15, easeOutQuad(clamp01(p / 0.3)));
  }
  const tipY = cy - len;
  // Slight stretch while accelerating, squash on impact.
  const sx = (1 - 0.06 * p) * (1 + 0.6 * i);
  const sy = (1 + 0.12 * p) * (1 - 0.5 * i);
  const bottom = cy + r;
  return {
    d: dropPath(x, tipY, cy, r),
    transform: `translate(${x} ${bottom}) scale(${sx} ${sy}) translate(${-x} ${-bottom})`,
    opacity: 1 - i,
    attached: p <= 0,
  };
}

export interface LogoAnimationProps {
  autoPlay?: boolean;
  showControls?: boolean;
  /** QA escape hatch only; real visitors with reduced motion get the static logo. */
  forceMotion?: boolean;
  onComplete?: () => void;
  className?: string;
}

export interface LogoAnimationHandle {
  replay: (opts?: { speed?: number }) => Promise<void>;
  seek: (seconds: number) => void;
  showFinal: () => void;
}

type ElName =
  | 'gear' | 'gearContour' | 'gearRingContour' | 'gearBody' | 'disc' | 'station'
  | 'nozzle' | 'nozzleBodyLine' | 'nozzleWindowLine' | 'nozzleSpout' | 'nozzleTail'
  | 'nozzleFill' | 'nozzleSpoutCore' | 'nozzleTip' | 'vessel' | 'dropFront' | 'dropBack'
  | 'liquidClip' | 'mark' | 'nano' | 'tex' | 'lineClip' | 'wingsClip' | 'slogan';

const createValues = () =>
  Object.fromEntries(KEYS.map((k) => [k, motionValue(INITIAL[k])])) as Record<Key, MotionValue<number>>;

const LogoAnimation = forwardRef<LogoAnimationHandle, LogoAnimationProps>(function LogoAnimation(
  { autoPlay = true, showControls = false, forceMotion = false, onComplete, className = '' },
  ref,
) {
  const reduceMotion = Boolean(useReducedMotion()) && !forceMotion;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name: string) => `nt-${uid}-${name}`;

  const els = useRef<Partial<Record<ElName, SVGElement | null>>>({});
  const bind = (name: ElName) => (node: SVGElement | null) => {
    els.current[name] = node;
  };

  const [values] = useState(createValues);
  const controlsRef = useRef<AnimationPlaybackControls[]>([]);
  const runRef = useRef(0);

  const [compare, setCompare] = useState(false);
  const [slow, setSlow] = useState(false);
  const [done, setDone] = useState(false);

  const render = useCallback(() => {
    const s = Object.fromEntries(KEYS.map((k) => [k, values[k].get()])) as State;
    const e = els.current;

    // Gear
    setTransform(e.gear, `translate(${GEAR.cx} ${GEAR.cy}) rotate(${s.gearRot}) scale(${s.gearScale})`);
    setDraw(e.gearContour, s.gearDraw);
    setDraw(e.gearRingContour, s.gearDraw);
    setOpacity(e.gearBody, s.gearFill);
    setOpacity(e.disc, s.disc);
    setTransform(e.disc, `scale(${0.72 + 0.28 * s.disc})`);

    // Station sign
    setOpacity(e.station, s.station);
    setTransform(e.station, `translate(${(1 - s.station) * 28} 0)`);

    // Nozzle + pictogram
    setTransform(e.nozzle, `rotate(${s.tilt} ${NOZZLE.pivot.x} ${NOZZLE.pivot.y})`);
    (['nozzleBodyLine', 'nozzleWindowLine', 'nozzleSpout', 'nozzleTail'] as const).forEach((k) =>
      setDraw(e[k], s.nozzleDraw),
    );
    setOpacity(e.nozzleFill, s.nozzleFill);
    setOpacity(e.nozzleSpoutCore, s.nozzleFill);
    setOpacity(e.nozzleTip, s.nozzleFill);
    setDraw(e.vessel, s.vesselDraw);

    // Droplet: drawn above the pictogram outline while hanging, behind it once falling inside.
    const drop = dropletState(s);
    ([
      [e.dropFront, Boolean(drop?.attached)],
      [e.dropBack, Boolean(drop && !drop.attached)],
    ] as const).forEach(([el, visible]) => {
      if (!el) return;
      el.style.visibility = visible ? 'visible' : 'hidden';
      if (visible && drop) {
        el.setAttribute('d', drop.d);
        el.setAttribute('transform', drop.transform);
        el.style.opacity = String(drop.opacity);
      }
    });

    if (e.liquidClip) {
      const top = lerp(VESSEL.liquidBottom, VESSEL.liquidTop, s.liquid);
      e.liquidClip.setAttribute('y', String(top));
      e.liquidClip.setAttribute('height', String(Math.max(0, VESSEL.liquidBottom - top + 1)));
    }

    // Wordmark
    setOpacity(e.mark, s.mark);
    const { cx: mx, cy: my } = WORDMARK.disc;
    setTransform(e.mark, `translate(${mx} ${my}) scale(${0.55 + 0.45 * s.mark}) translate(${-mx} ${-my})`);
    setTransform(e.nano, `translate(0 ${(1 - s.nano) * 80})`);
    setTransform(e.tex, `translate(0 ${(1 - s.tex) * 80})`);
    if (e.lineClip) {
      e.lineClip.setAttribute('x', String(330 - 240 * s.line));
      e.lineClip.setAttribute('width', String(480 * s.line));
    }

    // Slogan
    if (e.wingsClip) {
      e.wingsClip.setAttribute('x', String(325 - 245 * s.wings));
      e.wingsClip.setAttribute('width', String(490 * s.wings));
    }
    setOpacity(e.slogan, s.slogan);
    setTransform(e.slogan, `translate(0 ${(1 - s.slogan) * 10})`);
  }, [values]);

  // Batch all value changes into one DOM write per frame.
  useEffect(() => {
    let scheduled = false;
    const flush = () => {
      scheduled = false;
      render();
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      frame.render(flush);
    };
    const unsubs = KEYS.map((k) => values[k].on('change', schedule));
    render();
    return () => {
      unsubs.forEach((u) => u());
      cancelFrame(flush);
    };
  }, [render, values]);

  const stopAll = useCallback(() => {
    controlsRef.current.forEach((c) => c.stop());
    controlsRef.current = [];
  }, []);

  const jumpTo = useCallback(
    (state: State) => {
      stopAll();
      KEYS.forEach((k) => values[k].jump(state[k]));
      render();
    },
    [render, stopAll, values],
  );

  const play = useCallback(
    async ({ speed = 1 }: { speed?: number } = {}) => {
      const run = ++runRef.current;
      setDone(false);
      jumpTo(INITIAL);

      if (reduceMotion) {
        jumpTo(FINAL);
        setDone(true);
        onComplete?.();
        return;
      }

      // Text is revealed late, but make sure the brand fonts are ready so glyphs never swap mid-reveal.
      if (document.fonts?.load) {
        await Promise.race([
          Promise.all(FONTS.map((f) => document.fonts.load(f))).catch(() => {}),
          new Promise((r) => setTimeout(r, 900)),
        ]);
      }
      if (run !== runRef.current) return;

      const k = 1 / speed;
      controlsRef.current = TIMELINE.map(([key, target, { at, duration, ...rest }]) =>
        animate(values[key], target, { ...rest, delay: at * k, duration: duration * k }),
      );
      await Promise.all(controlsRef.current);
      if (run !== runRef.current) return;
      setDone(true);
      onComplete?.();
    },
    [jumpTo, onComplete, reduceMotion, values],
  );

  /** Freeze the timeline at `t` seconds — for QA and screenshots. */
  const seek = useCallback(
    (t: number) => {
      runRef.current++;
      jumpTo(INITIAL);
      controlsRef.current = TIMELINE.map(([key, target, { at, duration, ...rest }]) => {
        const c = animate(values[key], target, { ...rest, duration });
        c.pause();
        c.time = Math.min(duration, Math.max(0, t - at));
        return c;
      });
      render();
      setDone(t >= LOGO_ANIMATION_DURATION);
    },
    [jumpTo, render, values],
  );

  useImperativeHandle(
    ref,
    () => ({ replay: (opts) => play(opts), seek, showFinal: () => jumpTo(FINAL) }),
    [play, seek, jumpTo],
  );

  // Start once per mount (and again if reduced-motion flips); later runs go through replay().
  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  }, [play]);

  useEffect(() => {
    if (reduceMotion) {
      jumpTo(FINAL);
      queueMicrotask(() => setDone(true));
      return undefined;
    }
    if (autoPlay) void playRef.current();
    else jumpTo(INITIAL);
    const runCounter = runRef; // a plain counter, not a DOM ref
    return () => {
      runCounter.current++;
      stopAll();
    };
  }, [autoPlay, reduceMotion, jumpTo, stopAll]);

  const vb = `${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`;

  return (
    <div className={`nt-logo ${className}`.trim()} data-state={done ? 'done' : 'playing'}>
      <div className="nt-logo__stage">
        <svg
          className="nt-logo__svg"
          viewBox={vb}
          role="img"
          aria-labelledby={id('title')}
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id={id('title')}>NANOTEX — Sifat • Ishonch • Samaradorlik</title>
          <defs>
            <filter id={id('shadow')} x="-10%" y="-10%" width="120%" height="125%">
              <feDropShadow dx="1.5" dy="3.5" stdDeviation="2.6" floodColor="#6b4100" floodOpacity="0.35" />
            </filter>
            <linearGradient id={id('steel')} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#323232" />
              <stop offset="1" stopColor="#0b0b0b" />
            </linearGradient>
            <radialGradient id={id('disc')} cx="0.45" cy="0.4" r="0.62">
              <stop offset="0.78" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E3E3E3" />
            </radialGradient>
            <linearGradient id={id('gold')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={COLORS.yellowLight} />
              <stop offset="1" stopColor={COLORS.yellowDeep} />
            </linearGradient>
            <linearGradient id={id('ink')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a3a3a" />
              <stop offset="1" stopColor="#0a0a0a" />
            </linearGradient>
            <linearGradient id={id('tex')} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFD84A" />
              <stop offset="1" stopColor="#F4B400" />
            </linearGradient>
            <linearGradient id={id('pole')} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#9a9a9a" />
              <stop offset="0.45" stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#8a8a8a" />
            </linearGradient>
            <radialGradient id={id('markDisc')} cx="0.38" cy="0.32" r="0.75">
              <stop offset="0" stopColor="#3d3d3d" />
              <stop offset="1" stopColor="#0b0b0b" />
            </radialGradient>
            <clipPath id={id('gearClip')}>
              <path d={GEAR.clip} />
            </clipPath>
            <clipPath id={id('liquidClip')}>
              <rect ref={bind('liquidClip')} x="320" y={VESSEL.liquidBottom} width="45" height="0" />
            </clipPath>
            <clipPath id={id('wordClip')}>
              <rect x="140" y="118" width="460" height="92" />
            </clipPath>
            <clipPath id={id('lineClip')}>
              <rect ref={bind('lineClip')} x="330" y="76" width="0" height="64" />
            </clipPath>
            <clipPath id={id('wingsClip')}>
              <rect ref={bind('wingsClip')} x="325" y="220" width="0" height="44" />
            </clipPath>
          </defs>

          {/* 1. Clean yellow field */}
          <rect x={VIEWBOX.x} y={VIEWBOX.y} width={VIEWBOX.w} height={VIEWBOX.h} fill={COLORS.bg} />

          {/* 2. Gear */}
          <g clipPath={`url(#${id('gearClip')})`} filter={`url(#${id('shadow')})`}>
            <g ref={bind('gear')}>
              <g ref={bind('gearBody')} style={{ opacity: 0 }}>
                <path d={GEAR.path} fill={`url(#${id('steel')})`} />
                <path d={GEAR.path} fill="none" stroke={COLORS.yellowLight} strokeWidth="1.6" strokeLinejoin="round" opacity="0.9" />
                <circle r={GEAR.ringR} fill="none" stroke="#3a3a3a" strokeWidth="2.5" />
              </g>
              <path
                ref={bind('gearContour')}
                className="nt-draw"
                d={GEAR.path}
                pathLength="1"
                fill="none"
                stroke={COLORS.black}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <circle
                ref={bind('gearRingContour')}
                className="nt-draw"
                r={GEAR.discR}
                pathLength="1"
                fill="none"
                stroke={COLORS.black}
                strokeWidth="2"
                transform="rotate(-90)"
              />
              <circle ref={bind('disc')} r={GEAR.discR} fill={`url(#${id('disc')})`} style={{ opacity: 0 }} />
            </g>
          </g>

          {/* 3–5. Nozzle, drop pictogram and the falling drop */}
          <g>
            <g clipPath={`url(#${id('liquidClip')})`}>
              <path d={VESSEL.liquid} fill={COLORS.yellow} />
            </g>
            <path ref={bind('dropBack')} fill={COLORS.yellow} stroke={COLORS.black} strokeWidth="1.3" style={{ visibility: 'hidden' }} />
            <path
              ref={bind('vessel')}
              className="nt-draw"
              d={VESSEL.outline}
              pathLength="1"
              fill="none"
              stroke={COLORS.black}
              strokeWidth="4.6"
              strokeLinejoin="round"
            />

            <g ref={bind('nozzle')}>
              <g ref={bind('nozzleFill')} style={{ opacity: 0 }}>
                <path d={NOZZLE.body} fill={COLORS.yellow} />
                <path d={NOZZLE.window} fill={COLORS.white} />
              </g>
              <path ref={bind('nozzleSpout')} className="nt-draw" d={NOZZLE.spout} pathLength="1" fill="none" stroke={COLORS.black} strokeWidth="8.6" />
              <path ref={bind('nozzleSpoutCore')} d={NOZZLE.spoutCore} fill="none" stroke={COLORS.steel} strokeWidth="2.6" strokeLinecap="round" style={{ opacity: 0 }} />
              <path ref={bind('nozzleTip')} d={NOZZLE.spoutTip} fill={COLORS.black} stroke={COLORS.black} strokeWidth="1.2" strokeLinejoin="round" style={{ opacity: 0 }} />
              <path ref={bind('nozzleTail')} className="nt-draw" d={NOZZLE.tail} pathLength="1" fill="#4a4a4a" stroke={COLORS.black} strokeWidth="3" strokeLinejoin="round" />
              <path ref={bind('nozzleBodyLine')} className="nt-draw" d={NOZZLE.body} pathLength="1" fill="none" stroke={COLORS.black} strokeWidth="5.6" strokeLinejoin="round" />
              <path ref={bind('nozzleWindowLine')} className="nt-draw" d={NOZZLE.window} pathLength="1" fill="none" stroke={COLORS.black} strokeWidth="4.8" strokeLinejoin="round" />
            </g>

            <path ref={bind('dropFront')} fill={COLORS.yellow} stroke={COLORS.black} strokeWidth="1.3" style={{ visibility: 'hidden' }} />
          </g>

          {/* Station sign (part of the original composition) */}
          <g ref={bind('station')} filter={`url(#${id('shadow')})`} style={{ opacity: 0 }}>
            <path d={STATION.base} fill="#161616" />
            <path d={STATION.baseEdge} stroke="#4d4d4d" strokeWidth="1" fill="none" />
            <path d={STATION.backWall} fill="#1b1b1b" />
            <rect {...{ x: STATION.pole.x, y: STATION.pole.y, width: STATION.pole.w, height: STATION.pole.h }} fill={`url(#${id('pole')})`} />
            <path d={STATION.roof} fill="#141414" />
            <path d={STATION.roofEdge} stroke="#5a5a5a" strokeWidth="1" fill="none" />
            <path d={STATION.fascia} fill={COLORS.yellow} />
            <path d={STATION.panelSide} fill={COLORS.yellowDeep} />
            <path d={STATION.panel} fill={`url(#${id('steel')})`} />
            <path d={STATION.panelTop} fill={COLORS.yellow} />
            <path d={STATION.pillar} fill={COLORS.yellow} />
            <text className="nt-sign" x="247.5" y="467.5" textLength="67.5" lengthAdjust="spacingAndGlyphs" fill={COLORS.white}>
              NANO
            </text>
            <text className="nt-sign" x="242.5" y="497.5" textLength="90" lengthAdjust="spacingAndGlyphs" fill={COLORS.yellow}>
              PETROL
            </text>
          </g>

          {/* 6. Name */}
          <g filter={`url(#${id('shadow')})`}>
            <g clipPath={`url(#${id('lineClip')})`}>
              <path d={WORDMARK.topLine} fill={COLORS.black} />
              <path d={WORDMARK.topHighlight} fill="none" stroke="#FFE27A" strokeWidth="1.2" strokeLinejoin="round" />
            </g>
            <g ref={bind('mark')} style={{ opacity: 0 }}>
              <circle cx={WORDMARK.disc.cx} cy={WORDMARK.disc.cy} r={WORDMARK.disc.rimR} fill={`url(#${id('gold')})`} />
              <circle cx={WORDMARK.disc.cx} cy={WORDMARK.disc.cy} r={WORDMARK.disc.r} fill={`url(#${id('markDisc')})`} />
            </g>
            <g clipPath={`url(#${id('wordClip')})`}>
              <g ref={bind('nano')} transform="translate(0 80)">
                <text className="nt-word nt-word--nano" x="147" y="202.5" textLength="257" lengthAdjust="spacingAndGlyphs" fill={`url(#${id('ink')})`}>
                  NANO
                </text>
              </g>
              <g ref={bind('tex')} transform="translate(0 80)">
                <text className="nt-word nt-word--tex" x="416" y="202.5" textLength="158" lengthAdjust="spacingAndGlyphs" fill={`url(#${id('tex')})`}>
                  TEX
                </text>
              </g>
            </g>
          </g>

          {/* 7. Slogan */}
          <g clipPath={`url(#${id('wingsClip')})`}>
            <path d={WORDMARK.wingLeft} fill={COLORS.black} />
            <path d={WORDMARK.wingRight} fill={COLORS.black} />
          </g>
          <g ref={bind('slogan')} style={{ opacity: 0 }} fill={COLORS.ink}>
            {/* Word positions measured from the original raster. */}
            <text className="nt-slogan" x="171" y="231.6" textLength="46">SIFAT</text>
            <circle cx="229.5" cy="225.3" r="2.1" />
            <text className="nt-slogan" x="242" y="231.6" textLength="77">ISHONCH</text>
            <circle cx="331.5" cy="225.3" r="2.1" />
            <text className="nt-slogan" x="344" y="231.6" textLength="131">SAMARADORLIK</text>
          </g>

          {compare && (
            <image href={ORIGINAL_SRC} x="0" y="0" width="640" height="640" opacity="0.5" pointerEvents="none" />
          )}
        </svg>
      </div>

      {showControls && (
        <div className="nt-logo__controls">
          <button type="button" onClick={() => play({ speed: slow ? 0.25 : 1 })}>
            ↻ Takrorlash
          </button>
          <label>
            <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} /> Sekin (×0.25)
          </label>
          <label>
            <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} /> Original bilan solishtirish
          </label>
          {reduceMotion && <span className="nt-logo__note">prefers-reduced-motion: statik logotip</span>}
        </div>
      )}
    </div>
  );
});

export default LogoAnimation;
