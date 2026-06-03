import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BORDER   = path.join(__dirname, "../frontend/public/assets/Ritty border 1.png");
const REFS_DIR = path.join(__dirname, "output/references/Common");
const OUT_DIR  = path.join(__dirname, "output/cards/Rare");
const MEMBERS  = JSON.parse(fs.readFileSync(path.join(__dirname, "output/members.json"), "utf8"));

const SLOT     = { x: 681, y: 473, w: 1603, h: 1612 };
const NAME_X   = 1200;
const NAME_Y   = 2850;
const FONT_SIZE = 110;

const { width: W, height: H } = await sharp(BORDER).metadata();
const ritty = MEMBERS.filter(m => m.role === "Ritty");

console.log(`Compositing ${ritty.length} Ritty members...`);

let ok = 0, skip = 0;

for (const member of ritty) {
  const id = member.id;
  const rawName = member.global_name || member.username;
  const cleaned = rawName
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .trim();
  const displayName = cleaned.length >= 2 ? cleaned : member.username;

  const pngPath = path.join(REFS_DIR, `${id}.png`);
  const gifPath = path.join(REFS_DIR, `${id}.gif`);
  const avatarPath = fs.existsSync(pngPath) ? pngPath : fs.existsSync(gifPath) ? gifPath : null;

  if (!avatarPath) { console.log(`  SKIP ${id} — no avatar`); skip++; continue; }

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

console.log(`\nDone: ${ok} cards saved to output/cards/Rare/  |  ${skip} skipped`);

// Auto-copy to frontend/public
const PUB_DIR = path.join(__dirname, "../frontend/public/cards/Rare");
fs.mkdirSync(PUB_DIR, { recursive: true });
for (const file of fs.readdirSync(OUT_DIR)) {
  fs.copyFileSync(path.join(OUT_DIR, file), path.join(PUB_DIR, file));
}
console.log(`Copied to frontend/public/cards/Rare/`);
