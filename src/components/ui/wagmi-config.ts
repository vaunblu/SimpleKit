import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { mainnet } from "wagmi/chains";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";

// Make sure to replace the projectId with your own WalletConnect Project ID,
// if you wish to use WalletConnect!
const projectId = "78fa76a3de0f683106888b43443018b8";

export function getConfig() {
  return createConfig({
    chains: [mainnet],
    connectors: [coinbaseWallet(), walletConnect({ projectId })],
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
    transports: {
      [mainnet.id]: http(),
    },
  });
}

export const config = getConfig();
