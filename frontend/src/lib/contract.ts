export const GACHA_ADDRESS = "0x3b6d884e89e37511e1e3b3ec574b3109fdd69b16" as const;

export const GACHA_ABI = [
  {
    type: "function",
    name: "commitPull",
    inputs: [],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "revealPull",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
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
