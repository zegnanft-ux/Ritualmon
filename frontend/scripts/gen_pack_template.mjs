import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public/assets/pack-template.png");

const W = 700;
const H = 932;

let seed = 17;
const rand = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

const liningColors = ["#5BB04F", "#2E7D32", "#9CCC65"];
const crayonColors = [
  "#FFB347",
  "#FF6B6B",
  "#5BA8E8",
  "#D77BD0",
  "#7DD87A",
  "#F4D35E",
  "#9B6BFF",
];

const inLogoZone = (x, y) => {
  const wm = x > 30 && x < W - 30 && y > 110 && y < 400;
  const kn = x > 70 && x < W - 70 && y > 450 && y < 720;
  return wm || kn;
};

const f = (n) => n.toFixed(1);

function wavyPath(x1, y1, x2, y2, jitter) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const steps = Math.max(20, Math.floor(len / 12));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    const j = (rand() - 0.5) * jitter;
    d += (i === 0 ? "M" : "L") + f(x + nx * j) + "," + f(y + ny * j) + " ";
  }
  return d;
}

function starPath(x, y, r) {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    d += (i === 0 ? "M" : "L") + f(x + Math.cos(a) * rr) + "," + f(y + Math.sin(a) * rr) + " ";
  }
  return d + "Z";
}

function heartPath(x, y, s) {
  return `M${f(x)},${f(y + s * 0.5)} C${f(x - s * 1.1)},${f(y - s * 0.4)} ${f(x - s * 0.5)},${f(y - s * 1.1)} ${f(x)},${f(y - s * 0.25)} C${f(x + s * 0.5)},${f(y - s * 1.1)} ${f(x + s * 1.1)},${f(y - s * 0.4)} ${f(x)},${f(y + s * 0.5)} Z`;
}

function boltPath(x, y, s) {
  return `M${f(x)},${f(y - s)} L${f(x - s * 0.55)},${f(y + s * 0.1)} L${f(x - s * 0.05)},${f(y + s * 0.1)} L${f(x - s * 0.35)},${f(y + s)} L${f(x + s * 0.45)},${f(y - s * 0.15)} L${f(x - s * 0.05)},${f(y - s * 0.15)} Z`;
}

function spiralPath(x, y, r) {
  let d = "";
  for (let i = 0; i < 30; i++) {
    const t = i / 30;
    const a = t * Math.PI * 4;
    const rr = r * t;
    d += (i === 0 ? "M" : "L") + f(x + Math.cos(a) * rr) + "," + f(y + Math.sin(a) * rr) + " ";
  }
  return d;
}

function scribblePath(x, y, r) {
  let d = "";
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rand() * 0.4;
    const rr = r * (0.55 + rand() * 0.6);
    d += (i === 0 ? "M" : "L") + f(x + Math.cos(a) * rr) + "," + f(y + Math.sin(a) * rr) + " ";
  }
  return d + "Z";
}

const parts = [];
const defs = [];

parts.push(`<rect width="${W}" height="${H}" fill="#FBFBF5"/>`);

const cornerR = Math.min(W, H) * 0.55;
const corners = [
  [0, 0],
  [W, 0],
  [0, H],
  [W, H],
];
corners.forEach(([cx, cy], i) => {
  defs.push(
    `<radialGradient id="g${i}" cx="${cx}" cy="${cy}" r="${cornerR}" gradientUnits="userSpaceOnUse">` +
      `<stop offset="0%" stop-color="rgb(140,230,150)" stop-opacity="0.7"/>` +
      `<stop offset="45%" stop-color="rgb(170,240,175)" stop-opacity="0.3"/>` +
      `<stop offset="100%" stop-color="rgb(180,240,180)" stop-opacity="0"/>` +
      `</radialGradient>`,
  );
  parts.push(`<rect width="${W}" height="${H}" fill="url(#g${i})"/>`);
});

for (let pass = 0; pass < 3; pass++) {
  const inset = 18 + pass * 4;
  const color = liningColors[pass];
  const lw = 3 - pass * 0.6;
  const jit = 3 + pass;
  const sides = [
    [inset, inset, W - inset, inset],
    [W - inset, inset, W - inset, H - inset],
    [W - inset, H - inset, inset, H - inset],
    [inset, H - inset, inset, inset],
  ];
  for (const [x1, y1, x2, y2] of sides) {
    parts.push(
      `<path d="${wavyPath(x1, y1, x2, y2, jit)}" stroke="${color}" stroke-width="${lw}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    );
  }
}

let placed = 0;
let attempts = 0;
while (placed < 36 && attempts < 250) {
  attempts++;
  const x = 35 + rand() * (W - 70);
  const y = 35 + rand() * (H - 70);
  if (inLogoZone(x, y)) continue;
  const color = crayonColors[Math.floor(rand() * crayonColors.length)];
  const r = 7 + rand() * 7;
  const t = Math.floor(rand() * 5);
  if (t === 0) {
    parts.push(`<path d="${starPath(x, y, r)}" fill="${color}" stroke="#2c2c2c" stroke-width="1.2"/>`);
  } else if (t === 1) {
    parts.push(`<path d="${heartPath(x, y, r * 0.7)}" fill="${color}" stroke="#2c2c2c" stroke-width="1.2"/>`);
  } else if (t === 2) {
    parts.push(`<path d="${boltPath(x, y, r * 0.9)}" fill="${color}" stroke="#2c2c2c" stroke-width="1.2"/>`);
  } else if (t === 3) {
    parts.push(`<path d="${spiralPath(x, y, r)}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`);
  } else {
    parts.push(`<path d="${scribblePath(x, y, r)}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>`);
  }
  placed++;
}

for (let i = 0; i < 40; i++) {
  const x = rand() * W;
  const y = rand() * H;
  if (inLogoZone(x, y)) continue;
  const r = 1.2 + rand() * 1.2;
  parts.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="rgb(60,60,60)" fill-opacity="0.5"/>`);
}

const svg =
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">` +
  `<defs>${defs.join("")}</defs>` +
  parts.join("") +
  `</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`wrote ${OUT}  (${W}x${H})`);
