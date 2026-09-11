/**
 * Builds the derived branding assets from the compressed gallery source:
 *   - public/og-image.jpg       1200x630 social sharing card
 *   - public/icons/icon-512.png exact 512x512 PWA icon
 *   - public/icons/icon-192.png exact 192x192 PWA icon
 *
 * Usage: node scripts/build-social-assets.mjs
 */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const GALLERY_DIR = path.resolve('public/gallery');
const ICONS_DIR = path.resolve('public/icons');
const OG_OUT = path.resolve('public/og-image.jpg');

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

async function run() {
  await sharp(path.join(GALLERY_DIR, 'fuerte-de-coquimbo-1.jpg'))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toFile(OG_OUT);
  console.log(`wrote og-image.jpg (${kb((await stat(OG_OUT)).size)})`);

  const iconBuf = await readFile(path.join(ICONS_DIR, 'icon-512.png'));
  for (const size of [512, 192]) {
    const out = path.join(ICONS_DIR, `icon-${size}.png`);
    await sharp(iconBuf).resize(size, size, { fit: 'cover' }).png({ compressionLevel: 9, palette: true }).toFile(out);
    console.log(`wrote icons/icon-${size}.png (${kb((await stat(out)).size)})`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
