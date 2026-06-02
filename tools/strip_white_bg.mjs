import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = "frontend/public/assets";
const OUT_DIR = "frontend/public/assets";

const WHITE_THRESHOLD = 240;
const CHROMA_THRESHOLD = 20;

async function strip(file) {
  const inPath = path.join(SRC_DIR, file);
  const outName = path.basename(file, path.extname(file)) + ".png";
  const outPath = path.join(OUT_DIR, outName);

  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;

    if (chroma < CHROMA_THRESHOLD) {
      const luminance = (r + g + b) / 3;
      if (luminance >= WHITE_THRESHOLD) {
        data[i + 3] = 0;
      } else {
        data[i + 3] = Math.max(0, Math.min(255, Math.round(255 - luminance)));
      }
    } else {
      data[i + 3] = 255;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(outPath);

  console.log(`${file} → ${outName}  (${info.width}x${info.height})`);
}

const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g)$/i.test(f));
if (files.length === 0) {
  console.log("No JPEGs found in", SRC_DIR);
  process.exit(0);
}

for (const f of files) await strip(f);
console.log("Done.");
