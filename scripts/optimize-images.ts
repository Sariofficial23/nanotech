// Converts the original station renders into web-ready AVIF/WebP files in public/images.
// The 2.5 MB PNG originals stay outside the repository.
// Run: npm run images -- "<folder with originals>" [name prefix to limit the run, e.g. slide-]
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Originals are matched by the time stamp in their file name (the rest of the name contains odd spaces).
// `dir` is a sub-folder of the originals folder.
const SLIDES = 'Новая папка';
const SOURCES: { stamp: string; name: string; dir?: string }[] = [
  { stamp: '00_29_23', name: 'station-sunset' },
  { stamp: '00_34_24', name: 'station-highway' },
  { stamp: '00_50_28', name: 'station-arrive' },
  { stamp: '00_50_35', name: 'station-refuel' },
  // Hero slider: clean renders (English captions are added in HTML) …
  { stamp: '21_44_42', name: 'slide-city', dir: SLIDES },
  { stamp: '21_44_50', name: 'slide-mountains', dir: SLIDES },
  { stamp: '21_44_15', name: 'slide-village', dir: SLIDES },
  { stamp: '21_44_36', name: 'slide-company', dir: SLIDES },
  // … Russian captions baked in …
  { stamp: '21_53_04', name: 'slide-city-ru', dir: SLIDES },
  { stamp: '21_54_11', name: 'slide-highway-ru', dir: SLIDES },
  { stamp: '21_53_31', name: 'slide-mountains-ru', dir: SLIDES },
  { stamp: '21_53_19', name: 'slide-village-ru', dir: SLIDES },
  { stamp: '21_53_12', name: 'slide-company-ru', dir: SLIDES },
  // … Uzbek captions baked in.
  { stamp: '21_59_25', name: 'slide-city-uz', dir: SLIDES },
  { stamp: '21_59_56', name: 'slide-highway-uz', dir: SLIDES },
  { stamp: '21_59_50', name: 'slide-mountains-uz', dir: SLIDES },
  { stamp: '21_59_47', name: 'slide-village-uz', dir: SLIDES },
  { stamp: '21_59_39', name: 'slide-company-uz', dir: SLIDES },
];

const WIDTHS = [800, 1600];

const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Usage: npm run images -- "<folder with originals>"');
  process.exit(1);
}

const outDir = fileURLToPath(new URL('../public/images/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const only = process.argv[3];

for (const { stamp, name, dir } of SOURCES.filter((s) => !only || s.name.startsWith(only))) {
  const folder = dir ? join(inputDir, dir) : inputDir;
  const file = readdirSync(folder).find((f) => f.includes(stamp) && f.endsWith('.png'));
  if (!file) throw new Error(`Original with time stamp ${stamp} not found in ${folder}`);
  const input = sharp(join(folder, file));
  const { width, height } = await input.metadata();
  for (const w of WIDTHS) {
    const resized = input.clone().resize({ width: Math.min(w, width ?? w) });
    const slide = name.startsWith('slide-');
    await resized.clone().avif({ quality: slide ? 68 : 55, effort: 6 }).toFile(join(outDir, `${name}-${w}.avif`));
    await resized.clone().webp({ quality: slide ? 88 : 78 }).toFile(join(outDir, `${name}-${w}.webp`));
  }
  console.log(`${name}: ${width}×${height}`);

  // Social preview (Open Graph): 1200×630 from the sunset render.
  if (name === 'station-sunset') {
    const og = fileURLToPath(new URL('../public/og.jpg', import.meta.url));
    await input.clone().resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile(og);
    console.log('og.jpg: 1200×630');
  }
}
