export const GACHA_ADDRESS = "0x126ce9F1599f2667A4ff3E0EaACcc4c363343fd1" as const;

export const GACHA_ABI = [
  {
    type: "function",
    name: "pull",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export const PULL_COST = BigInt("100000000000000"); // 0.0001 RITUAL in wei
