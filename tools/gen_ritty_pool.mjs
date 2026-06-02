import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const members = JSON.parse(fs.readFileSync(path.join(__dirname, "output/members.json"), "utf8"));
const ritty = members.filter(m => m.role === "ritty");
ritty.forEach((m, i) => {
  const raw = (m.global_name || m.username)
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/"/g, "")
    .trim();
  const name = raw.length >= 2 ? raw : m.username;
  const power = Math.floor(Math.random() * 30) + 60;
  console.log(`  { id: ${24+i}, name: "${name}", role: "Ritty", tier: "rare" as const, power: ${power}, pfpUrl: "/cards/Rare/${m.id}.png", cardImage: "/cards/Rare/${m.id}.png" },`);
});
