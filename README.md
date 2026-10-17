# NANOTEX — landing (logo animation)

React + Vite + Framer Motion. Logotip animatsiyasi: `src/components/LogoAnimation/`.

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # dist/
```

## LogoAnimation

```jsx
import LogoAnimation from './components/LogoAnimation';

<LogoAnimation showControls onComplete={() => {}} />
```

| Prop | Default | |
|---|---|---|
| `autoPlay` | `true` | mount bo‘lganda o‘ynaydi |
| `showControls` | `false` | Takrorlash / Sekin ×0.25 / Original bilan solishtirish |
| `forceMotion` | `false` | faqat test uchun: `prefers-reduced-motion` ni e’tiborsiz qoldiradi |
| `onComplete` | — | animatsiya tugaganda |

`ref` orqali: `replay({ speed })`, `seek(seconds)`, `showFinal()`.
Dev rejimida konsolda: `__nanotexLogo.replay()`, `__nanotexLogo.seek(2.5)`.

URL parametrlari: `?debug` (prod’da boshqaruv tugmalari), `?force-motion`.

## Logotip manbasi

Original — `public/brand/nanotex-logo-original.jpg` (640×640 JPG, bitta tekis rastr).
Uni qatlamlarga ajratib bo‘lmaydi, shuning uchun animatsiya uchun logotip shu rastr
ustidan 1:1 koordinatalarda SVG’da qayta chizilgan (`geometry.js`).
Dizaynerdan vektor manba (AI/SVG/PDF) olinganda `geometry.js` dagi path’larni
almashtirish kifoya — animatsiya kodi o‘zgarmaydi.
