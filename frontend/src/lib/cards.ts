import type { CardData, CardTier } from "@/components/Card";

export const CARD_POOL: CardData[] = [
  // ── Common (Bitty) — real cards ──
  { id: 1,  name: "! callmehannn",            role: "Bitty", tier: "common", power: 38, pfpUrl: "/cards/Common/891547761177137202.png",  cardImage: "/cards/Common/891547761177137202.png" },
  { id: 2,  name: "! piktawr",                role: "Bitty", tier: "common", power: 46, pfpUrl: "/cards/Common/470546929961533449.png",  cardImage: "/cards/Common/470546929961533449.png" },
  { id: 3,  name: "! Tha",                    role: "Bitty", tier: "common", power: 56, pfpUrl: "/cards/Common/556454529676345344.png",  cardImage: "/cards/Common/556454529676345344.png" },
  { id: 4,  name: "ArokMub",                  role: "Ritty", tier: "rare",   power: 50, pfpUrl: "/cards/Rare/769192900072046602.png",  cardImage: "/cards/Rare/769192900072046602.png" },
  { id: 5,  name: "Babysyen",                 role: "Bitty", tier: "common", power: 56, pfpUrl: "/cards/Common/932955105710440468.png",  cardImage: "/cards/Common/932955105710440468.png" },
  { id: 6,  name: "Baster",                   role: "Ritty", tier: "rare",   power: 38, pfpUrl: "/cards/Rare/1071154031659077734.png", cardImage: "/cards/Rare/1071154031659077734.png" },
  { id: 7,  name: "big",                      role: "Bitty", tier: "common", power: 50, pfpUrl: "/cards/Common/1156261460649967636.png", cardImage: "/cards/Common/1156261460649967636.png" },
  { id: 8,  name: "Laysraymond",              role: "Bitty", tier: "common", power: 35, pfpUrl: "/cards/Common/1278547239601704961.png", cardImage: "/cards/Common/1278547239601704961.png" },
  { id: 9,  name: "Lolod",                    role: "Bitty", tier: "common", power: 51, pfpUrl: "/cards/Common/695617891336192073.png",  cardImage: "/cards/Common/695617891336192073.png" },
  { id: 10, name: "NyankoSensei",             role: "Bitty", tier: "common", power: 55, pfpUrl: "/cards/Common/377783584603504650.png",  cardImage: "/cards/Common/377783584603504650.png" },
  { id: 11, name: "Zebaoth",                  role: "Bitty", tier: "common", power: 55, pfpUrl: "/cards/Common/721725392632807504.png",  cardImage: "/cards/Common/721725392632807504.png" },
  { id: 12, name: "Fenrir Aniki",             role: "Bitty", tier: "common", power: 47, pfpUrl: "/cards/Common/477457097504587802.png",  cardImage: "/cards/Common/477457097504587802.png" },
  { id: 13, name: "Oshee",                    role: "Bitty", tier: "common", power: 36, pfpUrl: "/cards/Common/1340371203914989579.png", cardImage: "/cards/Common/1340371203914989579.png" },
  { id: 14, name: "Kreko",                    role: "Ritty", tier: "rare",   power: 59, pfpUrl: "/cards/Rare/1380516191679811596.png", cardImage: "/cards/Rare/1380516191679811596.png" },
  { id: 15, name: "kenann",                   role: "Bitty", tier: "common", power: 50, pfpUrl: "/cards/Common/745827029215084556.png",  cardImage: "/cards/Common/745827029215084556.png" },
  { id: 16, name: "Skylaaarrrkkk",            role: "Bitty", tier: "common", power: 40, pfpUrl: "/cards/Common/1144930850765545592.png", cardImage: "/cards/Common/1144930850765545592.png" },
  { id: 17, name: "Cheaster Antariksa",       role: "Bitty", tier: "common", power: 40, pfpUrl: "/cards/Common/515873946726432770.png",  cardImage: "/cards/Common/515873946726432770.png" },
  { id: 18, name: "Firless",                  role: "Bitty", tier: "common", power: 58, pfpUrl: "/cards/Common/940237096373858355.png",  cardImage: "/cards/Common/940237096373858355.png" },
  { id: 19, name: "Rz | SpideMUM",            role: "Bitty", tier: "common", power: 59, pfpUrl: "/cards/Common/725326070101835836.png",  cardImage: "/cards/Common/725326070101835836.png" },
  { id: 20, name: "Ares",                     role: "Ritty", tier: "rare",   power: 50, pfpUrl: "/cards/Rare/1137790107169075280.png", cardImage: "/cards/Rare/1137790107169075280.png" },
  { id: 21, name: "Heat | Web3",              role: "Bitty", tier: "common", power: 53, pfpUrl: "/cards/Common/743031011234807848.png",  cardImage: "/cards/Common/743031011234807848.png" },
  { id: 22, name: "yetece",                   role: "Bitty", tier: "common", power: 44, pfpUrl: "/cards/Common/761513640498954250.png",  cardImage: "/cards/Common/761513640498954250.png" },
  { id: 23, name: "FLAKKYYYY",                role: "Bitty", tier: "common", power: 59, pfpUrl: "/cards/Common/1200464545244790835.png", cardImage: "/cards/Common/1200464545244790835.png" },
  { id: 83, name: "celineboo",               role: "Bitty", tier: "common", power: 45, pfpUrl: "/cards/Common/895546410261438476.png",  cardImage: "/cards/Common/895546410261438476.png" },
  { id: 84, name: "rikkydwiyanto",           role: "Bitty", tier: "common", power: 42, pfpUrl: "/cards/Common/894858320584785920.png",  cardImage: "/cards/Common/894858320584785920.png" },
  { id: 85, name: "jeya",                    role: "Bitty", tier: "common", power: 48, pfpUrl: "/cards/Common/983980663243935815.png",  cardImage: "/cards/Common/983980663243935815.png" },

  // ── Rare (Ritty) — real cards ──
  { id: 24, name: "HAMAD", role: "Ritty", tier: "rare" as const, power: 86, pfpUrl: "/cards/Rare/1321487714301776007.png", cardImage: "/cards/Rare/1321487714301776007.png" },
  { id: 25, name: "Babasss", role: "Ritty", tier: "rare" as const, power: 77, pfpUrl: "/cards/Rare/703651750728564777.png", cardImage: "/cards/Rare/703651750728564777.png" },
  { id: 26, name: "Decka-tan", role: "Ritty", tier: "rare" as const, power: 79, pfpUrl: "/cards/Rare/392321900577161219.png", cardImage: "/cards/Rare/392321900577161219.png" },
  { id: 27, name: "Mexyy", role: "Ritty", tier: "rare" as const, power: 72, pfpUrl: "/cards/Rare/371895833647644683.png", cardImage: "/cards/Rare/371895833647644683.png" },
  { id: 28, name: "KYY", role: "Ritty", tier: "rare" as const, power: 89, pfpUrl: "/cards/Rare/933027466413486130.png", cardImage: "/cards/Rare/933027466413486130.png" },
  { id: 29, name: "Lunabean", role: "Ritty", tier: "rare" as const, power: 66, pfpUrl: "/cards/Rare/1312410379279929349.png", cardImage: "/cards/Rare/1312410379279929349.png" },
  { id: 30, name: "Techies", role: "Ritty", tier: "rare" as const, power: 77, pfpUrl: "/cards/Rare/694379156175192145.png", cardImage: "/cards/Rare/694379156175192145.png" },
  { id: 31, name: "STAR KNIGHT", role: "Ritty", tier: "rare" as const, power: 75, pfpUrl: "/cards/Rare/1320740897557577748.png", cardImage: "/cards/Rare/1320740897557577748.png" },
  { id: 32, name: "Kippo.G", role: "Ritty", tier: "rare" as const, power: 62, pfpUrl: "/cards/Rare/757232685042368553.png", cardImage: "/cards/Rare/757232685042368553.png" },
  { id: 33, name: "J a e", role: "Ritty", tier: "rare" as const, power: 62, pfpUrl: "/cards/Rare/866598293180907531.png", cardImage: "/cards/Rare/866598293180907531.png" },
  { id: 34, name: "Batagor", role: "Ritty", tier: "rare" as const, power: 74, pfpUrl: "/cards/Rare/802158561248935967.png", cardImage: "/cards/Rare/802158561248935967.png" },
  { id: 35, name: "Wyrium", role: "Ritty", tier: "rare" as const, power: 87, pfpUrl: "/cards/Rare/1244205446110253159.png", cardImage: "/cards/Rare/1244205446110253159.png" },
  { id: 36, name: "nostalgiagila", role: "Ritty", tier: "rare" as const, power: 64, pfpUrl: "/cards/Rare/889467897787858974.png", cardImage: "/cards/Rare/889467897787858974.png" },
  { id: 37, name: "online", role: "Ritty", tier: "rare" as const, power: 60, pfpUrl: "/cards/Rare/917275641441816607.png", cardImage: "/cards/Rare/917275641441816607.png" },
  { id: 38, name: "oahid", role: "Ritty", tier: "rare" as const, power: 76, pfpUrl: "/cards/Rare/1101776572127645819.png", cardImage: "/cards/Rare/1101776572127645819.png" },
  { id: 39, name: "CorleoneOnChain", role: "Ritty", tier: "rare" as const, power: 88, pfpUrl: "/cards/Rare/839533270383460413.png", cardImage: "/cards/Rare/839533270383460413.png" },
  { id: 40, name: "Oscar", role: "Ritty", tier: "rare" as const, power: 76, pfpUrl: "/cards/Rare/933970100669788211.png", cardImage: "/cards/Rare/933970100669788211.png" },
  { id: 41, name: "tutubear", role: "Ritualists", tier: "epic" as const, power: 63, pfpUrl: "/cards/Epic/906225436013527040.png", cardImage: "/cards/Epic/906225436013527040.png" },
  { id: 42, name: "0xAetherion", role: "Ritty", tier: "rare" as const, power: 66, pfpUrl: "/cards/Rare/923690297475612712.png", cardImage: "/cards/Rare/923690297475612712.png" },
  { id: 43, name: "ASCENO", role: "Ritty", tier: "rare" as const, power: 72, pfpUrl: "/cards/Rare/452868566140715008.png", cardImage: "/cards/Rare/452868566140715008.png" },
  { id: 44, name: "ITACHI", role: "Ritty", tier: "rare" as const, power: 89, pfpUrl: "/cards/Rare/958802281099300937.png", cardImage: "/cards/Rare/958802281099300937.png" },
  { id: 45, name: "JACKOBEE", role: "Ritty", tier: "rare" as const, power: 62, pfpUrl: "/cards/Rare/783327030665936917.png", cardImage: "/cards/Rare/783327030665936917.png" },
  { id: 46, name: "Bademenn", role: "Ritty", tier: "rare" as const, power: 64, pfpUrl: "/cards/Rare/519569547846746127.png", cardImage: "/cards/Rare/519569547846746127.png" },
  { id: 47, name: "coffeedegen", role: "Ritty", tier: "rare" as const, power: 69, pfpUrl: "/cards/Rare/326594134498607134.png", cardImage: "/cards/Rare/326594134498607134.png" },
  { id: 48, name: "MAD | Ritual Grandad", role: "Ritty", tier: "rare" as const, power: 89, pfpUrl: "/cards/Rare/1121612266387820665.png", cardImage: "/cards/Rare/1121612266387820665.png" },
  { id: 49, name: "Rohit", role: "Ritty", tier: "rare" as const, power: 75, pfpUrl: "/cards/Rare/1256149930880405597.png", cardImage: "/cards/Rare/1256149930880405597.png" },
  { id: 50, name: "mici", role: "Ritty", tier: "rare" as const, power: 85, pfpUrl: "/cards/Rare/1338012162991460366.png", cardImage: "/cards/Rare/1338012162991460366.png" },
  { id: 51, name: "hazelll", role: "Ritty", tier: "rare" as const, power: 87, pfpUrl: "/cards/Rare/1337878043418431648.png", cardImage: "/cards/Rare/1337878043418431648.png" },

  // ── Epic (Ritualists) — real cards ──
  { id: 52, name: "rizan", role: "Ritualists", tier: "epic" as const, power: 120, pfpUrl: "/cards/Epic/381617792329187328.png", cardImage: "/cards/Epic/381617792329187328.png" },
  { id: 53, name: "Evo Yudha Samael", role: "Ritualists", tier: "epic" as const, power: 121, pfpUrl: "/cards/Epic/614072664344100884.png", cardImage: "/cards/Epic/614072664344100884.png" },
  { id: 54, name: "Jepannyaa Risolmayo", role: "Ritualists", tier: "epic" as const, power: 128, pfpUrl: "/cards/Epic/1318402539280011264.png", cardImage: "/cards/Epic/1318402539280011264.png" },
  { id: 55, name: "Intuition", role: "Ritualists", tier: "epic" as const, power: 113, pfpUrl: "/cards/Epic/1290138749568811105.png", cardImage: "/cards/Epic/1290138749568811105.png" },
  { id: 56, name: "Maharshi", role: "Ritualists", tier: "epic" as const, power: 133, pfpUrl: "/cards/Epic/1291644550317871134.png", cardImage: "/cards/Epic/1291644550317871134.png" },
  { id: 57, name: "john mouse (,)", role: "Ritualists", tier: "epic" as const, power: 131, pfpUrl: "/cards/Epic/436734801798627340.png", cardImage: "/cards/Epic/436734801798627340.png" },
  { id: 58, name: "kency", role: "Ritualists", tier: "epic" as const, power: 136, pfpUrl: "/cards/Epic/1032547775851794502.png", cardImage: "/cards/Epic/1032547775851794502.png" },
  { id: 59, name: "Jia", role: "Ritualists", tier: "epic" as const, power: 120, pfpUrl: "/cards/Epic/879601620248297472.png", cardImage: "/cards/Epic/879601620248297472.png" },
  { id: 60, name: "Technik", role: "Ritualists", tier: "epic" as const, power: 123, pfpUrl: "/cards/Epic/512958871631953930.png", cardImage: "/cards/Epic/512958871631953930.png" },
  { id: 61, name: "Daniyel", role: "Ritualists", tier: "epic" as const, power: 131, pfpUrl: "/cards/Epic/903251302098817044.png", cardImage: "/cards/Epic/903251302098817044.png" },
  { id: 62, name: "Dimlak", role: "Ritualists", tier: "epic" as const, power: 125, pfpUrl: "/cards/Epic/809141688483184690.png", cardImage: "/cards/Epic/809141688483184690.png" },
  { id: 63, name: "LLoyD", role: "Ritualists", tier: "epic" as const, power: 123, pfpUrl: "/cards/Epic/381303199338070021.png", cardImage: "/cards/Epic/381303199338070021.png" },
  { id: 64, name: "1DLE (,)", role: "Ritualists", tier: "epic" as const, power: 132, pfpUrl: "/cards/Epic/959940345876078632.png", cardImage: "/cards/Epic/959940345876078632.png" },
  { id: 65, name: "Oluwasegun", role: "Ritualists", tier: "epic" as const, power: 133, pfpUrl: "/cards/Epic/1132658874235760742.png", cardImage: "/cards/Epic/1132658874235760742.png" },

  // ── Legendary (Zealot) — real cards ──
  { id: 66, name: "Eric", role: "Zealot", tier: "legendary" as const, power: 188, pfpUrl: "/cards/Legendary/1119985478997901353.png", cardImage: "/cards/Legendary/1119985478997901353.png" },
  { id: 67, name: "Saintlee", role: "Zealot", tier: "legendary" as const, power: 191, pfpUrl: "/cards/Legendary/834011325516218398.png", cardImage: "/cards/Legendary/834011325516218398.png" },
  { id: 68, name: "havelaw", role: "Zealot", tier: "legendary" as const, power: 183, pfpUrl: "/cards/Legendary/894526792981946389.png", cardImage: "/cards/Legendary/894526792981946389.png" },
  { id: 69, name: "G9D運()", role: "Zealot", tier: "legendary" as const, power: 191, pfpUrl: "/cards/Legendary/1142975688232669317.png", cardImage: "/cards/Legendary/1142975688232669317.png" },
  { id: 70, name: "Meison", role: "Zealot", tier: "legendary" as const, power: 190, pfpUrl: "/cards/Legendary/858445151784796190.png", cardImage: "/cards/Legendary/858445151784796190.png" },
  { id: 71, name: "Thomas (,)", role: "Zealot", tier: "legendary" as const, power: 196, pfpUrl: "/cards/Legendary/297078811210809345.png", cardImage: "/cards/Legendary/297078811210809345.png" },
  { id: 72, name: "UCANSEE", role: "Zealot", tier: "legendary" as const, power: 192, pfpUrl: "/cards/Legendary/921892700029059143.png", cardImage: "/cards/Legendary/921892700029059143.png" },

  // ── UltraMax (Team / Mods) — real cards ──
  { id: 73, name: "Josh | Ritual", role: "Foundation Team", tier: "ultramax" as const, power: 995, pfpUrl: "/cards/UltraMax/1211782420643455047.png", cardImage: "/cards/UltraMax/1211782420643455047.png" },
  { id: 74, name: "VΛL ΛLΞXΛNDΞR", role: "Foundation Team", tier: "ultramax" as const, power: 997, pfpUrl: "/cards/UltraMax/425331643352481804.png", cardImage: "/cards/UltraMax/425331643352481804.png" },
  { id: 75, name: "Dunken | Ritual", role: "Mods", tier: "ultramax" as const, power: 990, pfpUrl: "/cards/UltraMax/865484982108684309.png", cardImage: "/cards/UltraMax/865484982108684309.png" },
  { id: 76, name: "Jez | Ritual", role: "Mods", tier: "ultramax" as const, power: 996, pfpUrl: "/cards/UltraMax/812188747767873579.png", cardImage: "/cards/UltraMax/812188747767873579.png" },
  { id: 77, name: "Majorproject | Ritual", role: "Mods", tier: "ultramax" as const, power: 992, pfpUrl: "/cards/UltraMax/285760800260620288.png", cardImage: "/cards/UltraMax/285760800260620288.png" },
  { id: 78, name: "Stefan", role: "Foundation Team", tier: "ultramax" as const, power: 998, pfpUrl: "/cards/UltraMax/761834826533568542.png", cardImage: "/cards/UltraMax/761834826533568542.png" },
  { id: 79, name: "Flash", role: "Foundation Team", tier: "ultramax" as const, power: 999, pfpUrl: "/cards/UltraMax/438334387180797973.png", cardImage: "/cards/UltraMax/438334387180797973.png" },
  { id: 81, name: "Kash", role: "Mods", tier: "ultramax" as const, power: 993, pfpUrl: "/cards/UltraMax/1294426205193371680.png", cardImage: "/cards/UltraMax/1294426205193371680.png" },
  { id: 82, name: "Hinata", role: "Mods", tier: "ultramax" as const, power: 991, pfpUrl: "/cards/UltraMax/1192333998245023784.png", cardImage: "/cards/UltraMax/1192333998245023784.png" },
  { id: 80, name: "ZegnaEth", role: "Secret", tier: "secret" as const, power: 1000, pfpUrl: "/assets/zegna%20secret.png", cardImage: "/assets/zegna%20secret.png" },
];

