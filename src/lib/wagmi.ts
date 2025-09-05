import { createConfig, http } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http(),
  },
  connectors: [
    farcasterFrame(),
    coinbaseWallet({
      appName: 'ArbiRun',
      appLogoUrl: 'https://arbirush.vercel.app/icon.png',
      preference: "all",
    }),
    metaMask({
      dappMetadata: {
        name: 'ArbiRun',
        url: 'https://arbirush.vercel.app',
        iconUrl: 'https://arbirush.vercel.app/icon.png',
      },
    }),
  ],
});