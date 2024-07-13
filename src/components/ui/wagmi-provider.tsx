"use client";

// 1. Import modules
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as WagmiProviderBase, http, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";

// Make sure to replace the projectId with your own WalletConnect Project ID,
// if you wish to use WalletConnect (recommended)!
const projectId = "78fa76a3de0f683106888b43443018b8";

// 2. Define your Wagmi config
const config = createConfig({
  chains: [mainnet],
  connectors: [coinbaseWallet(), walletConnect({ projectId })],
  transports: {
    [mainnet.id]: http(),
  },
});

// 3. Initialize your new QueryClient
const queryClient = new QueryClient();

// 4. Create your Wagmi provider
export function WagmiProvider(props: { children: React.ReactNode }) {
  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProviderBase>
  );
}
