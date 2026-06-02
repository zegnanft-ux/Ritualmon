import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BORDER   = path.join(__dirname, "../frontend/public/assets/New bitty border.png");
const REFS_DIR = path.join(__dirname, "output/references/Common");
const OUT_DIR  = path.join(__dirname, "output/cards/Common");
const MEMBERS  = JSON.parse(fs.readFileSync(path.join(__dirname, "output/members.json"), "utf8"));

const SLOT   = { x: 681, y: 473, w: 1603, h: 1612 };
const NAME_X = 1000;
const NAME_Y = 2850;
const FONT_SIZE = 110;

const { width: W, height: H } = await sharp(BORDER).metadata();
const bitty = MEMBERS.filter(m => m.role === "Bitty");

console.log(`Compositing ${bitty.length} Bitty members...`);

let ok = 0, skip = 0;

for (const member of bitty) {
  const id = member.id;
  const rawName = member.global_name || member.username;
  const cleaned = rawName
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")   // emojis
    .replace(/[\u{2600}-\u{27BF}]/gu, "")      // misc symbols
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .trim();
  const displayName = cleaned.length >= 2 ? cleaned : member.username;

  // Find avatar file (could be .png or .gif)
  const pngPath = path.join(REFS_DIR, `${id}.png`);
  const gifPath = path.join(REFS_DIR, `${id}.gif`);
  const avatarPath = fs.existsSync(pngPath) ? pngPath : fs.existsSync(gifPath) ? gifPath : null;

  if (!avatarPath) {
    console.log(`  SKIP ${id} — no avatar file`);
    skip++;
    continue;
  }

  const outPath = path.join(OUT_DIR, `${id}.png`);

  try {
    const avatarBuf = await sharp(avatarPath)
      .resize(SLOT.w, SLOT.h, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();

    const nameSvg = Buffer.from(
      `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        <text x="${NAME_X}" y="${NAME_Y}"
          font-family="Arial, sans-serif"
          font-size="${FONT_SIZE}"
          font-weight="bold"
          fill="#1a1a1a">${displayName}</text>
      </svg>`
    );

    const withAvatarBuf = await sharp({
      create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
    })
      .composite([{ input: avatarBuf, left: SLOT.x, top: SLOT.y }])
      .png()
      .toBuffer();

    const compositeBuf = await sharp(withAvatarBuf)
      .composite([
        { input: BORDER,  left: 0, top: 0 },
        { input: nameSvg, left: 0, top: 0 },
      ])
      .png()
      .toBuffer();

    await sharp(compositeBuf).resize(400).png().toFile(outPath);
    console.log(`  ✓ ${id} — ${displayName}`);
    ok++;
  } catch (e) {
    console.log(`  ERR ${id} — ${e.message}`);
    skip++;
  }
}

console.log(`\nDone: ${ok} cards saved to output/cards/Common/  |  ${skip} skipped`);
