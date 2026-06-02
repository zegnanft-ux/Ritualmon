import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMBERS = JSON.parse(fs.readFileSync(path.join(__dirname, "output/members.json"), "utf8"));

async function compose({ ids, border, refsDir, outDir, pubDir, slot, nameX, nameY, fontSize = 110 }) {
  const borderPath = path.join(__dirname, border);
  const { width: W, height: H } = await sharp(borderPath).metadata();
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(pubDir, { recursive: true });

  let ok = 0, skip = 0;
  for (const id of ids) {
    const member = MEMBERS.find(m => m.id === id);
    if (!member) { console.log(`  SKIP ${id} — not in members.json`); skip++; continue; }

    const rawName = member.global_name || member.username;
    const cleaned = rawName
      .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
      .replace(/[\u{2600}-\u{27BF}]/gu, "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .trim();
    const displayName = cleaned.length >= 2 ? cleaned : member.username;

    const pngPath = path.join(refsDir, `${id}.png`);
    const gifPath = path.join(refsDir, `${id}.gif`);
    const avatarPath = fs.existsSync(pngPath) ? pngPath : fs.existsSync(gifPath) ? gifPath : null;
    if (!avatarPath) { console.log(`  SKIP ${id} — no avatar`); skip++; continue; }

    try {
      const avatarBuf = await sharp(avatarPath)
        .resize(slot.w, slot.h, { fit: "cover", position: "centre" })
        .png().toBuffer();

      const nameSvg = Buffer.from(
        `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
          <text x="${nameX}" y="${nameY}" font-family="Arial, sans-serif"
            font-size="${fontSize}" font-weight="bold" fill="#1a1a1a">${displayName}</text>
        </svg>`
      );

      const withAvatarBuf = await sharp({
        create: { width: W, height: H, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
      }).composite([{ input: avatarBuf, left: slot.x, top: slot.y }]).png().toBuffer();

      const compositeBuf = await sharp(withAvatarBuf)
        .composite([{ input: borderPath, left: 0, top: 0 }, { input: nameSvg, left: 0, top: 0 }])
        .png().toBuffer();

      const outPath = path.join(outDir, `${id}.png`);
      await sharp(compositeBuf).resize(400).png().toFile(outPath);
      fs.copyFileSync(outPath, path.join(pubDir, `${id}.png`));
      console.log(`  ✓ ${id} — ${displayName}`);
      ok++;
    } catch (e) {
      console.log(`  ERR ${id} — ${e.message}`);
      skip++;
    }
  }
  console.log(`Done: ${ok} saved | ${skip} skipped\n`);
}

// ── New Bitty members ──
console.log("=== Bitty ===");
await compose({
  ids: ["895546410261438476", "894858320584785920", "983980663243935815"],
  border: "../frontend/public/assets/New bitty border.png",
  refsDir: path.join(__dirname, "output/references/Common"),
  outDir:  path.join(__dirname, "output/cards/Common"),
  pubDir:  path.join(__dirname, "../frontend/public/cards/Common"),
  slot:    { x: 681, y: 473, w: 1603, h: 1612 },
  nameX: 1000, nameY: 2850,
});

// ── Promoted to Ritty (recompose with Ritty border) ──
console.log("=== Promoted to Ritty ===");
await compose({
  ids: ["769192900072046602", "1071154031659077734", "1380516191679811596", "1137790107169075280"],
  border: "../frontend/public/assets/Ritty border 1.png",
  refsDir: path.join(__dirname, "output/references/Common"),
  outDir:  path.join(__dirname, "output/cards/Rare"),
  pubDir:  path.join(__dirname, "../frontend/public/cards/Rare"),
  slot:    { x: 681, y: 473, w: 1603, h: 1612 },
  nameX: 1200, nameY: 2850,
});

// ── Promoted to Ritualist (recompose with Ritualist border) ──
console.log("=== Promoted to Ritualist ===");
await compose({
  ids: ["906225436013527040"],
  border: "../frontend/public/assets/Ritualist border.png",
  refsDir: path.join(__dirname, "output/references/Common"),
  outDir:  path.join(__dirname, "output/cards/Epic"),
  pubDir:  path.join(__dirname, "../frontend/public/cards/Epic"),
  slot:    { x: 681, y: 473, w: 1603, h: 1612 },
  nameX: 1200, nameY: 2850,
});
