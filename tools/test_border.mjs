import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BORDER  = path.join(__dirname, "../frontend/public/assets/New bitty border.png");
const AVATAR  = path.join(__dirname, "output/references/Common/1071154031659077734.png");
const OUT     = path.join(__dirname, "output/test_card.png");
const MEMBERS = JSON.parse(fs.readFileSync(path.join(__dirname, "output/members.json"), "utf8"));

// Use first Common member
const member = MEMBERS.find(m => m.tier === "Common");
const displayName = member.global_name || member.username;

// Transparent slot bounds (New bitty border.png)
const SLOT = { x: 681, y: 473, w: 1603, h: 1612 };
const { width: W, height: H } = await sharp(BORDER).metadata();

// Name text position — below slot, after "Name :" label
const NAME_X = 935;
const NAME_Y = 2850;
const FONT_SIZE = 110;

const avatarBuf = await sharp(AVATAR)
  .resize(SLOT.w, SLOT.h, { fit: "cover", position: "centre" })
  .png()
  .toBuffer();

// SVG text overlay for the name
const nameSvg = Buffer.from(`
  <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <text x="${NAME_X}" y="${NAME_Y}"
      font-family="Arial, sans-serif"
      font-size="${FONT_SIZE}"
      font-weight="bold"
      fill="#1a1a1a">${displayName}</text>
  </svg>
`);

const withAvatarBuf = await sharp({
  create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
})
  .composite([{ input: avatarBuf, left: SLOT.x, top: SLOT.y }])
  .png()
  .toBuffer();

const compositeBuf = await sharp(withAvatarBuf)
  .composite([
    { input: BORDER,   left: 0, top: 0 },
    { input: nameSvg,  left: 0, top: 0 },
  ])
  .png()
  .toBuffer();

await sharp(compositeBuf).resize(400).png().toFile(OUT);
console.log(`Done → ${OUT}  |  Name: "${displayName}"`);
