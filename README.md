# NanoTech — korporativ sayt

Ko‘chma yoqilg‘i quyish shoxobchalari loyihasi uchun bir sahifali korporativ sayt.
Stack: React 19 + TypeScript + Vite 8, Tailwind CSS 4, Framer Motion, Lucide, React Hook Form + Zod.
Arizalar Vercel Function (`api/lead.ts`) orqali Telegram’ga yuboriladi.

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5180
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm run build      # typecheck + production build → dist/
npm run preview    # build natijasini lokal ko‘rish
```

`npm run dev` faqat frontendni ishga tushiradi: `/api/lead` bu rejimda mavjud emas, shuning uchun forma
**xato** ko‘rsatadi (soxta “yuborildi” chiqmaydi). Formani to‘liq sinash uchun Vercel CLI bilan:

```bash
npx vercel dev
```

## Tuzilma

```
api/lead.ts                      Vercel Function: arizani tekshiradi va Telegram’ga yuboradi
public/                          favicon.svg, og.jpg, robots.txt, images/ (AVIF/WebP), brand/
scripts/generate-favicon.ts      favicon.svg ni logotip geometriyasidan yaratadi (npm run favicon)
scripts/optimize-images.ts       PNG vizualizatsiyalarni AVIF/WebP (800/1600) va og.jpg ga aylantiradi
src/
  App.tsx, main.tsx, index.css   kirish nuqtasi, dizayn tokenlari (Tailwind @theme)
  config/site.ts                 brend nomi, menyu, rasmiy kontaktlar (env’dan)
  sections/                      Hero, ScrollStory, About, Solutions, Process, Partnership, Faq, Contact
  components/
    LogoAnimation/               logotip animatsiyasi (geometry.ts, timeline.ts)
    brand/                       BrandMark (belgi), Logo (belgi + yozuv)
    story/                       scroll-sahna: StationScene, storyTimeline
    layout/                      Header, Footer, IntroOverlay
    contact/                     ContactForm, ContactChannels, Field
    ui/                          Button, Section, Reveal, Accordion
  lib/                           leadSchema (forma + API uchun umumiy), submitLead, phone, intro, contactIntent
  hooks/                         useActiveSection, useScrolled
```

## Muhit o‘zgaruvchilari

`.env.example` dan nusxa oling (`.env.local`) yoki Vercel → Settings → Environment Variables ga kiriting.

| O‘zgaruvchi | Qayerda | Vazifasi |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | faqat server | @BotFather bergan bot tokeni |
| `TELEGRAM_CHAT_ID` | faqat server | arizalar keladigan chat/guruh ID si (bot u yerda a’zo bo‘lishi kerak) |
| `VITE_CONTACT_PHONE` | sayt | rasmiy telefon, masalan `+998 90 000 00 00` |
| `VITE_CONTACT_TELEGRAM` | sayt | Telegram username (`@` siz ham bo‘ladi) |
| `VITE_CONTACT_INSTAGRAM` | sayt | Instagram username (standart: `nanotex_azs`) |
| `VITE_SITE_URL` | sayt | sayt manzili (Open Graph uchun). Vercel’da bo‘sh qolsa, production domeni olinadi |
| `VITE_LEAD_ENDPOINT` | sayt | ixtiyoriy: arizalarni boshqa endpointga yuborish |

`VITE_` bilan boshlanadiganlar brauzerga tushadi — ularga hech qachon maxfiy kalit yozmang.
`VITE_*` o‘zgartirilgach, saytni qayta build/deploy qilish kerak.

## Arizalarni qabul qilishni ulash

1. Telegram’da @BotFather → `/newbot` → tokenni oling.
2. Botni arizalar keladigan guruhga qo‘shing (yoki botga shaxsiy xabar yozing).
3. Chat ID ni aniqlang: guruhga istalgan xabar yozing va
   `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching — `chat.id` qiymati (guruhlarda manfiy son).
4. Vercel’da `TELEGRAM_BOT_TOKEN` va `TELEGRAM_CHAT_ID` ni kiriting va qayta deploy qiling.
5. Saytdan sinov ariza yuboring — Telegram’da xabar paydo bo‘lishi kerak.

API javoblari: `200 {ok:true}` — yuborildi; `503` — sozlanmagan; `422` — ma’lumot noto‘g‘ri;
`502` — Telegram qabul qilmadi. Forma faqat `200 {ok:true}` da muvaffaqiyat ko‘rsatadi.

Boshqa xizmat (CRM, Formspree va h.k.) ishlatilsa: `VITE_LEAD_ENDPOINT` ga manzilni yozing.
U `POST` JSON (`name, phone, interest, comment, website, page`) qabul qilib, `{"ok": true}` qaytarishi kerak.

## Vercel’ga joylash

1. https://vercel.com → **Add New → Project** → GitHub’dagi `Sariofficial23/nanotech` ni tanlang.
2. Framework: **Vite** (avtomatik aniqlanadi). Build: `npm run build`, Output: `dist`.
3. **Environment Variables** ga yuqoridagi qiymatlarni kiriting.
4. **Deploy**. `api/lead.ts` avtomatik Vercel Function bo‘lib ishga tushadi.
5. Domen ulansa: Settings → Domains. Keyin `VITE_SITE_URL` ni shu domenga o‘rnatib, qayta deploy qiling.

Har bir `git push` dan keyin Vercel avtomatik yangi versiyani chiqaradi.

## Rasmlar va scroll-sahna

- Stansiya rasmlari — vizualizatsiyalar (saytda shunday belgilangan). Asl PNG’lar repozitoriyda saqlanmaydi;
  yangilash: `npm run images -- "D:\nano tech"` → `public/images/*.avif|webp` va `public/og.jpg`.
- “Ko‘chma shoxobchada jarayon qanday ko‘rinadi?” bo‘limi sahifa aylantirilganda ishlaydi: bir xil burchakdan
  olingan ikki rasm (`station-arrive` → `station-refuel`) sekin yaqinlashish bilan bir-biriga o‘tadi.
  Sozlamalar — `components/story/storyTimeline.ts`. `prefers-reduced-motion` da statik kadr ko‘rsatiladi.

## Logotip va intro

- Original logotip: `public/brand/nanotex-logo-original.jpg` (640×640 rastr). Animatsiya va belgi uchun
  u SVG’da qayta chizilgan (`components/LogoAnimation/geometry.ts`). Dizaynerdan vektor fayl kelsa,
  faqat shu fayldagi path’lar almashtiriladi.
- Intro birinchi tashrifda bir marta o‘ynaydi, “O‘tkazib yuborish” tugmasi bor, `prefers-reduced-motion`
  da ko‘rsatilmaydi. Sinash: `?intro` (yana ko‘rsatish), `?intro&force-motion` (reduced-motion’ni e’tiborsiz qoldirish).
