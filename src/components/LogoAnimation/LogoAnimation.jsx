import { forwardRef, useCallback, useEffect, useImperativeHandle, useId, useRef, useState } from 'react';
import { animate, frame, cancelFrame, motionValue, useReducedMotion } from 'framer-motion';
import { COLORS, DROPLET, GEAR, NOZZLE, STATION, VESSEL, VIEWBOX, WORDMARK, dropPath } from './geometry';
import './LogoAnimation.css';

const ORIGINAL_SRC = `${import.meta.env.BASE_URL}brand/nanotex-logo-original.jpg`;

const FONTS = ['italic 900 64px "Saira"', '600 16px "Barlow"', 'italic 800 16px "Montserrat"'];

const EASE = {
  out: [0.16, 1, 0.3, 1],
  soft: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  draw: [0.45, 0, 0.2, 1],
  // cubic-bezier(1/3, 0, 2/3, 1/3) is exactly y = t² — uniform acceleration from rest.
  gravity: [1 / 3, 0, 2 / 3, 1 / 3],
};

const INITIAL = {
  gearDraw: 0, gearRot: -35, gearScale: 0.86, gearFill: 0, disc: 0,
  station: 0,
  nozzleDraw: 0, nozzleFill: 0, vesselDraw: 0, tilt: 0,
  dropForm: 0, dropFall: 0, impact: 0, liquid: 0,
  mark: 0, nano: 0, tex: 0, line: 0,
  slogan: 0, wings: 0,
};

const FINAL = Object.fromEntries(Object.keys(INITIAL).map((k) => [k, 1]));
Object.assign(FINAL, { gearRot: 0, gearScale: 1, tilt: 0 });

// [value, target | keyframes, { at, duration, ease, times }] — seconds.
const TIMELINE = [
  // 2. Gear: thin contour draws itself, assembles and settles with a small turn.
  ['gearDraw', 1, { at: 0.15, duration: 0.8, ease: EASE.draw }],
  ['gearRot', 0, { at: 0.1, duration: 1.15, ease: EASE.out }],
  ['gearScale', 1, { at: 0.1, duration: 1.15, ease: EASE.out }],
  ['gearFill', 1, { at: 0.6, duration: 0.35, ease: 'easeOut' }],
  ['disc', 1, { at: 0.62, duration: 0.5, ease: EASE.soft }],
  // The station enters while the contour reaches the bottom, so the gear's cropped edge is never seen bare.
  ['station', 1, { at: 0.45, duration: 0.7, ease: EASE.out }],
  // 3. Nozzle and drop pictogram appear inside the gear.
  ['nozzleDraw', 1, { at: 1.0, duration: 0.5, ease: EASE.draw }],
  ['vesselDraw', 1, { at: 1.12, duration: 0.45, ease: EASE.draw }],
  ['nozzleFill', 1, { at: 1.3, duration: 0.3, ease: 'easeOut' }],
  // 4. Nozzle dips, holds while the drop forms, then recoils once the weight is gone.
  ['tilt', [0, NOZZLE.tilt, NOZZLE.tilt, -0.8, 0], {
    at: 1.55, duration: 1.45, times: [0, 0.241, 0.586, 0.766, 1],
    ease: ['easeInOut', 'linear', 'easeOut', 'easeInOut'],
  }],
  // 5. Drop forms, detaches, falls under gravity into the pictogram and fills it.
  ['dropForm', 1, { at: 1.9, duration: 0.5, ease: 'linear' }],
  ['dropFall', 1, { at: 2.4, duration: 0.3, ease: EASE.gravity }],
  ['impact', 1, { at: 2.7, duration: 0.14, ease: 'easeOut' }],
  ['liquid', 1, { at: 2.68, duration: 0.55, ease: EASE.soft }],
  // 6. Company name rises out of a mask.
  ['mark', 1, { at: 2.72, duration: 0.6, ease: EASE.out }],
  ['nano', 1, { at: 2.76, duration: 0.7, ease: EASE.out }],
  ['tex', 1, { at: 2.86, duration: 0.7, ease: EASE.out }],
  ['line', 1, { at: 2.9, duration: 0.7, ease: EASE.inOut }],
  // 7. Slogan last.
  ['wings', 1, { at: 3.25, duration: 0.6, ease: EASE.inOut }],
  ['slogan', 1, { at: 3.3, duration: 0.55, ease: EASE.soft }],
];

export const LOGO_ANIMATION_DURATION = Math.max(...TIMELINE.map(([, , o]) => o.at + o.duration));

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (t) => Math.min(1, Math.max(0, t));
const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

// Where the drop hangs: bottom of the spout tip, rotated by the full tilt.
const DROP_X = (() => {
  const { x: px, y: py } = NOZZLE.pivot;
  const a = (NOZZLE.tilt * Math.PI) / 180;
  const dx = 336.2 - px;
  const dy = 322.1 - py;
  return px + dx * Math.cos(a) - dy * Math.sin(a);
})();

