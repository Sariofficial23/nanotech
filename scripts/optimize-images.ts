// Converts the original station renders into web-ready AVIF/WebP files in public/images.
// The 2.5 MB PNG originals stay outside the repository.
// Run: npm run images -- "<folder with originals>"
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Originals are matched by the time stamp in their file name (the rest of the name contains odd spaces).
const SOURCES: { stamp: string; name: string }[] = [
  { stamp: '00_29_23', name: 'station-sunset' },
  { stamp: '00_34_24', name: 'station-highway' },
  { stamp: '00_50_28', name: 'station-arrive' },
  { stamp: '00_50_35', name: 'station-refuel' },
];

const WIDTHS = [800, 1600];

const inputDir = process.argv[2];
if (!inputDir) {
  console.error('Usage: npm run images -- "<folder with originals>"');
  process.exit(1);
}

const outDir = fileURLToPath(new URL('../public/images/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const files = readdirSync(inputDir);

for (const { stamp, name } of SOURCES) {
  const file = files.find((f) => f.includes(stamp) && f.endsWith('.png'));
  if (!file) throw new Error(`Original with time stamp ${stamp} not found in ${inputDir}`);
  const input = sharp(join(inputDir, file));
  const { width, height } = await input.metadata();
  for (const w of WIDTHS) {
    const resized = input.clone().resize({ width: Math.min(w, width ?? w) });
    await resized.clone().avif({ quality: 55, effort: 6 }).toFile(join(outDir, `${name}-${w}.avif`));
    await resized.clone().webp({ quality: 78 }).toFile(join(outDir, `${name}-${w}.webp`));
  }
  console.log(`${name}: ${width}×${height}`);

  // Social preview (Open Graph): 1200×630 from the sunset render.
  if (name === 'station-sunset') {
    const og = fileURLToPath(new URL('../public/og.jpg', import.meta.url));
    await input.clone().resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile(og);
    console.log('og.jpg: 1200×630');
  }
}
