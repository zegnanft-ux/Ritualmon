import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IDS_FILE = join(__dirname, 'ids.txt');
const ENV_FILE = join(__dirname, '.env');
const OUT_DIR = join(__dirname, 'output');
const REF_DIR = join(OUT_DIR, 'references');
const MEMBERS_JSON = join(OUT_DIR, 'members.json');

const DISCORD_API = 'https://discord.com/api/v10';
const DELAY_MS = 250;
const REQUEST_TIMEOUT_MS = 15000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithTimeout(url, init = {}, ms = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

async function loadToken() {
  if (process.env.DISCORD_BOT_TOKEN) return process.env.DISCORD_BOT_TOKEN;
  if (!existsSync(ENV_FILE)) {
    throw new Error(`No DISCORD_BOT_TOKEN env var and no ${ENV_FILE} found.`);
  }
  const env = await readFile(ENV_FILE, 'utf8');
  const match = env.match(/^DISCORD_BOT_TOKEN=(.+)$/m);
  if (!match) throw new Error('DISCORD_BOT_TOKEN= not found in tools/.env');
  return match[1].trim().replace(/^["']|["']$/g, '');
}

const TIER_MAP = {
  'Foundation Team': 'Legendary',
  'Foundation Team and mods': 'Legendary',
  'Mods': 'Legendary',
  'Zealot': 'Epic',
  'Zealot/ Radiant Ritualist': 'Epic',
  'Ritualists': 'Rare',
  'Ritty': 'Common',
  'Bitty': 'Common',
};

function mapRoleToTier(roleName) {
  if (!roleName) return 'Unsorted';
  const key = Object.keys(TIER_MAP).find(
    (k) => k.toLowerCase() === roleName.toLowerCase(),
  );
  return key ? TIER_MAP[key] : 'Unsorted';
}

async function loadIds() {
  const raw = await readFile(IDS_FILE, 'utf8');
  const entries = [];
  const seen = new Set();
  let currentRole = null;
  for (const [lineNum, line] of raw.split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const m = trimmed.match(/^(\d{17,20})\s*(?:#\s*)?(.*)$/);
    if (m) {
      const id = m[1];
      if (seen.has(id)) {
        console.warn(`Duplicate ID ${id} at line ${lineNum + 1}, skipping`);
        continue;
      }
      seen.add(id);
      entries.push({
        id,
        note: m[2].trim() || null,
        role: currentRole,
        tier: mapRoleToTier(currentRole),
      });
    } else {
      currentRole = trimmed;
    }
  }
  return entries;
}

function avatarUrl(user) {
  if (user.avatar) {
    const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=512`;
  }
  const idx = Number((BigInt(user.id) >> 22n) % 6n);
  return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
}

async function fetchUser(id, token) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetchWithTimeout(`${DISCORD_API}/users/${id}`, {
      headers: { Authorization: `Bot ${token}` },
    });
    if (res.status === 429) {
      const retry = Number(res.headers.get('retry-after') ?? '1');
      console.warn(`  Rate limited, sleeping ${retry}s...`);
      await sleep(retry * 1000);
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HTTP ${res.status} for ${id}: ${body}`);
    }
    return await res.json();
  }
  throw new Error(`Gave up on ${id} after rate-limit retries`);
}

async function downloadAvatar(url, destPath) {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Avatar fetch ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
}

async function loadExistingMembers() {
  if (!existsSync(MEMBERS_JSON)) return new Map();
  try {
    const raw = await readFile(MEMBERS_JSON, 'utf8');
    const arr = JSON.parse(raw);
    return new Map(arr.map((m) => [m.id, m]));
  } catch {
    return new Map();
  }
}

function existingAvatarFor(id, tier) {
  for (const ext of ['png', 'gif']) {
    const p = join(REF_DIR, tier, `${id}.${ext}`);
    if (existsSync(p)) return { path: p, ext };
  }
  return null;
}

async function main() {
  const token = await loadToken();
  const entries = await loadIds();
  if (entries.length === 0) {
    console.log('No IDs in ids.txt. Add some and re-run.');
    return;
  }

  const existingMembers = await loadExistingMembers();
  console.log(`Processing ${entries.length} members (${existingMembers.size} already cached)...`);

  await mkdir(REF_DIR, { recursive: true });

  const results = [];
  const failures = [];
  const tierCounts = {};
  let skipped = 0;

  for (const [i, { id, note, role, tier }] of entries.entries()) {
    const label = note ? ` (${note})` : '';
    const existing = existingAvatarFor(id, tier);
    const cachedEntry = existingMembers.get(id);
    if (existing && cachedEntry) {
      results.push({ ...cachedEntry, role, tier, note });
      tierCounts[tier] = (tierCounts[tier] ?? 0) + 1;
      skipped++;
      continue;
    }
    process.stdout.write(`[${i + 1}/${entries.length}] ${tier.padEnd(9)} ${id}${label} ... `);
    let user, url, ext, filePath, lastErr;
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        user = await fetchUser(id, token);
        url = avatarUrl(user);
        ext = url.includes('.gif') ? 'gif' : 'png';
        const tierDir = join(REF_DIR, tier);
        await mkdir(tierDir, { recursive: true });
        filePath = join(tierDir, `${id}.${ext}`);
        await downloadAvatar(url, filePath);
        success = true;
        break;
      } catch (err) {
        lastErr = err;
        if (attempt < 3) {
          process.stdout.write(`(retry ${attempt}) `);
          await sleep(2000 * attempt);
        }
      }
    }
    if (success) {
      results.push({
        id: user.id,
        username: user.username,
        global_name: user.global_name ?? null,
        avatar_hash: user.avatar,
        avatar_url: url,
        local_file: `references/${tier}/${id}.${ext}`,
        role,
        tier,
        note,
      });
      tierCounts[tier] = (tierCounts[tier] ?? 0) + 1;
      console.log(`OK (${user.global_name || user.username})`);
    } else {
      failures.push({ id, note, role, tier, error: lastErr.message });
      console.log(`FAIL — ${lastErr.message}`);
    }
    await sleep(DELAY_MS);
  }

  await writeFile(MEMBERS_JSON, JSON.stringify(results, null, 2));
  console.log(`\nSaved ${results.length} → ${MEMBERS_JSON}`);
  console.log(`Avatars → ${REF_DIR}`);
  console.log(`Skipped ${skipped} already-cached.`);
  console.log('\nTier breakdown:');
  for (const [tier, count] of Object.entries(tierCounts)) {
    console.log(`  ${tier.padEnd(10)} ${count}`);
  }
  if (failures.length) {
    console.log(`\n${failures.length} failures:`);
    for (const f of failures) console.log(`  ${f.id} (${f.tier}) — ${f.error}`);
  }
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
