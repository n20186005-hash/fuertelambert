/**
 * Image pipeline for Fuerte de Coquimbo.
 *
 * 1. Normalises every photo in public/gallery to the canonical pattern
 *      <slug>-<n>.<ext>            e.g. fuerte-de-coquimbo-7.jpg
 * 2. Re-encodes JPEGs (auto-rotate, max width, mozjpeg) and emits a WebP twin
 *    so the front-end can serve <picture> sources.
 * 3. Builds the social sharing image (public/og-image.jpg, 1200x630).
 * 4. Downsizes the PWA icons to their declared pixel sizes.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import { readdir, readFile, writeFile, rm, mkdir, rename, unlink, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const GALLERY_DIR = path.resolve('public/gallery');
const TMP_DIR = path.resolve('.tmp-image-pipeline');
const SLUG = 'fuerte-de-coquimbo';

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 72;
const WEBP_QUALITY = 72;

const OG_SOURCE = `${SLUG}-1.jpg`;
const OG_OUT = path.resolve('public/og-image.jpg');

const ICONS_DIR = path.resolve('public/icons');

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const photoNumber = (file) => parseInt(file.match(/(\d+)(?=\.[a-z]+$)/i)?.[1] ?? '0', 10);

async function listSources() {
  const entries = await readdir(GALLERY_DIR);
  return entries
    .filter((f) => /\.jpe?g$/i.test(f))
    .sort((a, b) => photoNumber(a) - photoNumber(b));
}

async function run() {
  const sources = await listSources();
  console.log(`Found ${sources.length} source photos in public/gallery`);

  await rm(TMP_DIR, { recursive: true, force: true });
  await mkdir(TMP_DIR, { recursive: true });

  let beforeBytes = 0;
  let afterBytes = 0;

  for (let i = 0; i < sources.length; i++) {
    const src = sources[i];
    const srcPath = path.join(GALLERY_DIR, src);
    const srcSize = (await stat(srcPath)).size;
    beforeBytes += srcSize;

    const base = `${SLUG}-${i + 1}`;
    const jpgTmp = path.join(TMP_DIR, `${base}.jpg`);
    const webpTmp = path.join(TMP_DIR, `${base}.webp`);

    const oriented = sharp(srcPath).rotate();

    const jpegBuffer = await oriented
      .clone()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toBuffer();

    // Never make a file bigger than the original.
    if (jpegBuffer.length < srcSize) {
      await writeFile(jpgTmp, jpegBuffer);
    } else {
      await writeFile(jpgTmp, await readFile(srcPath));
    }

    await oriented
      .clone()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(webpTmp);

    const jpgSize = (await stat(jpgTmp)).size;
    afterBytes += jpgSize;

    console.log(
      `${src} -> ${base}.jpg + .webp   ${kb(srcSize)} -> ${kb(jpgSize)} (-${Math.round(
        (1 - jpgSize / srcSize) * 100
      )}%)`
    );
  }

  // Swap the freshly generated set in, dropping every legacy filename.
  for (const entry of await readdir(GALLERY_DIR)) {
    await unlink(path.join(GALLERY_DIR, entry));
  }
  for (const entry of await readdir(TMP_DIR)) {
    await rename(path.join(TMP_DIR, entry), path.join(GALLERY_DIR, entry));
  }
  await rm(TMP_DIR, { recursive: true, force: true });

  // Social sharing card (1200x630 keeps the subject inside the safe area).
  await sharp(path.join(GALLERY_DIR, OG_SOURCE))
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toFile(OG_OUT);
  console.log(`wrote og-image.jpg (${kb((await stat(OG_OUT)).size)})`);

  // PWA icons: read once, then emit the exact declared sizes.
  const iconBuf = await readFile(path.join(ICONS_DIR, 'icon-512.png'));
  for (const size of [512, 192]) {
    const out = path.join(ICONS_DIR, `icon-${size}.png`);
    await sharp(iconBuf).resize(size, size, { fit: 'cover' }).png({ compressionLevel: 9, palette: true }).toFile(out);
    console.log(`wrote icons/icon-${size}.png (${kb((await stat(out)).size)})`);
  }

  console.log(
    `\nGallery JPEG payload: ${kb(beforeBytes)} -> ${kb(afterBytes)} ` +
      `(-${Math.round((1 - afterBytes / beforeBytes) * 100)}%)`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
