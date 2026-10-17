import { useId } from 'react';
import BrandMark from '../brand/BrandMark';

interface StationIllustrationProps {
  variant?: 'night' | 'day';
  className?: string;
  title?: string;
}

const PALETTES = {
  night: {
    ground: '#151515',
    groundLine: '#2a2a2a',
    lane: '#3a3a3a',
    facade: ['#222222', '#141414'],
    word: '#FFFFFF',
    slogan: '#9a9a9a',
    pylon: '#0d0d0d',
    pylonLine: '#2b2b2b',
    shadow: 0.55,
  },
  day: {
    ground: '#ECE8DF',
    groundLine: '#DCD6CA',
    lane: '#FFFFFF',
    facade: ['#FFFFFF', '#F1EFEA'],
    word: '#111111',
    slogan: '#6b6b6b',
    pylon: '#141414',
    pylonLine: '#2b2b2b',
    shadow: 0.22,
  },
} as const;

/**
 * Concept illustration of a compact NanoTech fuel station (not a photo of an existing site).
 * Inspired by modular "capsule" stations; drawn in NanoTech colours with its own signage.
 */
export default function StationIllustration({ variant = 'night', className, title }: StationIllustrationProps) {
  const p = PALETTES[variant];
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name: string) => `st-${uid}-${name}`;
  const night = variant === 'night';

  return (
    <svg
      viewBox="0 0 760 520"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={id('facade')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.facade[0]} />
          <stop offset="1" stopColor={p.facade[1]} />
        </linearGradient>
        <linearGradient id={id('frame')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD233" />
          <stop offset="1" stopColor="#F2B500" />
        </linearGradient>
        <linearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={night ? '#2d3642' : '#BFD3E0'} />
          <stop offset="1" stopColor={night ? '#12161c' : '#7F98A8'} />
        </linearGradient>
        <linearGradient id={id('interior')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={night ? '#FFE9A3' : '#FFF6D6'} stopOpacity={night ? 0.55 : 0.5} />
          <stop offset="1" stopColor={night ? '#FFC400' : '#FFE38A'} stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={id('sweep')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('reflection')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('shadow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000000" stopOpacity={p.shadow} />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <filter id={id('glow')} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <clipPath id={id('glassClip')}>
          <rect x="112" y="218" width="108" height="192" rx="4" />
        </clipPath>
        <mask id={id('reflectionMask')}>
          <rect x="0" y="410" width="760" height="110" fill={`url(#${id('reflection')})`} />
        </mask>
      </defs>

      {/* Ground */}
      <rect x="0" y="410" width="760" height="110" fill={p.ground} />
      <rect x="0" y="410" width="760" height="2" fill={p.groundLine} />
      <g fill={p.lane} opacity={night ? 0.6 : 1}>
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={20 + i * 88} y="478" width="48" height="5" rx="2.5" />
        ))}
      </g>
      <ellipse cx="320" cy="414" rx="320" ry="16" fill={`url(#${id('shadow')})`} />

      {/* Soft reflection of the station on the forecourt */}
      {night && (
        <g mask={`url(#${id('reflectionMask')})`} opacity="0.18" transform="translate(0 820) scale(1 -1)">
          <rect x="40" y="168" width="540" height="242" rx="60" fill="#FFC400" />
          <rect x="112" y="218" width="108" height="192" fill="#FFE9A3" />
        </g>
      )}

      {/* Price pylon */}
      <g>
        <rect x="612" y="112" width="68" height="300" rx="12" fill={p.pylon} stroke={p.pylonLine} strokeWidth="1.5" />
        <rect x="612" y="112" width="68" height="92" rx="12" fill={`url(#${id('frame')})`} />
        <rect x="612" y="180" width="68" height="24" fill={`url(#${id('frame')})`} />
        <BrandMark x={622} y={122} size={48} />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(622 ${222 + i * 40})`}>
            <rect width="48" height="28" rx="5" fill="#1d1d1d" stroke="#333" />
            <path d="M10 7c0 0-5 6-5 9a5 5 0 0 0 10 0c0-3-5-9-5-9Z" fill="#FFC400" />
            <rect x="20" y="10" width="20" height="3" rx="1.5" fill="#FFC400" opacity="0.85" />
            <rect x="20" y="16" width="14" height="3" rx="1.5" fill="#FFC400" opacity="0.45" />
          </g>
        ))}
        <rect x="630" y="356" width="32" height="56" fill="#1a1a1a" />
      </g>

      {/* Roof equipment */}
      <g fill={night ? '#1d1d1d' : '#2a2a2a'}>
        <rect x="408" y="150" width="62" height="20" rx="4" />
        <rect x="480" y="154" width="44" height="16" rx="4" />
        <rect x="190" y="158" width="4" height="12" />
      </g>

      {/* Station capsule: yellow frame + facade */}
      {night && (
        <rect
          x="64"
          y="166"
          width="492"
          height="6"
          rx="3"
          fill="#FFC400"
          opacity="0.55"
          filter={`url(#${id('glow')})`}
        />
      )}
      <rect x="40" y="168" width="540" height="242" rx="60" fill={`url(#${id('frame')})`} />
      <rect x="64" y="192" width="492" height="194" rx="38" fill={`url(#${id('facade')})`} />
      <rect x="40" y="396" width="540" height="14" fill="#E0A600" opacity="0.6" />

      {/* Glass entrance */}
      <rect x="104" y="210" width="124" height="200" rx="6" fill="#0c0c0c" />
      <g clipPath={`url(#${id('glassClip')})`}>
        <rect x="112" y="218" width="108" height="192" fill={`url(#${id('glass')})`} />
        <rect x="112" y="218" width="108" height="192" fill={`url(#${id('interior')})`} />
        <path d="M120 410 L190 218 M150 410 L220 228" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="10" />
        <rect
          className="animate-sweep"
          style={{ transformBox: 'fill-box' }}
          x="112"
          y="218"
          width="60"
          height="192"
          fill={`url(#${id('sweep')})`}
        />
      </g>
      <rect x="164" y="218" width="4" height="192" fill="#0c0c0c" />
      <rect x="152" y="300" width="3" height="34" rx="1.5" fill="#d9d9d9" />
      <rect x="177" y="300" width="3" height="34" rx="1.5" fill="#d9d9d9" />

      {/* Signage */}
      <BrandMark x={250} y={220} size={58} />
      <text
        x="316"
        y="261"
        fontFamily="Saira, sans-serif"
        fontStyle="italic"
        fontWeight="900"
        fontSize="30"
        textLength="138"
        lengthAdjust="spacingAndGlyphs"
      >
        <tspan fill={p.word}>NANO</tspan>
        <tspan fill="#FFC400" stroke={night ? 'none' : '#111'} strokeWidth="1.2" paintOrder="stroke">
          TEX
        </tspan>
      </text>
      <text
        x="252"
        y="302"
        fontFamily="Barlow, Inter, sans-serif"
        fontWeight="600"
        fontSize="10.5"
        letterSpacing="1.4"
        textLength="200"
        fill={p.slogan}
      >
        SIFAT • ISHONCH • SAMARADORLIK
      </text>

      {/* Fuel board */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(472 ${216 + i * 30})`}>
          <rect width="68" height="22" rx="6" fill="#FFC400" />
          <path d="M13 4.5c0 0-4.5 5.5-4.5 8.2a4.5 4.5 0 0 0 9 0c0-2.7-4.5-8.2-4.5-8.2Z" fill="#111" />
          <rect x="24" y="7" width="32" height="3" rx="1.5" fill="#111" opacity="0.8" />
          <rect x="24" y="13" width="20" height="3" rx="1.5" fill="#111" opacity="0.4" />
        </g>
      ))}

      {/* LED strip along the facade */}
      <rect x="250" y="340" width="290" height="3" rx="1.5" fill="#FFC400" />
      {night && <rect x="250" y="338" width="290" height="7" rx="3.5" fill="#FFC400" opacity="0.5" filter={`url(#${id('glow')})`} />}

      {/* Bollards */}
      {[264, 300].map((x) => (
        <g key={x}>
          <rect x={x} y="380" width="12" height="32" rx="6" fill="#FFC400" />
          <rect x={x} y="390" width="12" height="6" fill="#111" />
        </g>
      ))}
    </svg>
  );
}
