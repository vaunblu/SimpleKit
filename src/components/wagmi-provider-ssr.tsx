"use client";

// 1. Import modules
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider as WagmiProviderRoot, State } from "wagmi";
import { getConfig } from "@/lib/wagmi-config";

// Make sure to replace the projectId with your own WalletConnect Project ID,
// if you wish to use WalletConnect (recommended)!
const projectId = "78fa76a3de0f683106888b43443018b8";

// 2. Define your Wagmi config
const config = getConfig();

// 3. Initialize your new QueryClient
const queryClient = new QueryClient();

// 4. Create your Wagmi provider
export function WagmiProvider(props: {
  initialState: State | undefined;
  children: React.ReactNode;
}) {
  return (
    <WagmiProviderRoot config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProviderRoot>
  );
}
