import sharp from "sharp";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.resolve(__dirname, "../public/assets");

const jobs = [
  {
    src: path.join(ASSETS, "Green Accent Design Tweaks.png"),
    dst: path.join(ASSETS, "ritualmon-logo.png"),
  },
  {
    src: path.join(ASSETS, "Light Green Doodle Coloring Style.png"),
    dst: path.join(ASSETS, "ritual-knot.png"),
  },
];

const WHITE_THRESHOLD = 235;
const SOFT_EDGE = 220;

for (const { src, dst } of jobs) {
  const img = sharp(src).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const minC = Math.min(r, g, b);
    if (minC >= WHITE_THRESHOLD) {
      out[i + 3] = 0;
    } else if (minC >= SOFT_EDGE) {
      const t = (minC - SOFT_EDGE) / (WHITE_THRESHOLD - SOFT_EDGE);
      out[i + 3] = Math.round(out[i + 3] * (1 - t));
    }
  }

  await sharp(out, { raw: { width, height, channels } }).png().toFile(dst);
  console.log(`wrote ${path.basename(dst)}  (${width}x${height})`);
}
