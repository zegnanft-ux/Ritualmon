import { defineChain } from "viem";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";

export const ritual = defineChain({
  id: 1979,
  name: "Ritual",
  nativeCurrency: { decimals: 18, name: "RITUAL", symbol: "RITUAL" },
  rpcUrls: {
    default: {
      http: ["https://rpc.ritualfoundation.org"],
      webSocket: ["wss://rpc.ritualfoundation.org"],
    },
  },
  blockExplorers: {
    default: { name: "Ritual Explorer", url: "https://explorer.ritualfoundation.org" },
  },
});

export const wagmiConfig = createConfig({
  chains: [ritual],
  connectors: [injected()],
  transports: { [ritual.id]: http() },
  ssr: true,
});
