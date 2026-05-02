import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SOURCE = join(__dirname, '../public/assets/_originals/favicon-source.jpg');
const OUTPUT_DIR = join(__dirname, '../public');

const SIZES = [
  { name: 'favicon-16.png',       size: 16  },
  { name: 'favicon-32.png',       size: 32  },
  { name: 'favicon-48.png',       size: 48  },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png',         size: 192 },
  { name: 'icon-512.png',         size: 512 },
];

const pngBuffers = {};

for (const { name, size } of SIZES) {
  const buf = await sharp(SOURCE)
    .resize(size, size, { fit: 'cover', position: 'center' })
    .png()
    .toBuffer();
  await writeFile(join(OUTPUT_DIR, name), buf);
  const kb = Math.round(buf.length / 1024);
  console.log(`✓ ${name}  ${kb} KB`);
  pngBuffers[size] = buf;
}

const icoBuf = await pngToIco([pngBuffers[16], pngBuffers[32], pngBuffers[48]]);
await writeFile(join(OUTPUT_DIR, 'favicon.ico'), icoBuf);
const icoKb = Math.round(icoBuf.length / 1024);
console.log(`✓ favicon.ico  ${icoKb} KB  (16+32+48 packed)`);

console.log('\nDone. 7 files written to public/');