function setDraw(el, progress) {
  if (!el) return;
  el.style.strokeDashoffset = String(1 - progress);
  el.style.visibility = progress > 0 ? 'visible' : 'hidden';
}

function setOpacity(el, value) {
  if (el) el.style.opacity = String(value);
}

function setTransform(el, value) {
  if (el) el.setAttribute('transform', value);
}

/** Droplet shape for the current state; null when it should not be drawn. */
function dropletState({ dropForm: f, dropFall: p, impact: i }) {
  if (f <= 0 || i >= 1) return null;
  const R = DROPLET.r;
  const restLen = R * 1.05 + DROPLET.neck;
  const x = DROP_X;
  let r;
  let len;
  let cy;
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

const LogoAnimation = forwardRef(function LogoAnimation(
  { autoPlay = true, showControls = false, forceMotion = false, onComplete, className = '' },
  ref,
) {
  // forceMotion is a QA escape hatch only; real visitors with reduced motion get the static logo.
  const reduceMotion = useReducedMotion() && !forceMotion;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name) => `nt-${uid}-${name}`;

  const els = useRef({});
  const bind = (name) => (node) => {
    els.current[name] = node;
  };

  const valuesRef = useRef(null);
  if (!valuesRef.current) {
    valuesRef.current = Object.fromEntries(Object.entries(INITIAL).map(([k, v]) => [k, motionValue(v)]));
  }
  const controlsRef = useRef([]);
  const runRef = useRef(0);

  const [compare, setCompare] = useState(false);
  const [slow, setSlow] = useState(false);
  const [done, setDone] = useState(false);

  const render = useCallback(() => {
    const s = Object.fromEntries(Object.entries(valuesRef.current).map(([k, mv]) => [k, mv.get()]));
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
    ['nozzleBodyLine', 'nozzleWindowLine', 'nozzleSpout', 'nozzleTail'].forEach((k) => setDraw(e[k], s.nozzleDraw));
    setOpacity(e.nozzleFill, s.nozzleFill);
    setOpacity(e.nozzleSpoutCore, s.nozzleFill);
    setOpacity(e.nozzleTip, s.nozzleFill);
    setDraw(e.vessel, s.vesselDraw);

    // Droplet: drawn above the pictogram outline while hanging, behind it once falling inside.
    const drop = dropletState(s);
    [
      [e.dropFront, drop && drop.attached],
      [e.dropBack, drop && !drop.attached],
    ].forEach(([el, visible]) => {
      if (!el) return;
      el.style.visibility = visible ? 'visible' : 'hidden';
      if (visible) {
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
  }, []);

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
    const unsubs = Object.values(valuesRef.current).map((mv) => mv.on('change', schedule));
    render();
    return () => {
      unsubs.forEach((u) => u());
      cancelFrame(flush);
    };
  }, [render]);

  const stopAll = () => {
    controlsRef.current.forEach((c) => c.stop());
    controlsRef.current = [];
  };

  const jumpTo = useCallback(
    (state) => {
      stopAll();
      Object.entries(state).forEach(([k, v]) => valuesRef.current[k].jump(v));
      render();
    },
    [render],
  );

  const play = useCallback(
    async ({ speed = 1 } = {}) => {
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
        animate(valuesRef.current[key], target, { ...rest, delay: at * k, duration: duration * k }),
      );
      await Promise.all(controlsRef.current);
      if (run !== runRef.current) return;
      setDone(true);
      onComplete?.();
    },
    [jumpTo, onComplete, reduceMotion],
  );

  /** Freeze the timeline at `t` seconds — for QA and screenshots. */
  const seek = useCallback(
    (t) => {
      runRef.current++;
      jumpTo(INITIAL);
      controlsRef.current = TIMELINE.map(([key, target, { at, duration, ...rest }]) => {
        const c = animate(valuesRef.current[key], target, { ...rest, duration });
        c.pause();
        c.time = Math.min(duration, Math.max(0, t - at));
        return c;
      });
      render();
      setDone(t >= LOGO_ANIMATION_DURATION);
    },
    [jumpTo, render],
  );

  useImperativeHandle(
    ref,
    () => ({ replay: (opts) => play(opts), seek, showFinal: () => jumpTo(FINAL) }),
    [play, seek, jumpTo],
  );

  useEffect(() => {
    if (reduceMotion) {
      jumpTo(FINAL);
      setDone(true);
      return undefined;
    }
    if (autoPlay) play();
    else jumpTo(INITIAL);
    return () => {
      runRef.current++;
      stopAll();
    };
    // play/jumpTo are stable for a given reduceMotion value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, reduceMotion]);

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