export type PackType = "single" | "small" | "big";

export const DROP_RATES: Record<CardTier, number> = {
  common:    0.50,
  rare:      0.33,
  epic:      0.08,
  legendary: 0.05,
  ultramax:  0.025,
  secret:    0.015,
};

export const PACK_CONFIG: Record<PackType, {
  label: string;
  cardCount: number;
  rates: Record<CardTier, number>;
}> = {
  single: {
    label: "Single Pull",
    cardCount: 6,
    rates: DROP_RATES,
  },
  small: {
    label: "Small Pack",
    cardCount: 5,
    rates: DROP_RATES,
  },
  big: {
    label: "Big Pack",
    cardCount: 7,
    rates: DROP_RATES,
  },
};

const TIERS: CardTier[] = ["common", "rare", "epic", "legendary", "ultramax", "secret"];

function pickTier(rates: Record<CardTier, number>): CardTier {
  const r = Math.random();
  let cumulative = 0;
  for (const tier of TIERS) {
    cumulative += rates[tier];
    if (r < cumulative) return tier;
  }
  return "common";
}

function pickFromTier(tier: CardTier): CardData {
  const candidates = CARD_POOL.filter((c) => c.tier === tier);
  if (candidates.length === 0) {
    return CARD_POOL.filter((c) => c.tier === "common")[0];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function drawPack(type: PackType): CardData[] {
  const { cardCount, rates } = PACK_CONFIG[type];
  const cards: CardData[] = [];
  for (let i = 0; i < cardCount; i++) {
    const tier = pickTier(rates);
    cards.push(pickFromTier(tier));
  }
  return cards;
}
