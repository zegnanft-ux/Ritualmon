"use client";

import type { CardData } from "@/components/Card";

const KEY = "ritualmon-inventory-v1";

export type InventoryEntry = {
  card: CardData;
  count: number;
  firstPulledAt: number;
  lastPulledAt: number;
};

type Inventory = Record<number, InventoryEntry>;

function load(): Inventory {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Inventory) : {};
  } catch {
    return {};
  }
}

function save(inv: Inventory) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(inv));
}

export function addPulls(cards: CardData[]) {
  const inv = load();
  const now = Date.now();
  for (const c of cards) {
    const existing = inv[c.id];
    if (existing) {
      existing.count += 1;
      existing.lastPulledAt = now;
    } else {
      inv[c.id] = { card: c, count: 1, firstPulledAt: now, lastPulledAt: now };
    }
  }
  save(inv);
}

export function getInventory(): InventoryEntry[] {
  const inv = load();
  return Object.values(inv).sort((a, b) => {
    const tierOrder = { secret: 0, ultramax: 1, legendary: 2, epic: 3, rare: 4, common: 5 } as const;
    const at = tierOrder[a.card.tier];
    const bt = tierOrder[b.card.tier];
    if (at !== bt) return at - bt;
    return a.card.id - b.card.id;
  });
}

export function clearInventory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function seedOwnerCard() {
  const inv = load();
  const existing = inv[80];
  inv[80] = {
    card: {
      id: 80,
      name: "ZegnaEth",
      role: "Secret",
      pfpUrl: "/assets/zegna%20secret.png",
      tier: "secret",
      power: 1000,
      cardImage: "/assets/zegna%20secret.png",
    },
    count: existing?.count ?? 1,
    firstPulledAt: existing?.firstPulledAt ?? Date.now(),
    lastPulledAt: existing?.lastPulledAt ?? Date.now(),
  };
  save(inv);
}
