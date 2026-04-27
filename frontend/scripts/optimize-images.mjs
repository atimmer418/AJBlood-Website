import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const INPUT_DIR = join(__dirname, '../public/assets/_originals');
const OUTPUT_DIR = join(__dirname, '../public/assets/optimized');
const WIDTHS = [480, 960, 1600, 2400];
const QUALITY = 78;

await mkdir(OUTPUT_DIR, { recursive: true });

const files = await readdir(INPUT_DIR);
const images = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

if (images.length === 0) {
  console.error('No images found in', INPUT_DIR);
  process.exit(1);
}

for (const file of images) {
  const name = basename(file, extname(file));
  const inputPath = join(INPUT_DIR, file);

  for (const width of WIDTHS) {
    const outputPath = join(OUTPUT_DIR, `${name}-${width}.webp`);
    const info = await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    const kb = Math.round(info.size / 1024);
    console.log(`✓ ${name}-${width}.webp  ${kb} KB`);
  }
}

console.log(`\nDone. ${images.length} image(s) × ${WIDTHS.length} widths = ${images.length * WIDTHS.length} files written to ${OUTPUT_DIR}`);
