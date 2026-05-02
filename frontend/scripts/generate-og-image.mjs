import sharp from 'sharp';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');

// Canvas
const W = 1200, H = 630;

// Layout
const PAD = 60;
const HS_LEFT = PAD;
const HS_TOP = 85;
const HS_W = 380;
const HS_H = 460;
const HS_R = 24;
const TEXT_X = 490;
const BAR_H = 70;
const BAR_Y = H - BAR_H;

// Brand colors (from styles.scss)
const BG     = '#000f22'; // --color-primary
const BG_BAR = '#0a2540'; // --color-primary-container
const CYAN   = '#60f6e5'; // --color-secondary-container
const WHITE  = '#ffffff';
const MUTED  = '#768dad'; // --color-on-primary-container

// Embed fonts as WOFF2 base64 data URIs so librsvg can find them
const notoB64  = (await readFile(join(__dirname, 'fonts', 'NotoSerif-Bold.woff2'))).toString('base64');
const interB64 = (await readFile(join(__dirname, 'fonts', 'Inter-Medium.woff2'))).toString('base64');

// --- Headshot with rounded corners ---
const headshotRaw = await readFile(join(ROOT, 'public', 'assets', '_originals', 'headshot.jpg'));
const headshotPng = await sharp(headshotRaw)
  .resize(HS_W, HS_H, { fit: 'cover', position: 'top' })
  .png()
  .toBuffer();

const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${HS_W}" height="${HS_H}">
  <rect width="${HS_W}" height="${HS_H}" rx="${HS_R}" ry="${HS_R}" fill="white"/>
</svg>`;

const headshotRounded = await sharp(headshotPng)
  .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
  .png()
  .toBuffer();

// --- ECG heartbeat polyline helper ---
// One beat cell: flat → rise → peak → valley → return → flat
// Values relative to a 35-unit center baseline, 120-unit wide cell
const beatPoints = (ox, oy) =>
  `${ox},${oy+35} ${ox+20},${oy+35} ${ox+30},${oy+12} ${ox+40},${oy+58} ${ox+50},${oy+18} ${ox+62},${oy+35} ${ox+120},${oy+35}`;

const ecgLeft  = beatPoints(32, BAR_Y - 35 + 35);
const ecgRight = (() => {
  // Mirror horizontally from right edge
  const ox = W - 32 - 120, oy = BAR_Y - 35 + 35;
  return `${W-32},${oy+35} ${W-52},${oy+35} ${W-62},${oy+12} ${W-72},${oy+58} ${W-82},${oy+18} ${W-94},${oy+35} ${W-152},${oy+35}`;
})();

// --- SVG text + decoration overlay ---
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <style>
      @font-face {
        font-family: 'NotoSerif';
        font-weight: 700;
        src: url('data:font/woff2;base64,${notoB64}') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-weight: 500;
        src: url('data:font/woff2;base64,${interB64}') format('woff2');
      }
    </style>
  </defs>

  <!-- Eyebrow top-left -->
  <text x="${PAD}" y="50"
        font-family="Inter, Helvetica, Arial, sans-serif" font-weight="500"
        font-size="13" letter-spacing="3.5" fill="${MUTED}">DR. ALEXANDER J. BLOOD</text>

  <!-- Name: 3-line serif stack -->
  <text x="${TEXT_X}" y="175"
        font-family="NotoSerif, Georgia, 'Times New Roman', serif" font-weight="700"
        font-size="82" fill="${WHITE}">Dr.</text>
  <text x="${TEXT_X}" y="275"
        font-family="NotoSerif, Georgia, 'Times New Roman', serif" font-weight="700"
        font-size="82" fill="${WHITE}">Alexander</text>
  <text x="${TEXT_X}" y="375"
        font-family="NotoSerif, Georgia, 'Times New Roman', serif" font-weight="700"
        font-size="82" fill="${WHITE}">J. Blood, MD</text>

  <!-- Credentials line 1 -->
  <text x="${TEXT_X}" y="420"
        font-family="Inter, Helvetica, Arial, sans-serif" font-weight="500"
        font-size="19" letter-spacing="0.4" fill="${CYAN}">MSc · FACC · ABOM · Cardiologist · Founder</text>

  <!-- Credentials line 2 -->
  <text x="${TEXT_X}" y="448"
        font-family="Inter, Helvetica, Arial, sans-serif" font-weight="500"
        font-size="19" letter-spacing="0.4" fill="${CYAN}">CEO · Board Member · AI Healthcare Innovator</text>

  <!-- Bottom bar -->
  <rect x="0" y="${BAR_Y}" width="${W}" height="${BAR_H}" fill="${BG_BAR}"/>

  <!-- ECG lines -->
  <polyline points="${ecgLeft}"  stroke="${CYAN}" stroke-width="2" fill="none" opacity="0.7"/>
  <polyline points="${ecgRight}" stroke="${CYAN}" stroke-width="2" fill="none" opacity="0.7"/>

  <!-- Bottom bar label -->
  <text x="${W / 2}" y="${BAR_Y + 44}"
        font-family="Inter, Helvetica, Arial, sans-serif" font-weight="500"
        font-size="15" letter-spacing="1.5" fill="${MUTED}" text-anchor="middle">
    Cardiometabolic Care  |  AI in Healthcare Research and Delivery
  </text>
</svg>`;

// --- Composite and output ---
const outPath = join(ROOT, 'public', 'og-image.jpg');

await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
  .composite([
    { input: headshotRounded, left: HS_LEFT, top: HS_TOP },
    { input: Buffer.from(svg), left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(outPath);

const finalBuf = await readFile(outPath);
console.log(`✓ og-image.jpg  ${(finalBuf.length / 1024).toFixed(1)} KB  (${W}×${H})`);
console.log(`\nDone. Written to public/og-image.jpg`);
